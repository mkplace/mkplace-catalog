# -*- encoding: utf-8 -*-

# -*- encoding: utf-8 -*-

import os, json, base64, datetime, time, jinja2, locale, requests

from flask import Flask, request, g, render_template, render_template_string, Response, session, redirect, send_from_directory

from views.home import home_page
from views.product import product_page
from views.buy_box import buy_box_page
from views.search import search_page
from views.custom import custom_page
from views.login import login_page
from views.myaccount_info import myaccount_info_page
from views.myaccount_address import myaccount_address_page
from views.myaccount_order import myaccount_order_page
from views.register import register_page
from views.checkout import checkout_page
from views.shopping_cart import shopping_cart_page

application = Flask( __name__ )

application.secret_key = 'A0Zr98j/3yX R~XHH!jmN]LWX/,?RT'

def _jinja2_filter_datetime(date, fmt='%c'):
    # check whether the value is a datetime object
    if not isinstance(date, (datetime.date, datetime.datetime)):
        date = datetime.datetime.strptime(str(date).split(' ')[0], '%Y-%m-%d').date()
        try:
            date = datetime.datetime.strptime(str(date), '%Y-%m-%d').date()
        except Exception, e:
            return date
    return date.strftime(fmt)


def _mk_money_format(money, prefix = ""):
    locale.setlocale(locale.LC_ALL, 'pt_BR.UTF-8')
    return locale.currency(money, grouping=True, symbol=prefix)


def _mk_filter_translate(string, lang='PT'):
    dicionary = {
        "PT" : {
            "CREATED" : "CRIADO",
            "SENT" : "ENVIADO",
            "PARTLY-SENT" : "PARC. ENVIADO",
            "DELIVERED" : "ENTREGUE",
            "PARTLY-DELIVERED" : "PARC. ENTREGUE",
            "BILLED" : "FATURADO",
            "PARTLY-BILLED" : "PARC. FATURADO",
            "APPROVED" : "APROVADO"
        }
    }
    return dicionary[lang].get(string, string)

application.jinja_env.cache = None
application.jinja_env.filters['datetime'] = _jinja2_filter_datetime
application.jinja_env.filters['mk_trans'] = _mk_filter_translate
application.jinja_env.filters['real_format'] = _mk_money_format
application.jinja_env.filters['strftime'] = datetime.datetime.strftime

