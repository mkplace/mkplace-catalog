# -*- encoding: utf-8 -*-

# @author David Silva - @inonjs
# @see platform.mkplace.com.br/developers

from libraries.view import view
from urllib import urlencode
import urllib
import re

import sys

class search_page(view):

    layout_type = "search"

    def make_link( self, attribute, value, replace = False ):

        value = value.encode('utf-8')

        # TODO: REVER
        try:
            value = u"%s" % (value)
        except Exception as e:
            pass

        value = value.replace(" ", "\ ")

        if not attribute == "manufacturer" and not attribute == "cat" and not attribute == "sub" and not attribute == "sort" and not attribute == "page":
            filter_name = "filter_sku_%s" % attribute.encode('utf-8')
        elif attribute == "sort" or attribute == "page":
            filter_name = "%s" % attribute.encode('utf-8')
        else:
            filter_name = "filter_%s_name" % (attribute.encode('utf-8'))

        current_values = self.request.args.get("%s" % filter_name, None)

        current_values_split = current_values.split('|') if current_values else []
        _current_values_split = []

        # TODO: REVER
        for item in current_values_split:
            _current_values_split.append(item.encode('utf8', 'ignore'))
        current_values_split = _current_values_split

        exist_result = False

        if not replace:

            if value in current_values_split:
                i = current_values_split.index(value)
                del current_values_split[i]
                final_value = '|'.join(current_values_split)
                exist_result = True
            else:
                # TODO: REVER
                try:
                    final_value = '|'.join([value] + current_values_split)
                except Exception as e:
                    final_value = '|'.join([value.encode('utf8', 'ignore')] + current_values_split)
                    pass

        else:
            final_value = value

        final_dict = self.request.args.to_dict()

        if len(final_value.split()) > 0:
            final_dict["%s" % filter_name] = final_value
        else:
            final_dict.pop("%s" % filter_name, None)

        # TODO: REVER
        # corrigindo encode
        for key in final_dict.keys():
            try:
                final_dict[key] = final_dict[key].encode('utf8', 'ignore')
            except Exception as e:
                pass

        if attribute != "page" and "page" in final_dict.keys():
            del final_dict["page"]

        return self.request.path + "?" + urlencode(final_dict), exist_result


    def run( self ):

        if self.view_params.get('type', None) == "PAGE":
            return self

        self.skus = []

        current_qs = self.request.args.to_dict()

        search_type = self.params.get('search_type', 'search')

        current_qs["page"] = self.request.args.get('page', str(0))
        current_qs["limit"] = self.request.args.get('limit', str(20))

        if search_type == 'department':
            current_qs["facet_depto_id"] = self.params.get('id')
            current_qs["filter_depto_id"] = self.params.get('id')
            self.search_name = self.params.get('department').replace('-', ' ')

        if search_type == 'category':
            current_qs["facet_cat_id"] = self.params.get('id')
            current_qs["filter_cat_id"] = self.params.get('id')
            self.search_name = self.params.get('category').replace('-', ' ')

        if search_type == 'subcategory':
            current_qs["facet_sub_id"] = self.params.get('id')
            current_qs["filter_sub_id"] = self.params.get('id')
            self.search_name = self.params.get('subcategory').replace('-', ' ')

        if self.view_params.get('collection', None):
            current_qs["facet_collection_id"] = str(self.view_params.get('collection'))

        current_qs['facet_collection_id'] = str(49)

        if current_qs.get('manufacturer_name', None):
            current_qs["facet_manufacturer_name"] = str(current_qs.get('manufacturer_name'))

        _current_qs = {}
        for key in current_qs.keys():
            current_qs[key] = current_qs[key].encode('utf8', 'ignore')

        if self.view_params.get('collection', None):
            current_qs['filter_collection_id'] = self.view_params.get('collection', "")

        current_qs['filter_collection_id'] = 49

        response = self.get_api("/api/front/search?format=json&" + urlencode(current_qs) )

        if 'result' in response.keys() and len(response['result']) > 1:
            skus = response['result'][0]
            attributes = response['result'][1]
            pagination = response['result'][2]
        else:
            skus = []
            attributes = []
            pagination = {}

        self.attribute_filter = {}

        self.current_sort = current_qs['sort'].replace('\\', '').replace(' ', '_') if 'sort' in current_qs.keys() else None

        self.sort_links = {
            "score" : self.make_link("sort", "score desc", replace = True)[0],
            "price_desc" : self.make_link("sort", "current_price desc", replace = True)[0],
            "price_asc" : self.make_link("sort", "current_price asc", replace = True)[0],
            "avg_rating" : self.make_link("sort", "avg_rating desc", replace = True)[0]
        }

        self.pagination = pagination

        for key, page in enumerate(self.pagination['pages']):
            is_current = key == int(self.pagination['current_page'])
            self.pagination['pages'][key] = {"count" : key + 1, "is_current" : is_current, "link" : self.make_link("page", str(key), replace = True)[0]}

        # TODO: REFATORAR FOR MAKE LINK

        for attribute in attributes:

            if attribute == 'cat name':
                attribute_name = 'cat'

                for attr in attributes[ attribute ]:
                    attr.replace('_', ' ')
                    attributes[ attribute ][ attr ]
                    self.make_link(attribute_name, attr)

                self.attribute_filter['category'] = [{"name" : attr.replace('_', ' '), "link" :self.make_link(attribute_name, attr)[0], "is_active" : self.make_link(attribute_name, attr)[1], "count" : attributes[ attribute ][ attr ]} for attr in attributes[ attribute ]]

            elif attribute == 'manufacturer name':
                attribute_name = 'manufacturer'
                self.attribute_filter['manufacturer'] = [{"name" : attr.replace('_', ' '), "link" : self.make_link(attribute_name, attr)[0], "is_active" : self.make_link(attribute_name, attr)[1], "count" : attributes[ attribute ][ attr ]} for attr in attributes[ attribute ]]

            elif attribute == 'sub name':
                attribute_name = 'sub'
                self.attribute_filter['subcategory'] = [{"name" : attr.replace('_', ' '), "link" : self.make_link(attribute_name, attr)[0], "is_active" : self.make_link(attribute_name, attr)[1], "count" : attributes[ attribute ][ attr ]} for attr in attributes[ attribute ]]

            else:
                self.attribute_filter[attribute] = [{"name" : attr.replace('_', ' '), "link" : self.make_link(attribute, attr)[0], "is_active" : self.make_link(attribute, attr)[1], "count" : attributes[ attribute ][ attr ]} for attr in attributes[ attribute ]]

        for sku in skus: self.skus.append( self.product_object( sku, self.request.host ) )
