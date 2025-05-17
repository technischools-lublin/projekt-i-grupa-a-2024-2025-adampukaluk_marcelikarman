from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    ParcelLockerViewSet, 
    LockerSlotViewSet, 
    ParcelViewSet, 
    DeliveryHistoryViewSet,
    UserViewSet
)

router = DefaultRouter()
router.register(r'api/users', UserViewSet)
router.register(r'api/parcel_lockers', ParcelLockerViewSet)
router.register(r'api/locker_slots', LockerSlotViewSet)
router.register(r'api/parcels', ParcelViewSet)
router.register(r'api/delivery_history', DeliveryHistoryViewSet)

urlpatterns = [
    path('', include(router.urls)),
]