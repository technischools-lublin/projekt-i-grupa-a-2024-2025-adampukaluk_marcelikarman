from django.contrib import admin
from django.urls import path, include
from paczkomatyapp.auth import TokenObtainPairView, LogoutView
from paczkomatyapp.views import CreateUserView

urlpatterns = [ 
    path('admin/', admin.site.urls),
    path("api/user/register/", CreateUserView.as_view(), name="register"),
    path('', include('paczkomatyapp.urls')),
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/logout/', LogoutView.as_view(), name='logout'),
]