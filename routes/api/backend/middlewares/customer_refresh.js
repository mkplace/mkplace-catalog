let ws = require('../../../../platform').client();
module.exports = function (req, res, next) {
  let customer_id = req.user.id;
  if (!customer_id) return res.json({});
  ws.customer_refresh(customer_id).then(function (data) {
    return res.json(data.result);
  });
};
