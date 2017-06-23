# -*- encoding: utf-8 -*-

# @author David Silva - @inonjs
# @see platform.mkplace.com.br/developers

import sys, os
PATH = os.path.dirname(os.path.realpath(__file__))
sys.path.insert(0, PATH)

from application import application

if __name__ == "__main__":
    application.run()
