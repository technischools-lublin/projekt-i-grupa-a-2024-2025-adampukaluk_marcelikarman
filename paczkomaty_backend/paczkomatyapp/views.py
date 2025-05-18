from rest_framework import generics, viewsets, status, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from django.contrib.auth.models import User
from django.db.models import Q
from django.shortcuts import get_object_or_404
from rest_framework.permissions import IsAuthenticated, IsAdminUser, AllowAny
from rest_framework_simplejwt.views import TokenObtainPairView as SimpleJWTTokenObtainPairView
from django.conf import settings
from rest_framework.views import APIView

from .models import ParcelLocker, LockerSlot, Parcel, DeliveryHistory
from .serializers import (
    UserSerializer,
    ParcelLockerSerializer,
    ParcelLockerDetailSerializer,
    LockerSlotSerializer,
    LockerSlotDetailSerializer,
    ParcelSerializer,
    ParcelDetailSerializer,
    ParcelPickupSerializer,
    DeliveryHistorySerializer
)
from paczkomatyapp.auth import MyTokenObtainPairSerializer


class CreateUserView(generics.CreateAPIView):
    """
    API endpoint for user registration
    """
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]


class UserViewSet(viewsets.ReadOnlyModelViewSet):
    """
    API endpoint for users - only admins can list all users
    Regular users can only see their own information
    """
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # If user is admin, return all users, otherwise just the current user
        if self.request.user.is_staff:
            return User.objects.all()
        return User.objects.filter(id=self.request.user.id)

    @action(detail=True, methods=['get'])
    def parcels(self, request, pk=None):
        """Get all parcels for a specific user (sent or received)"""
        user = self.get_object()

        # Ensure users can only view their own parcels unless they're admin
        if int(pk) != request.user.id and not request.user.is_staff:
            return Response(
                {"detail": "You do not have permission to view these parcels."},
                status=status.HTTP_403_FORBIDDEN
            )

        sent_parcels = Parcel.objects.filter(sender=user)
        received_parcels = Parcel.objects.filter(receiver=user)

        sent_serializer = ParcelSerializer(sent_parcels, many=True)
        received_serializer = ParcelSerializer(received_parcels, many=True)

        return Response({
            'sent_parcels': sent_serializer.data,
            'received_parcels': received_serializer.data
        })


class ParcelLockerViewSet(viewsets.ModelViewSet):
    """
    API endpoint for ParcelLockers
    - List/retrieve operations are available to all authenticated users
    - Create/update/delete operations are restricted to admin users
    """
    queryset = ParcelLocker.objects.all()
    serializer_class = ParcelLockerSerializer
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['name', 'location']
    ordering_fields = ['name', 'location', 'created_at']

    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            permission_classes = [IsAdminUser]
        else:
            permission_classes = [IsAuthenticated]
        return [permission() for permission in permission_classes]

    def get_serializer_class(self):
        if self.action == 'retrieve':
            return ParcelLockerDetailSerializer
        return ParcelLockerSerializer

    @action(detail=True, methods=['get'])
    def slots(self, request, pk=None):
        """Get all slots for a specific locker"""
        locker = self.get_object()
        slots = locker.slots.all()
        serializer = LockerSlotSerializer(slots, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['get'])
    def available_slots(self, request, pk=None):
        """Get all available slots for a specific locker"""
        locker = self.get_object()
        size = request.query_params.get('size', None)

        available_slots = locker.slots.filter(is_occupied=False)
        if size:
            available_slots = available_slots.filter(size=size)

        serializer = LockerSlotSerializer(available_slots, many=True)
        return Response(serializer.data)


class LockerSlotViewSet(viewsets.ModelViewSet):
    """
    API endpoint for LockerSlots
    - List/retrieve operations are available to all authenticated users
    - Create/update/delete operations are restricted to admin users
    """
    queryset = LockerSlot.objects.all()
    serializer_class = LockerSlotSerializer
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['slot_number', 'size']
    ordering_fields = ['slot_number', 'size', 'last_updated']

    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            permission_classes = [IsAdminUser]
        else:
            permission_classes = [IsAuthenticated]
        return [permission() for permission in permission_classes]

    def get_serializer_class(self):
        if self.action == 'retrieve':
            return LockerSlotDetailSerializer
        return LockerSlotSerializer

    def get_queryset(self):
        queryset = LockerSlot.objects.all()

        # Filter by parcel_locker if provided
        locker_id = self.request.query_params.get('locker', None)
        if locker_id:
            queryset = queryset.filter(parcel_locker_id=locker_id)

        # Filter by size if provided
        size = self.request.query_params.get('size', None)
        if size:
            queryset = queryset.filter(size=size)

        # Filter by occupation status if provided
        occupied = self.request.query_params.get('occupied', None)
        if occupied is not None:
            is_occupied = occupied.lower() == 'true'
            queryset = queryset.filter(is_occupied=is_occupied)

        return queryset


