# -*- encoding: utf-8 -*-

# -*- encoding: utf-8 -*-

import os, json, base64, datetime, time, jinja2, locale, requests

from flask import Flask, request, g, render_template, render_template_string, Response, session, redirect, send_from_directory

application = Flask( __name__ )

application.secret_key = 'A0Zr98j/3yX R~XHH!jmN]LWX/,?RT'

@application.route("/configure/", methods=['GET'])
def configure():
    application.jinja_loader = jinja2.ChoiceLoader([application.jinja_loader, jinja2.FileSystemLoader(["/var/www/mkplace-catalog/src/templates"]),])
    return render_template("configure.html"), 200


@application.route("/configure/publish", methods=['POST'])
def configure_publish():
    session['configuration'] = {"store" : "rednose"}
    return redirect("/")

@application.route("/configure/load", methods=['GET'])
def configure_load():
    session['configuration'] = {
        "ssh_keys" : [
            {"name" : "david key", "content" : "ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABAQC4ACDwbegDq7nYZKl0+842bOxE1HuHiEKqGYCyzMrNOGb0OrjQsLpuzeCexmcwnVa3MXALdq8ERiYKa919X9ekYZp19q5Bgmt3vQM7kdQ6yt0WRyMJD94nP2zCLgWwTCdZmg49a6YkxmEyzQQ4ND6yx9gWadyZ96YuBJR/2aG5JeYxLnZd1ohxNL3kgrrxSCUdzfSo6eLPuGcdD2JpKthTQUcB7lipvp6AOOPCiyBi4e0zWHRQEHceXAl7LP/+csABOqcsa9JhnsVN3j8y0mhvbey3nAYJp0tdKamUULcE/aZ8wFRavA2pBXAReKvD//FSVywkhHAqoBHqyqWm/UQ7 inonjs@MacBook-Pro.home"},
            {"name" : "bruno key", "content" : "ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABAQC4ACDwbegDq7nYZKl0+842bOxE1HuHiEKqGYCyzMrNOGb0OrjQsLpuzeCexmcwnVa3MXALdq8ERiYKa919X9ekYZp19q5Bgmt3vQM7kdQ6yt0WRyMJD94nP2zCLgWwTCdZmg49a6YkxmEyzQQ4ND6yx9gWadyZ96YuBJR/2aG5JeYxLnZd1ohxNL3kgrrxSCUdzfSo6eLPuGcdD2JpKthTQUcB7lipvp6AOOPCiyBi4e0zWHRQEHceXAl7LP/+csABOqcsa9JhnsVN3j8y0mhvbey3nAYJp0tdKamUULcE/aZ8wFRavA2pBXAReKvD//FSVywkhHAqoBHqyqWm/UQ7 inonjs@MacBook-Pro.home"}
        ],
        "clients" : [
            {
                "name" : "Rednose",
                "path" : "rednose",
                "sites" : [
                    {
                        "name" : "Rednose",
                        "path" : "rednose",
                        "repo" : "git@github.com:mkplace/front-madel.git",
                        "hosts" : ["dev.rednose.com.br"],
                        "accesskey" : null,
                        "env" : "staging"
                    }, {
                        "name" : "Rednose",
                        "path" : "rednose",
                        "repo" : "git@github.com:mkplace/front-madel.git",
                        "hosts" : [],
                        "accesskey" : null,
                        "env" : "staging"
                    }
                ]
            },
            {
                "name" : "Madel",
                "path" : "madel",
                "sites" : [
                    {
                        "name" : "Madel",
                        "path" : "rednose",
                        "repo" : "git@github.com:mkplace/front-madel.git",
                        "hosts" : [],
                        "accesskey" : null,
                        "env" : "staging"
                    }, {
                        "name" : "Madel",
                        "path" : "rednose",
                        "repo" : "git@github.com:mkplace/front-madel.git",
                        "hosts" : [],
                        "accesskey" : null,
                        "env" : "staging"
                    }
                ]
            }
        ]
    }
    return redirect("/")


@application.route('/configure/assets/<path:path>')
def send_static_configure(path):
    return send_from_directory("/var/www/mkplace-catalog/src/assets", path)


@application.route("/", methods=['GET'])
def home_route():

    if not session.get('configuration', None) is not None: return redirect("/configure")

    application.jinja_loader = jinja2.ChoiceLoader([application.jinja_loader, jinja2.FileSystemLoader(["/var/www/mkplace-catalog/src/rednose"]),])

    return render_template("index.html"), 200


@application.route('/assets/<path:path>')
def send_static(path):
    return send_from_directory("/var/www/mkplace-catalog/src/rednose", path)




































