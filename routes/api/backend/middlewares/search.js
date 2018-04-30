let mkplaceapi = require('../../../../platform').client();
let escapeRegExp = require('../../../../utils/escapeSpecialCharacters');
module.exports = function (req, res, next) {
    const DEFAULT_PAGE = 0;
    let term = req.query.term || '';
    let cat_list = (req.query.cat_list) ? req.query.cat_list.split(',') : false;
    let subcat_list = (req.query.subcat_list) ? req.query.subcat_list.split(',') : false;
    let manu_list = (req.query.manu_list) ? req.query.manu_list.split(',') : false;
    let attributes = (req.query.attrs) ? req.query.attrs.split('|') : false;
    let page = (req.query.page) ? req.query.page : DEFAULT_PAGE;
    let sort = (req.query.sort) ? req.query.sort : 'current_price%5C+asc';
    let filter = {};
    
    if (cat_list) {
        filter.cat_list = cat_list.map(escapeRegExp);
    }

    if (subcat_list) {
        filter.subcat_list = subcat_list.map(escapeRegExp);
    }

    if (manu_list) {
        filter.manufacturer_list = manu_list.map(escapeRegExp);
    }
    
    if (attributes) {
        let attributes_tmp = {}
        attributes.forEach(function (el) {
            if (el) {
                let [key, value] = el.split('=');
                attributes_tmp[key] = value.split(',').map(escapeRegExp);
            }
        });

        filter.attributes = attributes_tmp;
    }   

    // sample: localhost:3000/api/backend/search?term=tenis&attrs=Cor=marrom_escuro_e_marrom|Tamanho=60&subcat_list=feminimo,masculino
    mkplaceapi.search(term, page, sort, filter).then(function (data) {
        res.json(data.result);
    }).catch(function (err) {
        next(err);
    });
};
