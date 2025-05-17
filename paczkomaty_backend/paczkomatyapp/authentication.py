from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework_simplejwt.exceptions import InvalidToken, TokenError

class CookieJWTAuthentication(JWTAuthentication):
    """
    Custom JWT authentication that uses cookies instead of headers
    """
    def authenticate(self, request):
        # Get the token from cookies
        token = request.COOKIES.get('authToken')
        
        if token is None:
            return None

        try:
            # Validate the token
            validated_token = self.get_validated_token(token)
            return self.get_user(validated_token), validated_token
        except (InvalidToken, TokenError):
            return None 