from django.contrib.auth.models import User
from rest_framework import serializers
from .models import ParcelLocker, LockerSlot, Parcel, DeliveryHistory


class UserSerializer(serializers.ModelSerializer):
    sent_parcels = serializers.PrimaryKeyRelatedField(many=True, read_only=True)
    received_parcels = serializers.PrimaryKeyRelatedField(many=True, read_only=True)

    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'first_name', 'last_name', 'password', 'sent_parcels', 'received_parcels')
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        return User.objects.create_user(**validated_data)


class LockerSlotSerializer(serializers.ModelSerializer):
    class Meta:
        model = LockerSlot
        fields = ('id', 'parcel_locker', 'slot_number', 'size', 'is_occupied', 'last_updated')
        read_only_fields = ('is_occupied',)  # is_occupied should be managed by the Parcel model


class LockerSlotDetailSerializer(serializers.ModelSerializer):
    parcel_locker_name = serializers.ReadOnlyField(source='parcel_locker.name')

    class Meta:
        model = LockerSlot
        fields = ('id', 'parcel_locker', 'parcel_locker_name', 'slot_number', 'size', 'is_occupied', 'last_updated')


class ParcelLockerSerializer(serializers.ModelSerializer):
    available_slots_count = serializers.SerializerMethodField()
    available_slots_by_size = serializers.SerializerMethodField()

    class Meta:
        model = ParcelLocker
        fields = ('id', 'name', 'location', 'latitude', 'longitude', 'status',
                  'small_slots', 'medium_slots', 'large_slots', 'created_at', 
                  'available_slots_count', 'available_slots_by_size')

    def get_available_slots_count(self, obj):
        return obj.slots.filter(is_occupied=False).count()

    def get_available_slots_by_size(self, obj):
        return {
            'small': obj.slots.filter(size=LockerSlot.SMALL, is_occupied=False).count(),
            'medium': obj.slots.filter(size=LockerSlot.MEDIUM, is_occupied=False).count(),
            'large': obj.slots.filter(size=LockerSlot.LARGE, is_occupied=False).count()
        }


class ParcelLockerDetailSerializer(serializers.ModelSerializer):
    slots = LockerSlotSerializer(many=True, read_only=True)
    available_slots_count = serializers.SerializerMethodField()

    class Meta:
        model = ParcelLocker
        fields = ('id', 'name', 'location', 'latitude', 'longitude', 'status',
                  'number_of_slots', 'created_at', 'slots', 'available_slots_count')

    def get_available_slots_count(self, obj):
        return obj.slots.filter(is_occupied=False).count()


class DeliveryHistorySerializer(serializers.ModelSerializer):
    event_type_display = serializers.CharField(source='get_event_type_display', read_only=True)

    class Meta:
        model = DeliveryHistory
        fields = ('id', 'parcel', 'event_type', 'event_type_display', 'event_time')


class ParcelSerializer(serializers.ModelSerializer):
    locker_slot_info = LockerSlotSerializer(source='locker_slot', read_only=True)
    parcel_locker_name = serializers.ReadOnlyField(source='parcel_locker.name')
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    sender_username = serializers.ReadOnlyField(source='sender.username')
    receiver_username = serializers.ReadOnlyField(source='receiver.username')

    class Meta:
        model = Parcel
        fields = ('id', 'tracking_number', 'parcel_locker', 'parcel_locker_name',
                  'locker_slot', 'locker_slot_info', 'size', 'status', 'status_display',
                  'sender', 'sender_username', 'receiver', 'receiver_username',
                  'pickup_code', 'created_at')
        read_only_fields = ('locker_slot',)  # locker_slot is assigned automatically
        extra_kwargs = {'pickup_code': {'write_only': True}}  # Hide pickup code for security

    def validate(self, data):
        # Validate that the size is one of the allowed choices
        if 'size' in data and data['size'] not in dict(LockerSlot.SIZE_CHOICES):
            raise serializers.ValidationError({"size": f"Size must be one of {dict(LockerSlot.SIZE_CHOICES).keys()}"})

        # If creating a new parcel, ensure there's an available slot of the right size
        if self.instance is None:  # Creating new instance
            parcel_locker = data.get('parcel_locker')
            size = data.get('size', LockerSlot.MEDIUM)

            if parcel_locker:
                available_slot = LockerSlot.objects.filter(
                    parcel_locker=parcel_locker,
                    size=size,
                    is_occupied=False
                ).first()

                if not available_slot:
                    raise serializers.ValidationError(
                        f"No available slots of size '{size}' in the selected locker."
                    )

        return data


class ParcelDetailSerializer(ParcelSerializer):
    history = DeliveryHistorySerializer(many=True, read_only=True)

    class Meta(ParcelSerializer.Meta):
        fields = ParcelSerializer.Meta.fields + ('history',)


class ParcelPickupSerializer(serializers.Serializer):
    pickup_code = serializers.CharField(max_length=30)

    def validate(self, data):
        return data