# def loader( class_name, params ):
#     return True
#
#
# def customer_auth( request ):
#     return session.get('customer_auth', {})
#
#
# def _jinja2_filter_datetime(date, fmt='%c'):
#     # check whether the value is a datetime object
#     if not isinstance(date, (datetime.date, datetime.datetime)):
#         date = datetime.datetime.strptime(str(date).split(' ')[0], '%Y-%m-%d').date()
#         try:
#             date = datetime.datetime.strptime(str(date), '%Y-%m-%d').date()
#         except Exception, e:
#             return date
#     return date.strftime(fmt)
#
#
# def _mk_money_format(money, prefix = ""):
#     locale.setlocale(locale.LC_ALL, 'pt_BR.UTF-8')
#     return locale.currency(money, grouping=True, symbol=prefix)
#
#
# def _mk_filter_translate(string, lang='PT'):
#     dicionary = {
#         "PT" : {
#             "CREATED" : "CRIADO",
#             "SENT" : "ENVIADO",
#             "PARTLY-SENT" : "PARC. ENVIADO",
#             "DELIVERED" : "ENTREGUE",
#             "PARTLY-DELIVERED" : "PARC. ENTREGUE",
#             "BILLED" : "FATURADO",
#             "PARTLY-BILLED" : "PARC. FATURADO",
#             "APPROVED" : "APROVADO"
#         }
#     }
#     return dicionary[lang].get(string, string)
#
#
# def dispacher( response, template ):
#
#     if response.dispacher_param:
#         if response.dispacher_param.get('action', '') == 'redirect':
#             return redirect( response.dispacher_param.get('url') )
#         elif response.dispacher_param.get('action', '') == 'no_template':
#             return response.dispacher_param.get('content', '')
#         elif response.dispacher_param.get('action', '') == 'json_response':
#             return json.dumps(response.dispacher_param.get('json', {}))
#
#     application.jinja_env.filters['datetime'] = _jinja2_filter_datetime
#     application.jinja_env.filters['mk_trans'] = _mk_filter_translate
#     application.jinja_env.filters['real_format'] = _mk_money_format
#     application.jinja_env.filters['strftime'] = datetime.datetime.strftime
#
#     return render_template(template, this = response, request = request, loader = loader ), 200

# PAGES
# @application.route("/pass/<resource>", methods=['GET', 'POST'])
# @application.route("/pass/<resource>/<action>", methods=['GET', 'POST'])
# def api_pass(resource, action):
#
#     if action:
#         path = "/api/%s/%s" % (resource, action)
#     else:
#         path = "/api/%s" % (resource)
#
#     data = {}
#     url = "http://web:9000%s?format=json" % path
#     headers = {'Host': request.host, 'Content-Type': 'application/json'}
#
#     if request.data:
#         data = json.loads(request.data)
#
#     data['session'] = {
#         "id" : str(session.get('sessionid')),
#     }
#
#     if session.get('customer'):
#         data['session']['customer_id'] = session.get('customer', {}).get('id', None)
#
#     r = requests.post(url, headers=headers, json = data)
#
#     response = json.loads(r.text)
#
#     if type(response.get('result')) == dict:
#         if response.get('result').get('store_on_session'):
#             for k in response.get('result').get('store_on_session'):
#                 session[ k ] = response.get('result').get('store_on_session')[k]
#
#     return r.text


