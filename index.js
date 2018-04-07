const Hapi = require("hapi");

const env = process.env.NODE_ENV || "development";
const port = process.env.PORT || 3000;

module.exports = async () => {
  const server = new Hapi.Server({ port, host: "localhost" });

  const conf = require("./conf")(env);
  const database = require("./src/database")(conf, env);
  const models = require("./src/models")(database);

  await database.sync({});

  const schemas = require("./src/schemas")();
  const exceptions = require("./src/services/exceptions");
  const services = require("./src/services")(schemas, models, exceptions);
  const route = require("./src/routers")(services, exceptions);

  route(server);

  return server;
};
