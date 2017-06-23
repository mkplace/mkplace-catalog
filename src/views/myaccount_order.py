# -*- encoding: utf-8 -*-

# @author David Silva - @inonjs
# @see platform.mkplace.com.br/developers

from libraries.view import view

class myaccount_order_page(view):

    layout_type = "myaccount_order"

    def run( self ):

        self.view_order = None

        if self.customer_auth.get('id'):
            orders = self.get_api("/api/orders?format=json&customer_id=%s" % self.customer_auth.get('id'))['result']
            self.orders = orders

        if self.request.args.get('order_id', None):
            order_id = self.request.args.get('order_id')
            order = self.get_api("/api/orders?format=json&order_id=%s" % str(order_id))['result']
            self.order_view = order[0]

        return self
