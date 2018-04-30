let mkplaceapi = require('../../../../platform').client();
module.exports = function (req, res, next) {
  let hash = req.body.hash;
  let shipping_address_id = req.body.shipping_address_id;
  let storecondition_id = req.body.storecondition_id;
  let customer_id = req.user.id
  let payment = req.body.payment || false;
  
  mkplaceapi.finish_buy(hash, shipping_address_id, storecondition_id, customer_id, payment).then(function(data) {
    return res.json(data);
  }).catch(function(err) {
    return res.json
  });
};
