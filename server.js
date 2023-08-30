import express from "express";
import cors from "cors";
import fileUpload from "express-fileupload";
import { db } from "./src/database/connection.js";
import { routerUser } from "./routes/User.js";
import { routerPhone } from "./routes/Phone.js";
import { routerAgency } from "./routes/Agency.js";
import { routerSchedule } from "./routes/Schedule.js";

const whiteList = ["http://localhost:3000"];
const corsOptions = {
  origin: (origin, callback) => {
    const exist = whiteList.some((domain) => domain === origin);
    if (exist) {
      callback(null, true);
    } else {
      callback(new Error("Access denied"));
    }
  },
};

//server
class Server {
  constructor() {
    this.app = express();
    this.port = process.env.PORT;
    this.userPath = "/api/User";
    this.agencyPath = "/api/Agency";
    this.phonePath = "/api/Phone";
    this.schedulePath = "/api/Schedule";
    //Conexion a bd
    this.dbConnection();

    //Middlewares
    this.middlewares();

    //Rutas de mi aplicacion
    this.routes();
  }

  middlewares() {
    // son funciones que se ejecutan siempre que se levante el servidor

    //CORS
    this.app.use(cors());

    //Lectura y paseo del body
    this.app.use(express.json());

    //directorio publico
    this.app.use(express.static("public"));

    //subida de archivos al servidor
    this.app.use(
      fileUpload({
        useTempFiles: true,
        tempFileDir: "/tmp/",
      })
    );
  }

  async dbConnection() {
    try {
      await db.authenticate();
      console.log("DB online");
    } catch (error) {
      throw new Error(error);
    }
  }

  routes() {
    this.app.use(this.userPath, routerUser);
    this.app.use(this.phonePath, routerPhone);
    this.app.use(this.agencyPath, routerAgency);
    this.app.use(this.schedulePath, routerSchedule);
  }

  listen() {
    this.app.listen(this.port, () => {
      console.log(
        "Servidor corriendo en el puerto http://localhost:",
        this.port
      );
    });
  }
}

export { Server };
