from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import get_user_model
from django.conf import settings

User = get_user_model()

class TokenObtainPairView(APIView):
    """
    Custom token view that sets JWT token in cookies
    """
    def post(self, request, *args, **kwargs):
        username = request.data.get('username')
        password = request.data.get('password')
        
        if not username or not password:
            return Response(
                {"detail": "Please provide both username and password."},
                status=400
            )
            
        user = User.objects.filter(username=username).first()
        
        if user is None or not user.check_password(password):
            return Response(
                {"detail": "Invalid credentials."},
                status=401
            )
            
        refresh = RefreshToken.for_user(user)
        
        response = Response({
            'access': str(refresh.access_token),
            'refresh': str(refresh)
        })
        
        # Set the token in cookies
        response.set_cookie(
            key='authToken',
            value=str(refresh.access_token),
            httponly=True,
            samesite='Lax',
            secure=False,
            max_age=60*60*24,  # 1 day expiry
            path='/'
        )
        
        # Set refresh token in cookies as well
        response.set_cookie(
            key='refreshToken',
            value=str(refresh),
            httponly=True,
            samesite='Lax',
            secure=False,
            max_age=60*60*24*7,  # 7 days expiry
            path='/'
        )
        
        return response

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