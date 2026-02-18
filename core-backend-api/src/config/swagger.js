import swaggerJsdoc from 'swagger-jsdoc';

export const swaggerSpec = swaggerJsdoc({
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Core Backend API',
      version: '1.0.0',
      description: 'Food + Insurance integration API',
    },
    servers: [{ url: '/api/v1' }],
    components: {
      securitySchemes: {
        cookieAuth: {
          type: 'apiKey',
          in: 'cookie',
          name: 'accessToken',
        },
      },
    },
  },
  apis: ['./src/docs/swaggerPaths.js'],
});
