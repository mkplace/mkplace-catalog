
let ws = require('./ws.js'),
  _ = require('underscore'),
  utils = require('./libs/utils'),
  moment = require('moment'),
  connection;


let client = (endpoint, token) => {
  let _product = function (product, sku = '') {
    if (!product) throw Error('Please specify an product');

    var opt = { product_id: product };

    if (sku)
      opt['sku_id'] = sku;

    return connection.product(opt).get();
  };


  /**
   * performs an search in mkplace api
   *  @param term search term
   */
  let _search = function (term, page = 0, sort='current_price%5C+asc', filters) {
    // if (!term) throw Error('Please specify term search');
    if (typeof page == "undefined") throw Error('Please specify an page');

    filters = _.extend({
      cat_list: [],
      subcat_list: [],
      manufacturer_list: [],
      attributes: {}
    }, filters);

    if (filters.cat_list.constructor !== Array) throw Error('cat_list must be Array');
    if (filters.subcat_list.constructor !== Array) throw Error('subcat_list must be Array');
    if (filters.attributes.constructor !== Object) throw Error('attrib_list must be an object');

    var o = _.extend({ search: term || '', page: page, limit: 20 });
    if (filters.cat_list.length)
      o['filter_cat_name'] = filters.cat_list.join('|');

    if (filters.subcat_list.length)
      o['filter_sub_name'] = filters.subcat_list.join('|');

    if (filters.manufacturer_list.length)
      o['filter_manufacturer_name'] = filters.manufacturer_list.join('|');

    if (Object.keys(filters.attributes).length) {
      Object.keys(filters.attributes).forEach(function (el) {
        o['filter_sku_' + el] = filters.attributes[el].join('|');
      });
    }

    if (sort) {
      o['sort'] = sort;
    }

    return connection.search(o).get();
  };

  let _cart_update = function (quantity = 0, seller_offer_id = 0, extra) {
    if (!quantity)
      throw Error('quantity must be informed');

    if (!seller_offer_id)
      throw Error('Seller offer must be informed');

    extra = _.extend({ session_id: 0, customer_id: 0, sla_index: 0 }, extra);

    var o = {
      quantity: quantity,
      selleroffer_id: seller_offer_id,
      sla_index: extra.sla_index
    };

    if (extra.customer_id && extra.session_id) {
      o['session'] = {
        'customer_id': extra.customer_id,
        'id': extra.session_id
      };
    } else if (extra.session_id) {
      o['session'] = {
        'id': extra.session_id
      };
    } else {
      throw Error('session_id or customer_id must be informed');
    }

    return connection.cartupdate(o).post();
  };

  let _manufacturer = function () {
    return connection.manufacturer({}).get();
  };

  let _cartridge = function (hash) {
    if (!hash) throw Error('hash must be informed');
    return connection.cartridge({ hash: hash }).get();
  };

  let _banner = function (slot) {
    return connection.banner({ slot: slot }).get();
  };

  let _customer = function (customer_id) {
    if (!customer_id) throw Error('customer_id must be informed');
    var o = {
      session: {
        customer_id: customer_id
      }
    };
    return connection.customer(o).post();
  };

  let _customer_signup = function (customer) {
    if (customer.constructor !== Object) throw Error('Customer has to be a customer object');

    var mandatory_fields = [
      'first_name',
      'last_name',
      'birthday',
      'email',
      'password',
      'password_confirm',
      'document', // cpf
      'birthday',
      'cellphone.number',
      'cellphone.state_code',
      'telephone.number',
      'telephone.state_code',
    ];

    utils.checkMandatoryObjectFields(mandatory_fields, customer);


    customer.birthday = moment(customer.birthday, 'YYYY/MM/DD').format('YYYY-MM-DD');

    if (customer.document.cpf) {
      customer.document.cpf = customer.document.cpf.replace(/([^0-9])/g, '');
    } else {
      customer.document.cnpj = customer.document.cnpj.replace(/([^0-9])/g, '');
    }

    customer.cellphone.number = customer.cellphone.number.replace(/([^0-9])/g, '');

    return connection.customersignup(customer).post()
  };

  let _customer_auth = function (login, password) {
    let params = {
      login: login,
      password: password
    }
    return connection.customerauth(params).post();
  }

  let _customer_address = function (customer_id) {
    return connection.customergetaddress({ session: { customer_id: customer_id } }).post()
  };

  let _customer_add_address = function (customer_id, customer) {

    let mandatory = [
      'address',
      'number',
      'neighborhood',
      'city',
      'state',
      'zipcode'
    ];

    customer_obj = {
      address: customer.address,
      complement: (customer.complement) ? customer.complement : null,
      reference: (customer.reference) ? customer.reference : null,
      number: customer.number,
      neighborhood: customer.neighborhood,
      city: customer.city,
      state: customer.state,
      zipcode: customer.zipcode
    };


    utils.checkMandatoryObjectFields(mandatory, customer_obj);

    let params = {
      session: {
        customer_id: customer_id
      },
    }

    params = _.extend(params, customer_obj);

    return connection.customeraddaddress(params).post();
  };

  let _customer_update_address = function (address_id, customer) {

    let mandatory = [
      'address',
      'number',
      'neighborhood',
      'city',
      'state',
      'zipcode'
    ];

    customer_obj = {
      address: customer.address,
      complement: (customer.complement) ? customer.complement : null,
      reference: (customer.reference) ? customer.reference : null,
      number: customer.number,
      neighborhood: customer.neighborhood,
      city: customer.city,
      state: customer.state,
      zipcode: customer.zipcode
    };

    utils.checkMandatoryObjectFields(mandatory, customer_obj);

    let params = {}

    params = _.extend(params, customer_obj);

    return connection.customerupdateaddress(params, { id: address_id }).put();
  };

  let _customer_review_create = function (customer_id, rating) {
    if (!customer_id) throw Error('customer_id must be informed');

    let mandatory = ['sku_id', 'rating', 'title', 'comment'];

    utils.checkMandatoryObjectFields(mandatory, rating);

    let params = {
      session: {
        customer_id: rating.customer_id,
      },
      sku_id: rating.sku_id,
      rating: rating.rating,
      title: rating.title,
      comment: rating.comment
    }
    return connection.reviewcreate(params).post()
  };

  let _customer_retrieve_recovery_token = function ({ email }) {
    if (!email) throw Error('email must be informed');
    return connection.customer_retrieve_recovery_token({ email }).post();
  }

  let _customer_change_password = function ({ hash_customer, password, confirm_password, step }) {
    if (!hash_customer) throw Error('hash_customer must be informed');

    if (!password && step != 'validation') throw Error('password must be informed');

    if (!confirm_password && step != 'validation') throw Error('password confirm must be informed');

    return connection.customer_recovery_password({ hash_customer, password, confirm_password, step }).post();
  };

  let _customer_wishlist = function (customer_id) {
    if (!customer_id) throw Error('customer_id must be informed');

    let params = {
      customer_id: customer_id
    };
    return connection.wishlist(params).get();
  };

  let _customer_add_wishlist = function (customer_id, sku_id, remove) {
    let params = {
      session: {
        customer_id: customer_id
      },
      sku_id: sku_id,
      remove: remove
    }

    return connection.wishlist_add(params).post();
  }

  let _customer_update = function (customer_id, customer) {
    let params = _.extend({
      session: {
        customer_id: customer_id
      }
    }, customer);

    return connection.customer_update(params).post()
  }

  let _simulation_pricing = function (params) {
    let simulation = _.extend({
      coupon: null,
      zipcode: null

    }, params.simulation);

    let session = _.extend({
      id: null,
      customer_id: null
    }, params.session);

    let o = {
      session,
      promotion: {
        coupon: simulation.coupon
      },
      shipping: {
        zipcode: simulation.zipcode
      }
    };

    if (simulation.skus) o.skus = simulation.skus;

    if (!(session.id || session.customer)) throw new Error('customer_id or session_id must be informed');

    return connection.simulation_values(o).post();
  }

  let _shopping_cart_delete = function (session_id) {
    let o = {
      where: JSON.stringify({
        sessionid: session_id
      })
    };

    return connection.shoppingcart(o).delete();
  }

  let _finish_buy = function (hash, shipping_address_id, storecondition_id, customer_id, payment) {
    let o = {
      hash: hash,
      shipping_address_id: shipping_address_id,
      storecondition_id: storecondition_id,
      session: {
        customer_id: customer_id
      },
    };

    if (payment) {
      o.payment = payment;
    }

    return connection.finish_buy(o).post();
  }

  let _customer_orders = function (customer_id, order_id = false) {
    let params = {
      customer_id: customer_id,
      populate: 'full-order'
    }
    if (order_id)
      params.order_id = order_id;

    return connection.customerorders(params).get();
  }

  let _customer_refresh = function (customer_id) {
    return connection.customerRefresh({ customer_id, customer_id }).post();
  }

  return {
    product: _product,
    search: _search,
    cart_update: _cart_update,
    manufacturer: _manufacturer,
    customer: _customer,
    customer_signup: _customer_signup,
    customer_auth: _customer_auth,
    customer_address: _customer_address,
    customer_add_address: _customer_add_address,
    customer_update_address: _customer_update_address,
    customer_review_create: _customer_review_create,
    customer_retrieve_recovery_token: _customer_retrieve_recovery_token,
    customer_change_password: _customer_change_password,
    customer_wishlist: _customer_wishlist,
    customer_add_wishlist: _customer_add_wishlist,
    customer_update: _customer_update,
    customer_orders: _customer_orders,
    customer_refresh: _customer_refresh,
    simulation_pricing: _simulation_pricing,
    cartridge: _cartridge,
    banner: _banner,
    shopping_cart_delete: _shopping_cart_delete,
    finish_buy: _finish_buy
  };
};

module.exports = {
  connect(endpoint, token) {
    connection = ws(endpoint, token);
  },
  client: () => {
    return client();
  }
};
