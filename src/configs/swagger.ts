import swaggerJSDoc from 'swagger-jsdoc'
import ENV from './env'

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'Rasa Chatbot API',
    version: '1.0.0',
    description: 'This is the API documentation for Rasa Chatbot API.',
    license: {
      name: 'MIT',
      url: 'https://opensource.org/licenses/MIT'
    },
    author: 'Nguyen The Anh (Horob1)'
  },
  servers: [
    {
      url: ENV.BASE_URL
    }
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT' // Optional: chỉ để hiển thị đẹp
      }
    }
  },
  security: [
    {
      bearerAuth: [] // áp dụng mặc định cho toàn bộ API
    }
  ]
}

const options = {
  swaggerDefinition,
  apis: ['./src/mvc/routes/*.ts', './src/mvc/controllers/*.ts']
}

const swaggerSpec = swaggerJSDoc(options)

export default swaggerSpec
