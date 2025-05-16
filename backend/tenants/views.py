from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from firebase_admin import auth as firebase_auth
from tenants.models import CustomUser, Tenant
from django.contrib.auth import login, authenticate
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from .serializers import TenantSerializer
from django.db import transaction
import re
import uuid
from rest_framework_simplejwt.tokens import RefreshToken

class FirebaseLoginView(APIView):
    def post(self, request):
        id_token = request.data.get("idToken")
        subdomain = request.data.get("subdomain")

        if not id_token or not subdomain:
            return Response(
                {"detail": "Missing token or subdomain"}, 
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            # Verify token
            decoded_token = firebase_auth.verify_id_token(id_token)
            firebase_uid = decoded_token.get("uid")
            email = decoded_token.get("email")

            if not email or not firebase_uid:
                return Response(
                    {"detail": "Invalid token: missing email or uid"}, 
                    status=status.HTTP_400_BAD_REQUEST
                )

            # Get tenant from subdomain
            try:
                tenant = Tenant.objects.get(subdomain=subdomain)
            except Tenant.DoesNotExist:
                return Response(
                    {"detail": "Tenant not found"}, 
                    status=status.HTTP_404_NOT_FOUND
                )

            # Get or create user
            user, created = CustomUser.objects.get_or_create(
                firebase_uid=firebase_uid,
                defaults={
                    "email": email,
                    "username": email.split("@")[0],
                    "tenant": tenant,
                }
            )

            # Ensure tenant match
            if user.tenant != tenant:
                return Response(
                    {"detail": "User belongs to another tenant"}, 
                    status=status.HTTP_403_FORBIDDEN
                )

            # Update email if changed in Firebase
            if user.email != email:
                user.email = email
                user.save()

            # Optionally log user in (session auth)
            login(request, user)

            return Response({
                "message": "Login successful",
                "email": user.email,
                "tenant": tenant.subdomain,
                "is_new_user": created
            })

        except firebase_auth.InvalidIdTokenError:
            return Response(
                {"detail": "Invalid token"}, 
                status=status.HTTP_401_UNAUTHORIZED
            )
        except Exception as e:
            return Response(
                {"detail": str(e)}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

def generate_subdomain(name):
    # Convert to lowercase and replace spaces with hyphens
    subdomain = name.lower().replace(' ', '-')
    # Remove any characters that aren't letters, numbers, or hyphens
    subdomain = re.sub(r'[^a-z0-9-]', '', subdomain)
    # Remove multiple consecutive hyphens
    subdomain = re.sub(r'-+', '-', subdomain)
    # Remove leading and trailing hyphens
    subdomain = subdomain.strip('-')
    
    # Check if subdomain exists
    base_subdomain = subdomain
    counter = 1
    while Tenant.objects.filter(subdomain=subdomain).exists():
        subdomain = f"{base_subdomain}-{counter}"
        counter += 1
    
    return subdomain

@api_view(['POST'])
@permission_classes([AllowAny])
def create_tenant(request):
    try:
        with transaction.atomic():
            # 1. Generate subdomain and create tenant
            subdomain = generate_subdomain(request.data['agency_name'])
            tenant_data = {
                'name': request.data['agency_name'],
                'subdomain': subdomain
            }
            tenant_serializer = TenantSerializer(data=tenant_data)
            if not tenant_serializer.is_valid():
                return Response(
                    tenant_serializer.errors, 
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            tenant = tenant_serializer.save()

            # 2. Create Django user
            user = CustomUser.objects.create_user(
                email=request.data['email'],
                username=request.data['email'].split('@')[0],
                password=request.data['password'],
                full_name=request.data['full_name'],
                tenant=tenant
            )

            return Response({
                "message": "Tenant and user created successfully",
                "tenant": {
                    **tenant_serializer.data,
                    "subdomain": f"{subdomain}.cabina.app"  # Return the full subdomain URL
                }
            }, status=status.HTTP_201_CREATED)

    except Exception as e:
        return Response(
            {"detail": str(e)}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

@api_view(['POST'])
def login_view(request):
    email = request.data.get('email')
    password = request.data.get('password')
    subdomain = request.data.get('subdomain')

    if not all([email, password, subdomain]):
        return Response(
            {'detail': 'Please provide email, password and subdomain'},
            status=status.HTTP_400_BAD_REQUEST
        )

    user = authenticate(request, email=email, password=password)
    if user is None:
        return Response(
            {'detail': 'Invalid credentials'},
            status=status.HTTP_401_UNAUTHORIZED
        )

    # Check if user belongs to the specified tenant
    if user.tenant.subdomain != subdomain:
        return Response(
            {'detail': 'Invalid subdomain for this user'},
            status=status.HTTP_401_UNAUTHORIZED
        )

    refresh = RefreshToken.for_user(user)
    return Response({
        'access_token': str(refresh.access_token),
        'refresh_token': str(refresh),
        'user': {
            'id': user.id,
            'email': user.email,
            'full_name': user.full_name,
            'tenant_id': user.tenant.id,
            'is_active': user.is_active,
            'is_superuser': user.is_superuser,
        }
    })

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def logout_view(request):
    try:
        refresh_token = request.data.get('refresh_token')
        token = RefreshToken(refresh_token)
        token.blacklist()
        return Response(status=status.HTTP_205_RESET_CONTENT)
    except Exception:
        return Response(status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def me_view(request):
    user = request.user
    return Response({
        'id': user.id,
        'email': user.email,
        'full_name': user.full_name,
        'tenant_id': user.tenant.id,
        'is_active': user.is_active,
        'is_superuser': user.is_superuser,
    })