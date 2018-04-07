module.exports = ({ products }, { MissingResourceError }) => {
  return {
    async find(req, h) {
      const { id } = req.params;
      try {
        const product = await products.find(id);
        return h.response(product).code(200);
      } catch (e) {
        return h.response({ data: e.data || e.message }).code(getStatusCode(e));
      }
    },

    async list(req, h) {
      const { sort } = req.query;
      try {
        const productList = await products.list(sort);
        return h.response(productList).code(200);
      } catch (e) {
        return h.response({ data: e.data || e.message }).code(getStatusCode(e));
      }
    },

    async create(req, h) {
      const { payload } = req;
      try {
        const id = await products.create(payload);
        return h
          .response()
          .header("Location", `/products/${id}`)
          .code(201);
      } catch (e) {
        return h.response({ data: e.data || e.message }).code(getStatusCode(e));
      }
    },

    async removeAll(req, h) {
      try {
        products.removeAll();
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
