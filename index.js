const Hapi = require("hapi");

const env = process.env.NODE_ENV || "development";
const port = process.env.PORT || 3000;

module.exports = async () => {
  const server = new Hapi.Server({ port, host: "localhost" });

  const conf = require("./conf")(env);
  const logger = require("./src/logger")(conf);
  const database = require("./src/database")(conf, env);
  const models = require("./src/models")(database);
  const schemas = require("./src/schemas")();
  const services = require("./src/services")(logger, schemas, models);

  await database.sync({});

  server.app.services = services;

  require("./src/routes")(server);

  return server;
};
