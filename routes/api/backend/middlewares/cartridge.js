let mkplaceapi = require('../../../../platform').client();
var url = require('url');

module.exports = function (req, res, next) {
    let hash = req.query.hash;

    mkplaceapi.cartridge(hash).then(function (data) {
        if (!data) return res.json({});
        let items = [];

        data.result.forEach(function (el) {
            
            let tmp_img_cdn = url.parse(el.skus[0].sku_image);
            let tmp_product = {
                product_name: el.name,
                name: el.skus[0].name,
                product_name: el.name,
                id: el.id, // product id
                sku_id: el.skus[0].id, //sku_id
                link: el.link,
                image: el.skus[0].sku_image,
                image_cdn: 'http://cdn.mkplace.com.br' + tmp_img_cdn.path,
                price: null,
                offer: null,
                product_attributes: el.attributes,
                sku_attributes: el.skus[0].attributes
            };
            items.push(tmp_product);
        });

        return res.json(items);
    }).catch(function (err) {
        return next(err);
    })
};
