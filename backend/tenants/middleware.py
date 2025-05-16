from django.db import connection
from .models import Tenant

class TenantMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        # Get the subdomain from the request
        host = request.get_host().split(':')[0]
        subdomain = host.split('.')[0]

        # Set the tenant for this request
        try:
            tenant = Tenant.objects.get(subdomain=subdomain)
            request.tenant = tenant
        except Tenant.DoesNotExist:
            request.tenant = None

        response = self.get_response(request)
        return response 