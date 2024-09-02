require("dotenv").config();

const Config = require("./config");

const config = new Config();

config.listen();
