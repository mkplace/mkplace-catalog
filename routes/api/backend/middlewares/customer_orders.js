let ws = require('../../../../platform').client();

module.exports = function (req, res, next) {
  let customer_id = req.user.id;
  let order_id = req.query.order || false;

  ws.customer_orders(customer_id, order_id).then(function(data) {
    res.json(data);
  }).catch(function(err){
    res.json(err);
  })
};