# from views.home import home_page
# from views.product import product_page
# from views.buy_box import buy_box_page
# from views.search import search_page
# from views.custom import custom_page
# from views.login import login_page
# from views.myaccount_info import myaccount_info_page
# from views.myaccount_address import myaccount_address_page
# from views.myaccount_order import myaccount_order_page
# from views.register import register_page
# from views.checkout import checkout_page
# from views.shopping_cart import shopping_cart_page
#
# # HOME
# @application.route("/index.html", methods=['GET'])
# @application.route("/", methods=['GET'])
# def home_route():
#
#     configured = False
#
#     if not configured:
#         return redirect("/configure")
#
#     return dispacher( response = home_page( request = request, customer_auth = {}, session = session, params = {} ), template = "template/home.html" )
#
#
# # MYACCOUNT
# @application.route("/account/info", methods=['GET'])
# def myaccount_info_route():
#     return dispacher( myaccount_info_page( request = request, customer_auth = customer_auth(request), session = session ), template = "template/account/info.html" )
#
#
# @application.route("/account/address", methods=['GET'])
# def myaccount_address_route():
#     return dispacher( myaccount_address_page( request = request, customer_auth = customer_auth(request), session = session ), template = "template/account/address.html" )
#
#
# @application.route("/account/order", methods=['GET'])
# def myaccount_order_route():
#     return dispacher( myaccount_order_page( request = request, customer_auth = customer_auth(request), session = session ), template = "template/account/order.html" )
#
#
# @application.route("/account/order/view", methods=['GET'])
# def myaccount_orderview_route():
#     return dispacher( myaccount_order_page( request = request, customer_auth = customer_auth(request), session = session ), template = "template/account/order.view.html" )
#
#
# # LOGIN
# @application.route("/login", methods=['GET'])
# @application.route("/login/", methods=['GET'])
# @application.route("/login", methods=['POST'])
# def login_route():
#     return dispacher( login_page( request = request, customer_auth = customer_auth(request), session = session ), template = "template/login.html"  )
#
#
# # LOGIN
# @application.route("/logout", methods=['GET'])
# def logout_route():
#     session['customer'] = None
#     return redirect("/")
#
# # REGISTER
# @application.route("/register", methods=['GET'])
# @application.route("/register/", methods=['GET'])
# @application.route("/register", methods=['POST'])
# def register_route(): return dispacher( register_page( request = request, customer_auth = customer_auth(request), session = session ), template = "template/register.html" )
#
# # PAGES
# @application.route("/<page_slug>", methods=['GET'])
# @application.route("/<page_slug>.html", methods=['GET'])
# @application.route("/<page_slug>/", methods=['GET'])
# def custom_route(page_slug):
#     return dispacher( custom_page( request = request, customer_auth = customer_auth(request), session = session, params = {"page_slug" : page_slug} ), template = "pages/" + page_slug + ".html" )
#
#
# # SHOPPING CART
# @application.route("/shopping-cart", methods=['GET'])
# def shopping_cart_route(): return dispacher( shopping_cart_page( request = request, customer_auth = customer_auth(request), session = session ), template = "template/shoppingcart.html" )
#
#
# # CHECKOUT
# @application.route("/checkout", methods=['GET','POST'])
# def checkout_route(): return dispacher( checkout_page( request = request, customer_auth = customer_auth(request), session = session ), template = "template/checkout.html" )
#
#
# # CATEGORY PAGE
# @application.route("/d/<department_slug>/<id>", methods=['GET'])
# @application.route("/c/<department_slug>/<category_slug>/<id>", methods=['GET'])
# @application.route("/s/<department_slug>/<category_slug>/<subcategory_slug>/<id>", methods=['GET'])
# def category_route(department_slug = None, category_slug = None, subcategory_slug = None, id = None):
#     level = request.path.split('/')[1]
#     params = {"search_type" : {"d" : "department", "c" : "category", "s" : "subcategory"}[level]}
#     params['department'] = department_slug
#     params['category'] = category_slug
#     params['subcategory'] = subcategory_slug
#     params['id'] = id
#     return dispacher( search_page( request = request, customer_auth = customer_auth(request), session = session, params = params ), template = "template/search.html" )
#
#
# # SEARCH PAGE
# @application.route("/search", methods=['GET'])
# @application.route("/busca", methods=['GET'])
# def search_route():
#     params = {"search_type" : "query"}
#     return dispacher( search_page( request = request, customer_auth = customer_auth(request), session = session, params = params ), template = "template/search.html" )
#
#
# # PRODUCT DETAIL
# @application.route("/<department_slug>/<product_slug>/p/<product_id>", methods=['GET'])
# @application.route("/<department_slug>/<product_slug>/p/<product_id>/<sku_id>", methods=['GET'])
# @application.route("/<department_slug>/<category_slug>/<product_slug>/p/<product_id>", methods=['GET'])
# @application.route("/<department_slug>/<category_slug>/<product_slug>/p/<product_id>/<sku_id>", methods=['GET'])
# @application.route("/<department_slug>/<category_slug>/<subcategory_slug>/<product_slug>/p/<product_id>", methods=['GET'])
# @application.route("/<department_slug>/<category_slug>/<subcategory_slug>/<product_slug>/p/<product_id>/<sku_id>", methods=['GET'])
# def product_route(department_slug = None, category_slug = None, subcategory_slug = None, product_slug = None, product_id = None, sku_id = None):
#     return dispacher( product_page( request = request, customer_auth = customer_auth(request), session = session, params = {"product_slug" : product_slug, "product_id" : product_id, "sku_id" : sku_id} ), template = "template/product.html" )


if __name__ == "__main__": application.run(host="0.0.0.0", port=8000, debug = True, threaded=True)
