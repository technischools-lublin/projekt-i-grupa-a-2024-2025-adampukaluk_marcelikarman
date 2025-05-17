from django.db import models
from django.contrib.auth.models import User
from django.core.exceptions import ValidationError
from django.db import transaction


class ParcelLocker(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=30)
    location = models.CharField(max_length=255)
    latitude = models.DecimalField(max_digits=9, decimal_places=7)
    longitude = models.DecimalField(max_digits=9, decimal_places=7)
    status = models.BooleanField(default=False)
    number_of_slots = models.PositiveIntegerField(default=20)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} ({self.location})"


class LockerSlot(models.Model):
    SMALL = 'small'
    MEDIUM = 'medium'
    LARGE = 'large'

    SIZE_CHOICES = [
        (SMALL, 'Small'),
        (MEDIUM, 'Medium'),
        (LARGE, 'Large'),
    ]

    id = models.AutoField(primary_key=True)
    parcel_locker = models.ForeignKey(ParcelLocker, on_delete=models.CASCADE, related_name='slots')
    slot_number = models.CharField(max_length=30)
    size = models.CharField(max_length=6, choices=SIZE_CHOICES, default=MEDIUM)
    is_occupied = models.BooleanField(default=False)
    last_updated = models.DateTimeField(auto_now=True)

    class Meta:
        # Dodanie ograniczenia unikalności slotów w obrębie paczkomatu
        constraints = [
            models.UniqueConstraint(
                fields=['parcel_locker', 'slot_number'],
                name='unique_slot_per_locker'
            )
        ]

    def __str__(self):
        return f"{self.parcel_locker.name} - Slot {self.slot_number}"


class Parcel(models.Model):
    awaiting_pickup = 'awaiting_pickup'
    picked_up = 'picked_up'
    in_transit = 'in_transit'
    delivered = 'delivered'

    status_choices = [
        (awaiting_pickup, 'Awaiting Pickup'),
        (picked_up, 'Picked Up'),
        (in_transit, 'In Transit'),
        (delivered, 'Delivered')
    ]

    id = models.AutoField(primary_key=True)
    tracking_number = models.CharField(max_length=30)
    parcel_locker = models.ForeignKey(ParcelLocker, on_delete=models.CASCADE,null=True)
    locker_slot = models.ForeignKey(LockerSlot, on_delete=models.CASCADE, null=True, blank=True)
    size = models.CharField(max_length=6, choices=LockerSlot.SIZE_CHOICES, default=LockerSlot.MEDIUM)
    status = models.CharField(max_length=30, choices=status_choices, default=in_transit)
    sender = models.ForeignKey(User, on_delete=models.CASCADE, related_name='sent_parcels', null=True)
    receiver = models.ForeignKey(User, on_delete=models.CASCADE, related_name='received_parcels', null=True)
    pickup_code = models.CharField(max_length=30)
    created_at = models.DateTimeField(auto_now_add=True)

    def clean(self):
        # Walidacja czy slot należy do wybranego paczkomatu
        if self.locker_slot and self.locker_slot.parcel_locker != self.parcel_locker:
            raise ValidationError("Wybrany slot musi należeć do wybranego paczkomatu.")

    @transaction.atomic
    def save(self, *args, **kwargs):
        # Sprawdzanie statusu przed zapisem
        is_new = self.pk is None

        # Jeśli to nowa paczka lub zmiana statusu na odebrane, zajmij/zwolnij slot
        if is_new and not self.locker_slot:
            self.locker_slot = self.get_first_available_slot()

        # Walidacja
        self.clean()

        # Zapisz paczke
        super().save(*args, **kwargs)

        # Utwórz wpis w historii dla nowej paczki
        if is_new:
            DeliveryHistory.objects.create(
                parcel=self,
                event_type=DeliveryHistory.CREATED
            )

    @transaction.atomic
    def get_first_available_slot(self):
        # Wybór pierwszego wolnego slotu w paczkomacie o odpowiednim rozmiarze
        available_slot = LockerSlot.objects.filter(
            parcel_locker=self.parcel_locker,
            size=self.size,
            is_occupied=False
        ).select_for_update().first()

        if available_slot:
            # Oznacz slot jako zajęty
            available_slot.is_occupied = True
            available_slot.save()

            # Dodaj wpis do historii
            if self.pk:  # Jeśli paczka już istnieje
                DeliveryHistory.objects.create(
                    parcel=self,
                    event_type=DeliveryHistory.PLACED_IN_LOCKER
                )

        return available_slot

    @transaction.atomic
    def pickup(self, provided_code):
        """Obsługa odbioru paczki"""
        # Sprawdź kod odbioru
        if provided_code != self.pickup_code:
            raise ValidationError("Nieprawidłowy kod odbioru.")

        # Sprawdź czy paczka jest gotowa do odbioru
        if self.status != self.awaiting_pickup:
            raise ValidationError("Ta paczka nie jest gotowa do odbioru.")

        # Zwolnij slot
        if self.locker_slot:
            self.locker_slot.is_occupied = False
            self.locker_slot.save()

        # Zmień status paczki
        self.status = self.picked_up
        self.save()

        # Dodaj wpis do historii
        DeliveryHistory.objects.create(
            parcel=self,
            event_type=DeliveryHistory.PICKED_UP
        )

        return True

    def __str__(self):
        return f"Paczka {self.tracking_number}: {self.get_status_display()}"


class DeliveryHistory(models.Model):
    CREATED = 'created'
    PLACED_IN_LOCKER = 'placed_in_locker'
    PICKED_UP = 'picked_up'

    EVENT_TYPES = [
        (CREATED, 'Created'),
        (PLACED_IN_LOCKER, 'Placed in Locker'),
        (PICKED_UP, 'Picked Up'),
    ]

    id = models.AutoField(primary_key=True)
    parcel = models.ForeignKey(Parcel, on_delete=models.CASCADE, related_name='history')
    event_type = models.CharField(max_length=20, choices=EVENT_TYPES)
    event_time = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.parcel.tracking_number}: {self.event_type} at {self.event_time}"