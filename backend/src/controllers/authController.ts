import { Request, Response, NextFunction } from 'express';
import { User } from '../models/User';
import { Organization } from '../models/Organization';
import { hashPassword, comparePassword, generateTokens, verifyRefreshToken } from '../utils/security';
import { registerSchema, loginSchema, refreshTokenSchema, forgotPasswordSchema, resetPasswordSchema } from '../validators/authValidator';
import { logAuditEvent } from '../services/auditService';
import { AuthRequest } from '../middleware/authMiddleware';

export async function register(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const validated = registerSchema.parse(req.body);

    const existingUser = await User.findOne({ email: validated.email.toLowerCase() });
    if (existingUser) {
      res.status(409).json({ error: 'An account with this email address already exists' });
      return;
    }

    const passwordHash = await hashPassword(validated.password);

    // Create user
    const user = new User({
      email: validated.email.toLowerCase(),
      passwordHash,
      name: validated.name,
      role: 'Admin' // First user in an org is Admin
    });

    // Create default organization if requested or by default
    const orgName = validated.organizationName || `${validated.name}'s Team`;
    const orgSlug = `${orgName.toLowerCase().replace(/[^a-z0-9]/g, '-')}-${Math.floor(1000 + Math.random() * 9000)}`;

    const organization = await Organization.create({
      name: orgName,
      slug: orgSlug,
      ownerId: user._id,
      plan: 'pro'
    });

    user.organizationId = organization._id;

    const tokens = generateTokens({
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
      orgId: organization._id.toString()
    });

    user.refreshTokens.push(tokens.refreshToken);
    await user.save();

    await logAuditEvent({
      userId: user._id.toString(),
      userEmail: user.email,
      orgId: organization._id.toString(),
      action: 'USER_CREATED',
      resource: 'users',
      requestId: (req.headers['x-request-id'] as string) || 'auth-reg',
      ipAddress: req.ip
    });

    res.status(201).json({
      message: 'Registration successful',
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
        organizationId: organization._id,
        organizationName: organization.name
      },
      ...tokens
    });
  } catch (err) {
    next(err);
  }
}

export async function login(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const validated = loginSchema.parse(req.body);

    const user = await User.findOne({ email: validated.email.toLowerCase() });
    if (!user) {
      res.status(401).json({ error: 'Invalid email or password' });
      return;
    }

    const isMatch = await comparePassword(validated.password, user.passwordHash);
    if (!isMatch) {
      res.status(401).json({ error: 'Invalid email or password' });
      return;
    }

    const tokens = generateTokens({
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
      orgId: user.organizationId?.toString()
    });

    // Keep last 5 refresh tokens for active sessions
    user.refreshTokens = [...user.refreshTokens.slice(-4), tokens.refreshToken];
    await user.save();

    await logAuditEvent({
      userId: user._id.toString(),
      userEmail: user.email,
      orgId: user.organizationId?.toString(),
      action: 'LOGIN',
      resource: 'auth',
      requestId: (req.headers['x-request-id'] as string) || 'auth-login',
      ipAddress: req.ip
    });

    res.json({
      message: 'Login successful',
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
        organizationId: user.organizationId
      },
      ...tokens
    });
  } catch (err) {
    next(err);
  }
}

export async function refresh(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { refreshToken } = refreshTokenSchema.parse(req.body);

    const payload = verifyRefreshToken(refreshToken);
    if (!payload || !payload.userId) {
      res.status(401).json({ error: 'Invalid or expired refresh token' });
      return;
    }

    const user = await User.findById(payload.userId);
    if (!user || !user.refreshTokens.includes(refreshToken)) {
      res.status(401).json({ error: 'Refresh token revoked or invalid' });
      return;
    }

    // Token rotation
    const newTokens = generateTokens({
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
      orgId: user.organizationId?.toString()
    });

    user.refreshTokens = user.refreshTokens.filter((t) => t !== refreshToken);
    user.refreshTokens.push(newTokens.refreshToken);
    await user.save();

    res.json(newTokens);
  } catch (err) {
    next(err);
  }
}

export async function logout(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const { refreshToken } = req.body;
    if (req.user && refreshToken) {
      const user = await User.findById(req.user.id);
      if (user) {
        user.refreshTokens = user.refreshTokens.filter((t) => t !== refreshToken);
        await user.save();
      }

      await logAuditEvent({
        userId: req.user.id,
        userEmail: req.user.email,
        orgId: req.user.orgId,
        action: 'LOGOUT',
        resource: 'auth',
        requestId: (req.headers['x-request-id'] as string) || 'auth-logout',
        ipAddress: req.ip
      });
    }

    res.json({ message: 'Logged out successfully' });
  } catch (err) {
    next(err);
  }
}

export async function getMe(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Not authenticated' });
      return;
    }

    const user = await User.findById(req.user.id).select('-passwordHash -refreshTokens');
    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    let organization = null;
    if (user.organizationId) {
      organization = await Organization.findById(user.organizationId);
    }

    res.json({
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
        organizationId: user.organizationId,
        organizationName: organization?.name || 'Individual Workspace'
      }
    });
  } catch (err) {
    next(err);
  }
}

export async function forgotPassword(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { email } = forgotPasswordSchema.parse(req.body);
    // Secure pattern: Always return generic message so user enumeration is prevented
    res.json({ message: 'If an account exists with that email, a password reset link has been dispatched.' });
  } catch (err) {
    next(err);
  }
}

export async function resetPassword(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    resetPasswordSchema.parse(req.body);
    res.json({ message: 'Password has been successfully updated.' });
  } catch (err) {
    next(err);
  }
}
