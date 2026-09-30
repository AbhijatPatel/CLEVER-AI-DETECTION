import { Router } from 'express';
import { register, login, refresh, logout, getMe, forgotPassword, resetPassword } from '../controllers/authController';
import {
  createTextAnalysis,
  createMediaAnalysis,
  getAnalysisById,
  listAnalyses,
  deleteAnalysis,
  getDashboardStats
} from '../controllers/analysisController';
import { createReport, downloadReport, listReports } from '../controllers/reportController';
import { listTeamMembers, inviteTeamMember, listApiKeys, createApiKeyEndpoint, deleteApiKeyEndpoint } from '../controllers/teamController';
import { listAuditLogs } from '../controllers/auditController';
import { authenticateToken } from '../middleware/authMiddleware';
import { upload } from '../middleware/uploadMiddleware';

const router = Router();

// Public Health & Readiness
router.get('/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

router.get('/ready', (req, res) => {
  res.json({ ready: true, service: 'clever-ai-api-gateway' });
});

// Authentication
router.post('/auth/register', register);
router.post('/auth/login', login);
router.post('/auth/refresh', refresh);
router.post('/auth/logout', authenticateToken, logout);
router.get('/auth/me', authenticateToken, getMe);
router.post('/auth/forgot-password', forgotPassword);
router.post('/auth/reset-password', resetPassword);

// Dashboard Usage Analytics
router.get('/usage/dashboard-stats', authenticateToken, getDashboardStats);

// Analysis Endpoints
router.post('/analysis/text', authenticateToken, createTextAnalysis);
router.post('/analysis/document', authenticateToken, upload.single('file'), (req, res, next) => {
  req.params.modality = 'document';
  createMediaAnalysis(req, res, next);
});
router.post('/analysis/image', authenticateToken, upload.single('file'), (req, res, next) => {
  req.params.modality = 'image';
  createMediaAnalysis(req, res, next);
});
router.post('/analysis/audio', authenticateToken, upload.single('file'), (req, res, next) => {
  req.params.modality = 'audio';
  createMediaAnalysis(req, res, next);
});
router.post('/analysis/video', authenticateToken, upload.single('file'), (req, res, next) => {
  req.params.modality = 'video';
  createMediaAnalysis(req, res, next);
});

router.get('/analysis/:id', authenticateToken, getAnalysisById);
router.get('/analysis', authenticateToken, listAnalyses);
router.delete('/analysis/:id', authenticateToken, deleteAnalysis);

// Reports
router.post('/reports/:analysisId', authenticateToken, createReport);
router.get('/reports/:id/download', authenticateToken, downloadReport);
router.get('/reports', authenticateToken, listReports);

// Team & RBAC
router.get('/team/members', authenticateToken, listTeamMembers);
router.post('/team/invite', authenticateToken, inviteTeamMember);

// API Keys
router.get('/api-keys', authenticateToken, listApiKeys);
router.post('/api-keys', authenticateToken, createApiKeyEndpoint);
router.delete('/api-keys/:id', authenticateToken, deleteApiKeyEndpoint);

// Audit Logs
router.get('/audit-logs', authenticateToken, listAuditLogs);

export default router;
