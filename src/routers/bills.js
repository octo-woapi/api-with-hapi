module.exports = ({ bills }) => {
  return {
    async list(req, h) {
      const billList = await bills.list();
      return h.response(billList).code(200);
    },

    async removeAll(req, h) {
      bills.removeAll();
      return h.response().code(204);
    }
  };
};
