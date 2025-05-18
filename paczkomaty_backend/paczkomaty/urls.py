from django.contrib import admin
from django.urls import path, include
from paczkomatyapp.views import CreateUserView, CustomTokenObtainPairView, CheckIsSuperUserView
from paczkomatyapp.auth import LogoutView

urlpatterns = [ 
    path('admin/', admin.site.urls),
    path("api/user/register/", CreateUserView.as_view(), name="register"),
    path('', include('paczkomatyapp.urls')),
    path('api/token/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/logout/', LogoutView.as_view(), name='logout'),
    path('api/checkIsSupperUser/', CheckIsSuperUserView.as_view(), name='check_is_superuser'),
]