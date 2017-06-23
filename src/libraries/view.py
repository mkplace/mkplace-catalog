# -*- encoding: utf-8 -*-

# @author David Silva - @inonjs
# @see platform.mkplace.com.br/developers

import requests, json

class utils(object):

    endpoint = None

    def get_api( self, path ):
        url = "http://web:9000%s" % (path)
        headers = {'Host': self.endpoint}
        r = requests.get(url, headers=headers)
        return json.loads(r.text)


    def post_api( self, path, data ):
        url = "http://web:9000%s" % (path)
        headers = {'Host': self.endpoint, 'Content-Type': 'application/json'}
        r = requests.post(url, headers=headers, json = data)

        try:
            return json.loads(r.text)
        except Exception as e:
            return {}


    class category_object(object):
        def __str__(self): return "mkplace category object"

        def __init__(self, object):
            for k in object: setattr(self, k, object.get(k))
            self.configure()

        def configure(self):
            bread_paths = "/" . join([tree.get('slug') for tree in self.breadcrumb_tree])
            bread_len = len(self.breadcrumb_tree)

            level = {1 : "d", 2 : "c", 3 : "s"}[bread_len]

            self.link = "/%s/%s/%s" % (level, bread_paths, str(self.breadcrumb_tree[bread_len - 1].get('id')))
            self.slugs = "%s" % (bread_paths)


    class image_object(object):

        def __str__(self): return "mkplace image object"

        def __init__(self, object):
            for k in object: setattr(self, k, object.get(k))

        def path(self):
            return self.image.get('file')['path']

        def resize(self, width, height):
            return "%s?width=%s&height=%s" % (self.image.get('file')['path'].replace("https://mkplace-platform.s3.amazonaws.com", "http://static.cdn-mkplace.com.br"), str(width), str(height))


    class buy_box_object(object):

        def __str__(self): return "mkplace buybox object"

        def __init__(self, object):
            sku_simulation = object.get('pricing').get('4', None)

            if sku_simulation:
                sku_simulation[ 'best_offer' ] = sku_simulation.get('offers')[int(sku_simulation.get('best_offer_index'))]

                for k in sku_simulation:
                    setattr(self, k, object.get(k))

                self.best_offer = sku_simulation[ 'best_offer' ]


    # created with sku describe
    class sku_object(object):

        def __str__(self): return "mkplace sku object"


        def __init__(self, object, product, endpoint = None):
            for k in object: setattr(self, k, object.get(k))
            self.product = product
            self.endpoint = endpoint
            self.configure()


        def configure(self):

            self.link = "%s/%s" % (self.product.link, str(self.id) )

            util = utils()
            util.endpoint = self.endpoint

            self.images = [ util.image_object( image ) for image in self.sku_images ]

            simulation = {
                "skus" : [{"id" : self.id, "quantity" : 1}]
            }

            self.pricing = util.post_api("/api/pricing/simulation?format=json", simulation)['result']

            sku_pricing = self.pricing['skus'][str(self.id)]

            self.is_voucher = sku_pricing['info']['is_voucher']
            self.is_only_callcenter = sku_pricing['info']['is_only_callcenter']

            if self.pricing.get('skus', None) and len(sku_pricing['offers']) > 0:
                self.available = True
                self.offer = sku_pricing['offers'][ sku_pricing['selected_offer_index'] ]
                self.offers = sku_pricing['offers']
            else:
                self.available = False
                self.offer = None



    # created with product describe
    class product_object(object):

        def __str__(self): return "mkplace product object"

        def __init__(self, object, endpoint = None):
            for k in object: setattr(self, k, object.get(k))
            self.endpoint = endpoint
            self.configure()

        def configure(self):

            self.current_sku = None

            util = utils()
            util.endpoint = self.endpoint

            self.breadcrumbs = []

            idx = 0
            for category in self.breadcrumb:
                category[ 'breadcrumb_tree' ] = []

                if idx == 0:

                    prev_category = self.breadcrumb[0]
                    category[ 'breadcrumb_tree' ].append({"slug" : prev_category.get('slug'), "id" : prev_category.get('id')})

                elif idx == 1:

                    prev_category = self.breadcrumb[0]
                    category[ 'breadcrumb_tree' ].append({"slug" : prev_category.get('slug'), "id" : prev_category.get('id')})

                    prev_category = self.breadcrumb[1]
                    category[ 'breadcrumb_tree' ].append({"slug" : prev_category.get('slug'), "id" : prev_category.get('id')})

                elif idx == 2:

                    prev_category = self.breadcrumb[0]
                    category[ 'breadcrumb_tree' ].append({"slug" : prev_category.get('slug'), "id" : prev_category.get('id')})

                    prev_category = self.breadcrumb[1]
                    category[ 'breadcrumb_tree' ].append({"slug" : prev_category.get('slug'), "id" : prev_category.get('id')})

                    prev_category = self.breadcrumb[2]
                    category[ 'breadcrumb_tree' ].append({"slug" : prev_category.get('slug'), "id" : prev_category.get('id')})

                self.breadcrumbs.append( util.category_object( category ) )

                idx += 1

            self.category = self.breadcrumbs[ len(self.breadcrumbs) - 1 ]

            self.link = "/%s/%s/p/%s" % (self.category.slugs, self.slug, str(self.id) )

            if self.current_sku_id:
                for sku in self.skus:
                    if int(sku.get('id')) == int(self.current_sku_id):
                        self.current_sku = util.sku_object( sku, self, self.endpoint )



