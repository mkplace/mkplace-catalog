# -*- encoding: utf-8 -*-

import sys, os

sys.path.append('../mkplace-catalog-python/src')

from catalog import server, config

config({"store" : sys.argv[1], "site" : sys.argv[2], "template_path" : os.path.abspath(os.path.dirname(__file__)) + "/" + sys.argv[1], "access_token" : sys.argv[3]})

if __name__ == "__main__": server.run(host="0.0.0.0", port=8080, debug = True, threaded=True)
