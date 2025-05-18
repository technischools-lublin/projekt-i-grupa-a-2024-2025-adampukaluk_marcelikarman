from django.contrib import admin
from .models import ParcelLocker, LockerSlot, Parcel, DeliveryHistory

@admin.register(ParcelLocker)
class ParcelLockerAdmin(admin.ModelAdmin):
    list_display = ('name', 'location', 'status', 'small_slots', 'medium_slots', 'large_slots')
    search_fields = ('name', 'location')
    list_filter = ('status',)

@admin.register(LockerSlot)
class LockerSlotAdmin(admin.ModelAdmin):
    list_display = ('parcel_locker', 'slot_number', 'size', 'is_occupied', 'last_updated')
    search_fields = ('slot_number',)
    list_filter = ('size', 'is_occupied')

@admin.register(Parcel)
class ParcelAdmin(admin.ModelAdmin):
    list_display = ('tracking_number', 'status', 'locker_slot', 'parcel_locker', 'sender', 'receiver', 'created_at')
    search_fields = ('tracking_number', 'sender__username', 'receiver__username')
    list_filter = ('status',)

@admin.register(DeliveryHistory)
class DeliveryHistoryAdmin(admin.ModelAdmin):
    list_display = ('parcel', 'event_type', 'event_time')
    list_filter = ('event_type',)