module.exports = (schemas, models) => {
  async function list(request, h) {
    let billList = await models.Bill.findAll();
    return h.response(billList).code(200);
  }

  async function removeAll(request, h) {
    const billList = await models.Bill.findAll();
    billList.forEach(bill => bill.destroy());
    return h.response().code(204);
  }

  return { list, removeAll };
};
