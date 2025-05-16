from rest_framework.authentication import BaseAuthentication
from rest_framework.exceptions import AuthenticationFailed
from firebase_admin import auth as firebase_auth
from tenants.models import CustomUser, Tenant
from django.utils.functional import SimpleLazyObject
from django.contrib.auth import get_user_model

CustomUser = get_user_model()

class FirebaseAuthentication(BaseAuthentication):
    def authenticate(self, request):
        auth_header = request.META.get('HTTP_AUTHORIZATION')
        if not auth_header:
            return None

        id_token = auth_header.split(' ').pop()
        try:
            decoded_token = firebase_auth.verify_id_token(id_token)
            firebase_uid = decoded_token.get('uid')
            
            if not firebase_uid:
                raise AuthenticationFailed('Invalid token')

            try:
                user = CustomUser.objects.get(firebase_uid=firebase_uid)
                return (user, None)
            except CustomUser.DoesNotExist:
                raise AuthenticationFailed('User not found')

        except Exception as e:
            raise AuthenticationFailed(str(e))