class ParcelViewSet(viewsets.ModelViewSet):
    """
    API endpoint for Parcels
    - Users can only see parcels they've sent or received
    - Admin users can see all parcels
    """
    queryset = Parcel.objects.all()
    serializer_class = ParcelSerializer
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['tracking_number', 'status']
    ordering_fields = ['created_at', 'status']

    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            permission_classes = [IsAuthenticated]
        else:
            permission_classes = [IsAuthenticated]
        return [permission() for permission in permission_classes]

    def get_serializer_class(self):
        if self.action == 'retrieve':
            return ParcelDetailSerializer
        elif self.action == 'pickup':
            return ParcelPickupSerializer
        return ParcelSerializer

    def get_queryset(self):
        user = self.request.user

        # Admin users can see all parcels
        if user.is_staff:
            queryset = Parcel.objects.all()
        else:
            # Regular users can only see parcels they've sent or received
            queryset = Parcel.objects.filter(Q(sender=user) | Q(receiver=user))

        # Filter by parcel_locker if provided
        locker_id = self.request.query_params.get('locker', None)
        if locker_id:
            queryset = queryset.filter(parcel_locker_id=locker_id)

        # Filter by status if provided
        status = self.request.query_params.get('status', None)
        if status:
            queryset = queryset.filter(status=status)

        # Filter by tracking number if provided
        tracking_number = self.request.query_params.get('tracking', None)
        if tracking_number:
            queryset = queryset.filter(tracking_number__icontains=tracking_number)

        return queryset

    def perform_create(self, serializer):
        # Set sender to current user if not provided
        serializer.save(sender=self.request.user, status='preparing')

    @action(detail=True, methods=['post'])
    def pickup(self, request, pk=None):
        """Custom action to handle parcel pickup using the pickup code"""
        parcel = self.get_object()
        serializer = self.get_serializer(data=request.data)

        if serializer.is_valid():
            try:
                provided_code = serializer.validated_data['pickup_code']
                success = parcel.pickup(provided_code)

                if success:
                    return Response({
                        "detail": "Parcel picked up successfully."
                    }, status=status.HTTP_200_OK)

            except Exception as e:
                return Response({
                    "detail": str(e)
                }, status=status.HTTP_400_BAD_REQUEST)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=['get'])
    def history(self, request, pk=None):
        """Get delivery history for a specific parcel"""
        parcel = self.get_object()
        history = parcel.history.all().order_by('-event_time')
        serializer = DeliveryHistorySerializer(history, many=True)
        return Response(serializer.data)


class DeliveryHistoryViewSet(viewsets.ReadOnlyModelViewSet):
    """
    API endpoint for DeliveryHistory - read-only access
    Users can only see history for parcels they've sent or received
    """
    queryset = DeliveryHistory.objects.all()
    serializer_class = DeliveryHistorySerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [filters.OrderingFilter]
    ordering_fields = ['event_time']
    ordering = ['-event_time']  # Default ordering

    def get_queryset(self):
        user = self.request.user

        # Admin users can see all history
        if user.is_staff:
            queryset = DeliveryHistory.objects.all()
        else:
            # Regular users can only see history for parcels they've sent or received
            queryset = DeliveryHistory.objects.filter(
                Q(parcel__sender=user) | Q(parcel__receiver=user)
            )

        # Filter by parcel if provided
        parcel_id = self.request.query_params.get('parcel', None)
        if parcel_id:
            queryset = queryset.filter(parcel_id=parcel_id)

        # Filter by event_type if provided
        event_type = self.request.query_params.get('event_type', None)
        if event_type:
            queryset = queryset.filter(event_type=event_type)

        return queryset


class CustomTokenObtainPairView(SimpleJWTTokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer
    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)
        if response.status_code == 200:
            access_token = response.data.get('access')
            refresh_token = response.data.get('refresh')
            response.set_cookie(
                'authToken',
                access_token,
                httponly=True,
                samesite='Lax',
                secure=False,
                max_age=int(settings.SIMPLE_JWT['ACCESS_TOKEN_LIFETIME'].total_seconds()),
                path='/',
            )
            response.set_cookie(
                'refreshToken',
                refresh_token,
                httponly=True,
                samesite='Lax',
                secure=False,
                max_age=int(settings.SIMPLE_JWT['REFRESH_TOKEN_LIFETIME'].total_seconds()),
                path='/',
            )
            response.data = {'message': 'Login successful'}
        return response


class CheckIsSuperUserView(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request):
        return Response({"is_superuser": bool(getattr(request.user, "is_superuser", False))})


class UpdateParcelStatusView(APIView):
    permission_classes = [IsAuthenticated]

    def put(self, request):
        tracking_number = request.data.get('tracking_number')
        new_status = request.data.get('status')
        if not tracking_number or not new_status:
            return Response({'detail': 'tracking_number and status are required.'}, status=status.HTTP_400_BAD_REQUEST)
        try:
            parcel = Parcel.objects.get(tracking_number=tracking_number)
        except Parcel.DoesNotExist:
            return Response({'detail': 'Parcel not found.'}, status=status.HTTP_404_NOT_FOUND)
        parcel.status = new_status
        parcel.save()
        return Response({'detail': 'Status updated successfully.'})


class PickupCodeView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        tracking_number = request.data.get('tracking_number')
        if not tracking_number:
            return Response({'detail': 'tracking_number is required.'}, status=status.HTTP_400_BAD_REQUEST)
        try:
            parcel = Parcel.objects.get(tracking_number=tracking_number)
        except Parcel.DoesNotExist:
            return Response({'detail': 'Parcel not found.'}, status=status.HTTP_404_NOT_FOUND)
        return Response({'pickup_code': parcel.pickup_code})


# PUBLIC endpoint for parcel locker locations (no authentication required)
class PublicParcelLockerListView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        from .models import ParcelLocker, LockerSlot
        lockers = ParcelLocker.objects.all()
        data = []
        for locker in lockers:
            available_small = LockerSlot.objects.filter(parcel_locker=locker, size='small', is_occupied=False).count()
            available_medium = LockerSlot.objects.filter(parcel_locker=locker, size='medium', is_occupied=False).count()
            available_large = LockerSlot.objects.filter(parcel_locker=locker, size='large', is_occupied=False).count()
            data.append({
                'id': locker.id,
                'name': locker.name,
                'location': locker.location,
                'latitude': float(locker.latitude),
                'longitude': float(locker.longitude),
                'available_slots': {
                    'small': available_small,
                    'medium': available_medium,
                    'large': available_large,
                }
            })
        return Response(data)