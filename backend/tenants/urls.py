from django.urls import path
from .views import FirebaseLoginView
from . import views

urlpatterns = [
    path("firebase-login/", FirebaseLoginView.as_view(), name="firebase-login"),
    path('create/', views.create_tenant, name='create-tenant'),
    path('login/', views.login_view, name='login'),
    path('logout/', views.logout_view, name='logout'),
    path('me/', views.me_view, name='me'),
]