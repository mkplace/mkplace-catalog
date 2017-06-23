# -*- encoding: utf-8 -*-

# @author David Silva - @inonjs
# @see platform.mkplace.com.br/developers

from libraries.view import view

class product_page(view):

    layout_type = "product_detail"

    def run( self ):
        pass

    def load_product( self ):
        product = self.get_api("/api/front/product_detail?sku_id=%s&product_id=%s&format=json" % (self.params.get('sku_id') or '', self.params.get('product_id')))['result']
        return self.product_object( product, self.request.host )
