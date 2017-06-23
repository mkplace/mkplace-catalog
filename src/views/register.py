# -*- encoding: utf-8 -*-

# @author David Silva - @inonjs
# @see platform.mkplace.com.br/developers

from libraries.view import view

class register_page(view):

    layout_type = "register_page"

    def run( self ): return self

    def __init__(self, request, customer_auth, session):

        view.__init__(self, request, customer_auth, {})

        if customer_auth.get('id'):
            self.dispacher_param = {"action" : "redirect", "url" : "/"}

        elif self.request.method == 'POST':

            if not self.__validate_fields__( request ): return;

            cellphone = None
            if request.form.get('customer[cellphone][number]'):
                cellphone = {
                    "state_code" : request.form.get('customer[cellphone][state_code]'),
                    "number" : request.form.get('customer[cellphone][number]')
                }

            telephone = None
            if request.form.get('customer[telephone][number]'):
                telephone = {
                    "state_code" : request.form.get('customer[telephone][state_code]'),
                    "number" : request.form.get('customer[telephone][number]')
                }

            birthday = self.__format_field_birthday__( request.form.get('customer[birthday]') )

            customer = {
                "invite_token" : request.form.get('customer[invite_token]'),
                "email" : request.form.get('customer[email]'),
                "name" : request.form.get('customer[legal_name]'),
                "first_name" : request.form.get('customer[first_name]'),
                "last_name" : request.form.get('customer[last_name]'),
                "telephone" : telephone,
                "cellphone" : cellphone,
                "document" : {},
                "password" : request.form.get('customer[password]'),
                "password_confirm" : request.form.get('customer[password_confirm]'),
                "birthday" : birthday,
                "genre": request.form.get('customer[genre]')
            }

            cpf = request.form.get('customer[document][CPF]') or request.form.get('customer[document][cpf]') or ''
            cnpj = request.form.get('customer[document][CNPJ]') or request.form.get('customer[document][cnpj]') or ''
            ie = request.form.get('customer[document][IE]') or request.form.get('customer[document][ie]') or ''

            if cpf:
                customer['document'] = {'CPF': cpf}
            if cnpj:
                customer['document'] = {'CNPJ': cnpj}
            if ie:
                customer['document'] = {'IR': ie}

            sessionid = request.form.get('customer[sessionid]')

            customer_signup = self.post_api("/api/catalog/signup?format=json&sessionid=%s" % sessionid, customer)['result']
            if customer_signup.get('error', None):
                error = customer_signup.get('error')

                if int(error.get('code')) == 1045:
                    self.dispacher_param = {"action" : "redirect", "url" : "/register?error=password_match"}
                    return

                if int(error.get('code')) == 1048:
                    self.dispacher_param = {"action" : "redirect", "url" : "/register?error=already_exist"}
                    return

                if int(error.get('code')) == 1047:
                    self.dispacher_param = {"action" : "redirect", "url" : "/register?error=invalid_token"}
                    return

            else:
                customer_auth = self.get_api("/api/catalog/customer_auth?email=%s&password=%s&sessionid=%s&format=json" % (self.request.form.get('customer[email]', None), request.form.get('customer[password]'), self.request.form.get('sessionid', None)))['result']
                session[ 'customer_auth' ] = customer_auth

                self.dispacher_param = {"action" : "redirect", "url" : request.form.get('customer[next]', '/') + "?welcome=true"}
                return

    def __format_field_birthday__( self, birthday ):
        if '/' in birthday:
            birthday = birthday.replace('/', '-')
        dia = birthday.split('-')[0]
        mes = birthday.split('-')[1]
        ano = birthday.split('-')[2]
        if int(ano) < 1900:
            return False
        return '%s-%s-%s' % (ano, mes, dia)

    def __validate_fields__( self, request):
        required_fields = [ 'customer[document][cpf]',
                            #'customer[document][cnpj]',
                            #'customer[document][ie]',
                            'customer[genre]',
                            'customer[birthday]',
                            'customer[email]',
                            'customer[legal_name]',
                            'customer[first_name]',
                            'customer[last_name]',
                            'customer[cellphone][number]',
                            'customer[cellphone][state_code]',
                            'customer[telephone][number]',
                            'customer[telephone][state_code]',
                            'customer[password]',
                            'customer[password_confirm]' ]

        if request.form.has_key('customer[cellphone][number]'):
            required_fields.remove('customer[telephone][number]')
            required_fields.remove('customer[telephone][state_code]')
        else:
            required_fields.remove('customer[cellphone][number]')
            required_fields.remove('customer[cellphone][state_code]')

        if request.form.has_key('customer[legal_name]'):
            required_fields.remove('customer[first_name]')
            required_fields.remove('customer[last_name]')
        else:
            required_fields.remove('customer[legal_name]')

        if not self.__check_required_fields__( request, required_fields ): return False;
        if not self.__check_fields__( request, required_fields ): return False;
        return True


    def __check_required_fields__( self, request, required_fields ):
        for field in required_fields:
            if not request.form.get(field):
                error = field.replace('customer[', '').replace('][', '_')[0:-1]
                self.dispacher_param = {"action" : "redirect", "url" : "/register?error=empty_%s" % error}
                return None
        return True

    def __check_fields__( self, request, required_fields ):
        birthday = self.__format_field_birthday__( request.form.get('customer[birthday]') )
        if not birthday or ( birthday and len(birthday) != 10 ):
            self.dispacher_param = {"action" : "redirect", "url" : "/register?error=invalid_birthday"}
            return False
        return True
