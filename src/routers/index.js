module.exports = (services, exceptions) => {
  const productsRouter = require("./products")(services, exceptions);
  const ordersRouter = require("./orders")(services, exceptions);
  const billsRouter = require("./bills")(services, exceptions);

  return server => {
    server.route([
      {
        method: "GET",
        path: "/products",
        handler: productsRouter.list
      },
      {
        method: "DELETE",
        path: "/products",
        handler: productsRouter.removeAll
      },
      {
        method: "POST",
        path: "/products",
        handler: productsRouter.create
      },
      {
        method: "GET",
        path: "/products/{id}",
        handler: productsRouter.find
      },
      {
        method: "GET",
        path: "/bills",
        handler: billsRouter.list
      },
      {
        method: "DELETE",
        path: "/bills",
        handler: billsRouter.removeAll
      },
      {
        method: "POST",
        path: "/orders",
        handler: ordersRouter.create
      },
      {
        method: "GET",
        path: "/orders",
        handler: ordersRouter.list
      },
      {
        method: "DELETE",
        path: "/orders",
        handler: ordersRouter.removeAll
      },
      {
        method: "GET",
        path: "/orders/{id}",
        handler: ordersRouter.find
      },
      {
        method: "PUT",
        path: "/orders/{id}/status",
        handler: ordersRouter.updateStatus
      }
    ]);
  };
};
