module.exports = ({ orders }, { MissingResourceError }) => {
  return {
    async updateStatus(req, h) {
      const { id } = req.params;
      const { status } = req.payload;
      try {
        await orders.updateStatus(id, status);
        return h.response().code(200);
      } catch (e) {
        return h.response({ data: e.data || e.message }).code(getStatusCode(e));
      }
    },

    async find(req, h) {
      const { id } = req.params;
      try {
        const order = await orders.find(id);
        return h.response(order).code(200);
      } catch (e) {
        return h.response({ data: e.data || e.message }).code(getStatusCode(e));
      }
    },

    async list(req, h) {
      const { sort } = req.query;
      try {
        const orderList = await orders.list(sort);
        return h.response(orderList).code(200);
      } catch (e) {
        return h.response({ data: e.data || e.message }).code(getStatusCode(e));
      }
    },

    async create(req, h) {
      const { payload } = req;
      try {
        const id = await orders.create(payload);
        return h
          .response()
          .header("Location", `/orders/${id}`)
          .code(201);
      } catch (e) {
        return h.response({ data: e.data || e.message }).code(getStatusCode(e));
      }
    },

    async removeAll(req, h) {
      try {
        await orders.removeAll();
        return h.response().code(204);
      } catch (e) {
        return h.response({ data: e.data || e.message }).code(getStatusCode(e));
      }
    }
  };

  function getStatusCode(error) {
    if (error instanceof MissingResourceError) {
      return 404;
    } else {
      return 400;
    }
  }
};
