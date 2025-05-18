from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import get_user_model
from django.conf import settings
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView

User = get_user_model()

class LogoutView(APIView):
    """
    View to handle user logout by clearing all cookies
    """
    def get(self, request):
        return self.logout(request)
        
    def post(self, request):
        return self.logout(request)
        
    def logout(self, request):
        response = Response({"detail": "Successfully logged out."})
        
        # Clear all cookies
        for cookie in request.COOKIES:
            response.delete_cookie(cookie, path='/')
        
        return response 

class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token['is_superuser'] = user.is_superuser
        return token 