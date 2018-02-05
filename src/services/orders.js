const Joi = require("joi");
const Sequelize = require("sequelize");
const Op = Sequelize.Op;

module.exports = (schemas, models) => {
  async function create(request, h) {
    const { error } = Joi.validate(request.payload, schemas.Order, {
      abortEarly: false
    });

    if (error) {
      const errorMessage = error.details.map(({ message, context }) =>
        Object.assign({ message, context })
      );
      return h.response({ data: errorMessage }).code(400);
    }

    const productList = await models.Product.findAll({
      where: {
        id: { [Op.in]: request.payload.product_list.map(id => parseInt(id, 0)) }
      }
    });

    if (productList.length === 0) {
      return h
        .response({
          data: [
            { message: "Unknown products", context: { key: "product_list" } }
          ]
        })
        .code(400);
    }

    const productListData = productList.map(product => product.toJSON());

    const orderTotalWeight = productListData
      .map(p => p.weight)
      .reduce((prev, cur) => prev + cur, 0);

    const orderProductListPrice = productListData
      .map(p => p.price)
      .reduce((prev, cur) => prev + cur, 0);

    const SHIPMENT_PRICE_STEP = 25;
    const SHIPMENT_WEIGHT_STEP = 10;
    const orderShipmentPrice =
      SHIPMENT_PRICE_STEP * Math.round(orderTotalWeight / SHIPMENT_WEIGHT_STEP);

    let totalAmount = orderProductListPrice + orderShipmentPrice;

    const DISCOUNT_THRESHOLD = 1000;
    const DISCOUNT_RATIO = 0.95;
    if (totalAmount > DISCOUNT_THRESHOLD) {
      totalAmount = totalAmount * DISCOUNT_RATIO;
    }

    const orderData = Object.assign(
      {
        total_amount: totalAmount,
        shipment_amount: orderShipmentPrice,
        total_weight: orderTotalWeight
      },
      { product_list: request.payload.product_list }
    );

    const order = await models.Order.create(orderData);
    return h
      .response()
      .header("Location", `/orders/${order.id}`)
      .code(201);
  }

  async function list(request, h) {
    let orderList = await models.Order.findAll();
    const { sort } = request.query;
    orderList = orderList.sort((a, b) => {
      if (a[sort] < b[sort]) return -1;
      if (a[sort] > b[sort]) return 1;
      return 0;
    });
    return h.response(orderList).code(200);
  }

  async function find(request, h) {
    const { id } = request.params;
    const order = await models.Order.findById(id);
    if (!order) return h.response().code(404);
    return h.response(order.toJSON()).code(200);
  }

  async function removeAll(request, h) {
    const orderList = await models.Order.findAll();
    orderList.forEach(order => order.destroy());
    return h.response().code(204);
  }

  async function updateStatus(request, h) {
    const { id } = request.params;
    const order = await models.Order.findById(id);
    if (!order) return h.response().code(404);

    const { status } = request.payload;
    if (!["pending", "paid", "cancelled"].includes(status)) {
      return h.response().code(400);
    }

    if (status === "paid") {
      models.Bill.create({ total_amount: order.toJSON().total_amount });
    }

    await order.update({ status });

    return h.response().code(200);
  }

  return { create, find, list, removeAll, updateStatus };
};
