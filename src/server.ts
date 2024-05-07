import express from "express";
import router from "./router";
import db from "./config/db";
import colors from 'colors';
import cors, { CorsOptions } from 'cors';
import morgan from 'morgan';
import swaggerUI from "swagger-ui-express";
import swaggerSpec, { swaggerUIOptions } from "./config/swagger";

// Conectar a BDD
export async function connectDB() {
  try {
    await db.authenticate();
    db.sync();
    // console.log( colors.bgGreen.bold('Conectado a la Base de Datos.'));
  } catch (error) {
    // console.log(error);
    console.log( colors.red.bold('Hubo un error al conectar la Base de Datos.'));
  }
}
connectDB();

// Instancia de Express
const server = express();

// Permitir CORS
const corsOptions: CorsOptions = {
  origin: function(origin, callback){
    if (origin === process.env.FRONTEND_URL) {
      callback(null, true);
    } else {
      callback(new Error('CORS Error...!'));
    }
  }
};

server.use(cors(corsOptions));

// Leer datos de formularios
server.use(express.json());

// Usar Morgan
server.use(morgan('dev'));

server.use('/api/products', router);

// Docs (Swagger creará un cliente donde se podrá ver la documentación.)
server.use('/docs', swaggerUI.serve, swaggerUI.setup(swaggerSpec, swaggerUIOptions));

export default server;