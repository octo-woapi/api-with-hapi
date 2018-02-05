module.exports = (logger, schemas, models) => {
  return {
    bills: require("./bills")(schemas, models),
    products: require("./products")(schemas, models),
    orders: require("./orders")(schemas, models)
  };
};
