const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Fintech API Documentation",
      version: "1.0.0",
      description: "API documentation for Role & Permission module",
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    servers: [
      {
        url: `${process.env.FRONTEND_URL}/api/${process.env.CURRENT_VERSION}`,
        description: "Local server",
      },
    ],
  },

  apis: [
    "./routes/"+process.env.CURRENT_VERSION+"/*.js", 
    "./models/*.js"
  ],
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;