const Joi = require("joi");

module.exports = (schemas, models) => {
  async function create(request, h) {
    const { error } = Joi.validate(request.payload, schemas.Product, {
      abortEarly: false
    });

    if (error) {
      const errorMessage = error.details.map(({ message, context }) =>
        Object.assign({ message, context })
      );

      return h.response({ data: errorMessage }).code(400);
    }

    const product = await models.Product.create(request.payload);
    return h
      .response()
      .code(201)
      .header("Location", `/products/${product.id}`);
  }

  async function list(request, h) {
    let productList = await models.Product.findAll();
    const { sort } = request.query;
    productList = productList.sort((a, b) => {
      if (a[sort] < b[sort]) return -1;
      if (a[sort] > b[sort]) return 1;
      return 0;
    });
    return h.response(productList).code(200);
  }

  async function find(request, h) {
    const { id } = request.params;
    const product = await models.Product.findById(id);
    if (!product) return h.response().code(404);
    return h.response(product.toJSON()).code(200);
  }

  async function removeAll(request, h) {
    const productList = await models.Product.findAll();
    productList.forEach(product => product.destroy());
    return h.response().code(204);
  }

  return { find, list, create, removeAll };
};