def load_site():

    configured = False
    if not session.get('configuration', None) is not None:
        return configured, configured, configured

    configured = True
    current_client = None
    current_site = None

    for client in session.get('configuration').get("clients"):
        for site in client.get('sites'):
            if request.host.split(":")[0] in site.get("hosts"):
                current_client = client
                current_site = site

    return configured, current_client, current_site


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
                "sites" : [{
                    "name" : "Rednose",
                    "path" : "rednose",
                    "repo" : "git@github.com:mkplace/front-rednose.git",
                    "hosts" : ["dev.rednose.com.br", "dev.rednose.com.br:8080", "192.168.10.115"],
                    "accesskey" : None,
                    "env" : "staging"
                }]
            },
            {
                "name" : "Madel",
                "path" : "madel",
                "sites" : [
                    {
                        "name" : "Madel",
                        "path" : "madel",
                        "repo" : "git@github.com:mkplace/front-madel.git",
                        "hosts" : ["dev.madel.com.br"],
                        "accesskey" : None,
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

@application.route('/common/assets/<path:path>')
def common_static_configure(path):
    return send_from_directory("/var/www/mkplace-catalog/src/common/assets", path)


@application.route('/assets/<path:path>')
def send_static(path):

    configured, current_client, current_site = load_site()
    if not configured: return redirect("/configure")

    return send_from_directory("/var/www/mkplace-front/%s/%s/assets" % (current_client.get('path'), current_site.get('path')), path)


@application.route("/index.html", methods=['GET'])
@application.route("/", methods=['GET'])
def home_route():

    configured, current_client, current_site = load_site()
    if not configured: return redirect("/configure")

    application.jinja_loader = jinja2.ChoiceLoader([jinja2.FileSystemLoader("/var/www/mkplace-front/%s/%s" % (current_client.get('path'), current_site.get('path'))), jinja2.FileSystemLoader("/var/www/mkplace-catalog/src/common"),])

    return dispacher( response = home_page( request = request, customer_auth = {}, session = session, params = {} ), template = "template/home.html", site = current_site )



# PRODUCT DETAIL
@application.route("/<department_slug>/<product_slug>/p/<product_id>", methods=['GET'])
@application.route("/<department_slug>/<product_slug>/p/<product_id>/<sku_id>", methods=['GET'])
@application.route("/<department_slug>/<category_slug>/<product_slug>/p/<product_id>", methods=['GET'])
@application.route("/<department_slug>/<category_slug>/<product_slug>/p/<product_id>/<sku_id>", methods=['GET'])
@application.route("/<department_slug>/<category_slug>/<subcategory_slug>/<product_slug>/p/<product_id>", methods=['GET'])
@application.route("/<department_slug>/<category_slug>/<subcategory_slug>/<product_slug>/p/<product_id>/<sku_id>", methods=['GET'])
def product_route(department_slug = None, category_slug = None, subcategory_slug = None, product_slug = None, product_id = None, sku_id = None):

    configured, current_client, current_site = load_site()
    if not configured: return redirect("/configure")

    application.jinja_loader = jinja2.ChoiceLoader([jinja2.FileSystemLoader("/var/www/mkplace-front/%s/%s" % (current_client.get('path'), current_site.get('path'))), jinja2.FileSystemLoader("/var/www/mkplace-catalog/src/common"),])

    return dispacher( product_page( request = request, customer_auth = customer_auth(request), session = session, params = {"product_slug" : product_slug, "product_id" : product_id, "sku_id" : sku_id} ), template = "template/product.html", site = current_site )


def loader( class_name, params ):
    return True


def customer_auth( request ):
    return session.get('customer_auth', {})

def dispacher( response, template, site ):

    if response.dispacher_param:
        if response.dispacher_param.get('action', '') == 'redirect':
            return redirect( response.dispacher_param.get('url') )
        elif response.dispacher_param.get('action', '') == 'no_template':
            return response.dispacher_param.get('content', '')
        elif response.dispacher_param.get('action', '') == 'json_response':
            return json.dumps(response.dispacher_param.get('json', {}))

    return render_template(template, this = response, request = request, loader = loader ), 200

@application.route("/pass/<resource>", methods=['GET', 'POST'])
@application.route("/pass/<resource>/<action>", methods=['GET', 'POST'])
def api_pass(resource, action):

    if action:
        path = "/api/%s/%s" % (resource, action)
    else:
        path = "/api/%s" % (resource)

    data = {}
    url = "http://web%s?format=json" % path
    headers = {'Host': request.host.split(":")[0], 'Content-Type': 'application/json'}

    if request.data:
        data = json.loads(request.data)

    data['session'] = {
        "id" : str(session.get('sessionid')),
    }

    if session.get('customer'):
        data['session']['customer_id'] = session.get('customer', {}).get('id', None)

    r = requests.post(url, headers=headers, json = data)

    response = json.loads(r.text)

    if type(response.get('result')) == dict:
        if response.get('result').get('store_on_session'):
            for k in response.get('result').get('store_on_session'):
                session[ k ] = response.get('result').get('store_on_session')[k]

    return r.text


# MYACCOUNT
@application.route("/account/info", methods=['GET'])
def myaccount_info_route():

    configured, current_client, current_site = load_site()
    if not configured: return redirect("/configure")

    application.jinja_loader = jinja2.ChoiceLoader([jinja2.FileSystemLoader("/var/www/mkplace-front/%s/%s" % (current_client.get('path'), current_site.get('path'))), jinja2.FileSystemLoader("/var/www/mkplace-catalog/src/common"),])

    return dispacher( myaccount_info_page( request = request, customer_auth = customer_auth(request), session = session ), template = "template/account/info.html", site = current_site )


@application.route("/account/address", methods=['GET'])
def myaccount_address_route():

    configured, current_client, current_site = load_site()
    if not configured: return redirect("/configure")

    application.jinja_loader = jinja2.ChoiceLoader([jinja2.FileSystemLoader("/var/www/mkplace-front/%s/%s" % (current_client.get('path'), current_site.get('path'))), jinja2.FileSystemLoader("/var/www/mkplace-catalog/src/common"),])

    return dispacher( myaccount_address_page( request = request, customer_auth = customer_auth(request), session = session ), template = "template/account/address.html", site = current_site )


@application.route("/account/order", methods=['GET'])
def myaccount_order_route():

    configured, current_client, current_site = load_site()
    if not configured: return redirect("/configure")

    application.jinja_loader = jinja2.ChoiceLoader([jinja2.FileSystemLoader("/var/www/mkplace-front/%s/%s" % (current_client.get('path'), current_site.get('path'))), jinja2.FileSystemLoader("/var/www/mkplace-catalog/src/common"),])

    return dispacher( myaccount_order_page( request = request, customer_auth = customer_auth(request), session = session ), template = "template/account/order.html", site = current_site )


@application.route("/account/order/view", methods=['GET'])
def myaccount_orderview_route():

    configured, current_client, current_site = load_site()
    if not configured: return redirect("/configure")

    application.jinja_loader = jinja2.ChoiceLoader([jinja2.FileSystemLoader("/var/www/mkplace-front/%s/%s" % (current_client.get('path'), current_site.get('path'))), jinja2.FileSystemLoader("/var/www/mkplace-catalog/src/common"),])

    return dispacher( myaccount_order_page( request = request, customer_auth = customer_auth(request), session = session ), template = "template/account/order.view.html", site = current_site )


# LOGIN
@application.route("/login", methods=['GET'])
@application.route("/login/", methods=['GET'])
@application.route("/login", methods=['POST'])
def login_route():

    configured, current_client, current_site = load_site()
    if not configured: return redirect("/configure")

    application.jinja_loader = jinja2.ChoiceLoader([jinja2.FileSystemLoader("/var/www/mkplace-front/%s/%s" % (current_client.get('path'), current_site.get('path'))), jinja2.FileSystemLoader("/var/www/mkplace-catalog/src/common"),])

    return dispacher( login_page( request = request, customer_auth = customer_auth(request), session = session ), template = "template/login.html", site = current_site )


# LOGIN
@application.route("/logout", methods=['GET'])
def logout_route():
    session['customer'] = None
    return redirect("/")

# REGISTER
@application.route("/register", methods=['GET'])
@application.route("/register/", methods=['GET'])
@application.route("/register", methods=['POST'])
def register_route():

    configured, current_client, current_site = load_site()
    if not configured: return redirect("/configure")

    application.jinja_loader = jinja2.ChoiceLoader([jinja2.FileSystemLoader("/var/www/mkplace-front/%s/%s" % (current_client.get('path'), current_site.get('path'))), jinja2.FileSystemLoader("/var/www/mkplace-catalog/src/common"),])

    return dispacher( register_page( request = request, customer_auth = customer_auth(request), session = session ), template = "template/register.html", site = current_site )

# PAGES
@application.route("/<page_slug>", methods=['GET'])
@application.route("/<page_slug>.html", methods=['GET'])
@application.route("/<page_slug>/", methods=['GET'])
def custom_route(page_slug):

    configured, current_client, current_site = load_site()
    if not configured: return redirect("/configure")

    application.jinja_loader = jinja2.ChoiceLoader([jinja2.FileSystemLoader("/var/www/mkplace-front/%s/%s" % (current_client.get('path'), current_site.get('path'))), jinja2.FileSystemLoader("/var/www/mkplace-catalog/src/common"),])

    return dispacher( custom_page( request = request, customer_auth = customer_auth(request), session = session, params = {"page_slug" : page_slug} ), template = "pages/" + page_slug + ".html", site = current_site )


# SHOPPING CART
@application.route("/shopping-cart", methods=['GET'])
def shopping_cart_route():

    configured, current_client, current_site = load_site()
    if not configured: return redirect("/configure")

    application.jinja_loader = jinja2.ChoiceLoader([jinja2.FileSystemLoader("/var/www/mkplace-front/%s/%s" % (current_client.get('path'), current_site.get('path'))), jinja2.FileSystemLoader("/var/www/mkplace-catalog/src/common"),])

    return dispacher( shopping_cart_page( request = request, customer_auth = customer_auth(request), session = session ), template = "template/shoppingcart.html", site = current_site )


# CHECKOUT
@application.route("/checkout", methods=['GET','POST'])
def checkout_route():

    configured, current_client, current_site = load_site()
    if not configured: return redirect("/configure")

    application.jinja_loader = jinja2.ChoiceLoader([jinja2.FileSystemLoader("/var/www/mkplace-front/%s/%s" % (current_client.get('path'), current_site.get('path'))), jinja2.FileSystemLoader("/var/www/mkplace-catalog/src/common"),])

    return dispacher( checkout_page( request = request, customer_auth = customer_auth(request), session = session ), template = "template/checkout.html", site = current_site )


# CATEGORY PAGE
@application.route("/d/<department_slug>/<id>", methods=['GET'])
@application.route("/c/<department_slug>/<category_slug>/<id>", methods=['GET'])
@application.route("/s/<department_slug>/<category_slug>/<subcategory_slug>/<id>", methods=['GET'])
def category_route(department_slug = None, category_slug = None, subcategory_slug = None, id = None):
    level = request.path.split('/')[1]
    params = {"search_type" : {"d" : "department", "c" : "category", "s" : "subcategory"}[level]}
    params['department'] = department_slug
    params['category'] = category_slug
    params['subcategory'] = subcategory_slug
    params['id'] = id

    configured, current_client, current_site = load_site()
    if not configured: return redirect("/configure")

    application.jinja_loader = jinja2.ChoiceLoader([jinja2.FileSystemLoader("/var/www/mkplace-front/%s/%s" % (current_client.get('path'), current_site.get('path'))), jinja2.FileSystemLoader("/var/www/mkplace-catalog/src/common"),])

    return dispacher( search_page( request = request, customer_auth = customer_auth(request), session = session, params = params ), template = "template/search.html", site = current_site )


# SEARCH PAGE
@application.route("/search", methods=['GET'])
@application.route("/busca", methods=['GET'])
def search_route():
    params = {"search_type" : "query"}

    configured, current_client, current_site = load_site()
    if not configured: return redirect("/configure")

    application.jinja_loader = jinja2.ChoiceLoader([jinja2.FileSystemLoader("/var/www/mkplace-front/%s/%s" % (current_client.get('path'), current_site.get('path'))), jinja2.FileSystemLoader("/var/www/mkplace-catalog/src/common"),])

    return dispacher( search_page( request = request, customer_auth = customer_auth(request), session = session, params = params ), template = "template/search.html", site = current_site )


if __name__ == "__main__": application.run(host="0.0.0.0", port=int(os.environ['PORT']), debug = True, threaded=True)
