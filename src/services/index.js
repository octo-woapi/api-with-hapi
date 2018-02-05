module.exports = (logger, schemas, models) => {
  return {
    // utils: require("./utils")(logger),
    bills: require("./bills")(schemas, models),
    products: require("./products")(schemas, models),
    orders: require("./orders")(schemas, models)
  };
};
