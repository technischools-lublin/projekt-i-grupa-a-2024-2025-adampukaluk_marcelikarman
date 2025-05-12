from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ParcelLockerViewSet, LockerSlotViewSet, ParcelViewSet, DeliveryHistoryViewSet

router = DefaultRouter()
router.register(r'parcel_lockers', ParcelLockerViewSet)
router.register(r'locker_slots', LockerSlotViewSet)
router.register(r'parcels', ParcelViewSet)
router.register(r'delivery_history', DeliveryHistoryViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
