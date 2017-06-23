# -*- encoding: utf-8 -*-

# @author David Silva - @inonjs
# @see platform.mkplace.com.br/developers

from libraries.view import view

class login_page(view):

    layout_type = "login_page"

    def __init__(self, request, customer_auth, session):

        view.__init__(self, request, customer_auth, {})

        if customer_auth.get('id'):
            self.dispacher_param = {"action" : "redirect", "url" : "/"}

        elif self.request.method == 'POST':
            
            if self.request.form.get('action', 'login') == 'recovery':
                customer_auth = self.get_api("/api/catalog/create_customerrecovery?email=%s&format=json" % (self.request.form.get('email', None)) )['result']
                if customer_auth.get('error', None):
                    self.dispacher_param = {"action" : "redirect", "url" : "/login?customer_recovery_error=email_not_found"}
                else:
                    self.dispacher_param = {"action" : "redirect", "url" : "/login?customer_recovery=confirm"}
            elif self.request.form.get('action', 'login') == 'change_password':
                customer_auth = self.get_api("/api/catalog/hash_verification_recovery?password=%s&confirm_password=%s&hash_customer=%s&format=json" % (self.request.form.get('password', None), self.request.form.get('confirm_password', None), self.request.form.get('hash_customer', None) ) )['result']
                if customer_auth.get('error', None):
                    self.dispacher_param = {"action" : "redirect", "url" : "/login?customer_recovery_error=%s" % customer_auth.get('error', None)}
                if customer_auth.get('confirm_message', None):
                    self.dispacher_param = {"action" : "redirect", "url" : "/login?confirm_message=%s" % customer_auth.get('confirm_message', None)}
            else:
                customer_auth = self.get_api("/api/catalog/customer_auth?email=%s&password=%s&sessionid=%s&format=json" % (self.request.form.get('email', None), self.request.form.get('password', None), self.request.form.get('sessionid', None)))['result']

                if customer_auth:
                    session[ 'customer_auth' ] = customer_auth
                    self.dispacher_param = {"action" : "redirect", "url" : self.request.form.get('next', '/')}
                else:
                    self.dispacher_param = {"action" : "redirect", "url" : "/login?error_login=invalid"}


    def run( self ): return self
