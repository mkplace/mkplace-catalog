# -*- encoding: utf-8 -*-

# @author David Silva - @inonjs
# @see platform.mkplace.com.br/developers

from libraries.view import view

class myaccount_address_page(view):

    layout_type = "myaccount_address"

    def run( self ):
        if self.customer_auth.get('id'):
            myaccount = self.get_api("/api/catalog/myaccount?format=json&customer_id=%s" % self.customer_auth.get('id'))['result']
            self.address = myaccount.get('address')
