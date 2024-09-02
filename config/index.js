const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

class Config {
  constructor() {
    this.app = express();
    this.port = process.env.PORT;
    this.middlewares();
    this.connectDatabase();
    this.routes();
  }

  middlewares() {
    this.app.use(cors({ origin: "http://localhost:4200" }));
    this.app.use(express.json());
    this.app.use(express.static("public"));
  }

  async connectDatabase() {
    try {
      await mongoose.connect(process.env.DATABASE_MONGO, {
        connectTimeoutMS: 5000,
        socketTimeoutMS: 5000,
      });
      console.log("Mongo Database connected.");
    } catch (error) {
      console.log("Hubo un error al conectarse a la base de datos: ", error);
      process.exit(1);
    }
  }

  routes() {
    //* Api schedules
    this.app.use("/users", require("../routes/user"));
  }

  listen() {
    this.app.listen(this.port, () => {
      console.log("Running on: http://localhost:" + this.port);
    });
  }
}

module.exports = Config;
