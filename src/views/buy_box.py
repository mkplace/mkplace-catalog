# -*- encoding: utf-8 -*-

# @author David Silva - @inonjs
# @see platform.mkplace.com.br/developers

from libraries.view import view

class buy_box_page(view):

    layout_type = "buybox"

    def run( self ):
        simulation = self.get_api("/api/pricing/simulation?sku_id=%s&quantity=%s&format=json" % (self.params.get('sku_id') or '', self.params.get('quantity') or '1'))['result']
        return self.buy_box_object( simulation )
