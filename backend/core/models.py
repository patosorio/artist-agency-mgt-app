from django.db import models
from tenants.models import Tenant

class BaseTenantModel(models.Model):
    tenant = models.ForeignKey(Tenant, on_delete=models.CASCADE)

    class Meta:
        abstract = True