module.exports = server => {
  server.route([
    {
      method: "GET",
      path: "/products",
      handler: server.app.services.products.list
    },
    {
      method: "DELETE",
      path: "/products",
      handler: server.app.services.products.removeAll
    },
    {
      method: "POST",
      path: "/products",
      handler: server.app.services.products.create
    },
    {
      method: "GET",
      path: "/products/{id}",
      handler: server.app.services.products.find
    },
    {
      method: "GET",
      path: "/bills",
      handler: server.app.services.bills.list
    },
    {
      method: "DELETE",
      path: "/bills",
      handler: server.app.services.bills.removeAll
    },
    {
      method: "POST",
      path: "/orders",
      handler: server.app.services.orders.create
    },
    {
      method: "GET",
      path: "/orders",
      handler: server.app.services.orders.list
    },
    {
      method: "DELETE",
      path: "/orders",
      handler: server.app.services.orders.removeAll
    },
    {
      method: "GET",
      path: "/orders/{id}",
      handler: server.app.services.orders.find
    },
    {
      method: "PUT",
      path: "/orders/{id}/status",
      handler: server.app.services.orders.updateStatus
    }
  ]);
};
