# -*- encoding: utf-8 -*-

# @author David Silva - @inonjs
# @see platform.mkplace.com.br/developers

import os, importlib, json, base64, datetime, time, sys

sys.path.append('/var/www/mkplace-catalog-python/src')

from libraries.view import view

class home_page(view):

    layout_type = "home_page"

    def run( self ):
        return self