class view(utils):

    def __init__(self, request, customer_auth, session, params = {}):
        self.customer_auth = session.get('customer', {})
        self.session = session
        self.endpoint = request.host
        self.request = request
        self.dispacher_param = None
        self.params = params
        self.get_layout( type = self.layout_type or "custom" )
        self.get_sessionid()
        self.run()


    def get_sessionid(self):
        if self.session.get('sessionid', None):
            return self.session.get('sessionid')
        else:
            import uuid
            sessionid = uuid.uuid4()
            self.session['sessionid'] = str(sessionid)
            return sessionid


    def route_manager( self, route, type ):

        if route.get('auth_required', False) == True:
            if not self.session.get('customer', None):

                action = route.get('if_not_authenticed', 'login_page') or "login_page"

                if action == "login_page":
                    self.dispacher_param = {"url" : "/login?next=" + self.request.path, "action" : "redirect"}


    def get_layout( self, type ):

        route = {
            "shopping_cart" : {
                "auth_required" : False,
                "template_path" : "default-shopping-cart"
            },
            "home_page" : {
                "auth_required" : False,
                "template_path" : "default-home-page"
            },
            "product_detail" : {
                "auth_required" : False,
                "template_path" : "default-product-page"
            },
            "search" : {
                "auth_required" : False,
                "template_path" : "default-search"
            },
            "login_page" : {
                "auth_required" : False,
                "template_path" : "default-login-page"
            },
            "custom_page" : {
                "auth_required" : False,
            },
            "checkout" : {
                "auth_required" : True,
                "template_path" : "default-checkout-page"
            },
            "register_page" : {
                "auth_required" : False,
                "template_path" : "default-register-page"
            },
            "address_page" : {
                "auth_required" : True,
                "template_path" : "default-address-page"
            },
            "myaccount_info" : {
                "auth_required" : True,
                "template_path" : "default-myaccount-info-page"
            },
            "myaccount_order" : {
                "auth_required" : True,
                "template_path" : "default-myaccount-order-page"
            },
            "myaccount_address" : {
                "auth_required" : True,
                "template_path" : "default-myaccount-address-page"
            }
        }[type]

        self.route_manager( route, type )

        found_template = True

        self.view_params = {}

        self.manufactures = self.get_api("/api/front/manufacturer_list?format=json").get('result')


    def get_banner( self, slot ):
        try:
            banner = self.get_api("/api/front/banner?format=json&slot=%s" % slot)['result']
        except Exception as e:
            banner = None
        return banner



    def get_cartdrige( self, by_hash ):

        try:
            skus = self.get_api("/api/front/cartridge?format=json&hash=%s" % by_hash)['result']
        except Exception as e:
            skus = []

        if not len(skus): return []

        return [ self.product_object( sku, endpoint = self.endpoint ) for sku in skus ]
