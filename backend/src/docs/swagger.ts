export const swaggerDocument = {
  openapi: '3.0.0',
  info: {
    title: 'Clever AI - Content Intelligence & Digital Forensics API',
    version: '1.0.0',
    description: 'Enterprise REST API for explainable multi-modal AI content detection, digital forensics, file integrity verification, and audit logs.',
    contact: {
      name: 'Clever AI Engineering',
      email: 'api-support@clever.ai'
    }
  },
  servers: [
    { url: '/api/v1', description: 'Production / Local API Server' }
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT'
      },
      apiKeyAuth: {
        type: 'apiKey',
        in: 'header',
        name: 'x-api-key'
      }
    }
  },
  paths: {
    '/health': {
      get: {
        summary: 'Service Health Check',
        responses: { 200: { description: 'Service is operational' } }
      }
    },
    '/auth/register': {
      post: {
        summary: 'Register a new user account',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  email: { type: 'string', example: 'analyst@organization.com' },
                  password: { type: 'string', example: 'SecurePassword123' },
                  name: { type: 'string', example: 'Alex Morgan' },
                  organizationName: { type: 'string', example: 'Forensic Lab' }
                }
              }
            }
          }
        },
        responses: { 201: { description: 'User registered' } }
      }
    },
    '/auth/login': {
      post: {
        summary: 'Login user and receive JWT tokens',
        responses: { 200: { description: 'Logged in' } }
      }
    },
    '/analysis/text': {
      post: {
        summary: 'Submit text for multi-factor forensic AI detection',
        security: [{ bearerAuth: [] }, { apiKeyAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  text: { type: 'string', example: 'Furthermore, it is important to note the algorithmic nuances.' },
                  title: { type: 'string', example: 'Policy Analysis Document' }
                }
              }
            }
          }
        },
        responses: { 202: { description: 'Job enqueued' } }
      }
    },
    '/analysis/{id}': {
      get: {
        summary: 'Fetch complete analysis forensic dossier',
        security: [{ bearerAuth: [] }, { apiKeyAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: { 200: { description: 'Analysis record' } }
      }
    }
  }
};
