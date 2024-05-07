import swaggerJSDoc from "swagger-jsdoc";
import { SwaggerUiOptions } from "swagger-ui-express";

const options: swaggerJSDoc.Options = {
  swaggerDefinition: {
    openapi: '3.1.0',
    tags: [
      {
        name: 'Products',
        description: 'API operations related to products.'
      }
    ],
    info: {
      title:'REST API Node.js / Express / TypeScript',
      version: '1.0.0',
      description: 'API Docs for Products'
    }
  },
  apis: [
    './src/router.ts'
  ]
};

const swaggerSpec = swaggerJSDoc(options);

const swaggerUIOptions: SwaggerUiOptions = {
  customCss:`
    .topbar-wrapper svg {
      display: none;
    }

    .swagger-ui .topbar a {
      content: 'Juan';
      height: 40px;
      width: auto;
    }

    .swagger-ui .topbar {
      background-color: #4338ca;
    }
  `,
  customSiteTitle: 'Documentación REST API Express / TypeScript',
  customfavIcon: "./assets/fav.png"
}

export default swaggerSpec;
export {
  swaggerUIOptions
}