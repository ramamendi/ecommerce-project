from decimal import Decimal

from django.db import transaction
from rest_framework import generics, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from cart.models import Cart

from .models import Order, OrderItem
from .serializers import OrderSerializer
from users.permissions import IsAdmin


class CheckoutView(generics.CreateAPIView):
    serializer_class = OrderSerializer
    permission_classes = [IsAuthenticated]

    @transaction.atomic
    def create(self, request, *args, **kwargs):
        try:
            cart = Cart.objects.get(user=request.user)
        except Cart.DoesNotExist:
            return Response(
                {"detail": "Cart not found."},
                status=status.HTTP_404_NOT_FOUND,
            )

        cart_items = cart.items.select_related("product").all()

        if not cart_items.exists():
            return Response(
                {"detail": "Your cart is empty."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        total_amount = Decimal("0.00")

        for cart_item in cart_items:
            product = cart_item.product

            if not product.is_active:
                return Response(
                    {
                        "detail": (
                            f"{product.name} is no longer available."
                        )
                    },
                    status=status.HTTP_400_BAD_REQUEST,
                )

            if cart_item.quantity > product.stock:
                return Response(
                    {
                        "detail": (
                            f"Not enough stock for {product.name}."
                        )
                    },
                    status=status.HTTP_400_BAD_REQUEST,
                )

            total_amount += (
                product.price * cart_item.quantity
            )

        order = Order.objects.create(
            user=request.user,
            total_amount=total_amount,
        )

        for cart_item in cart_items:
            product = cart_item.product

            OrderItem.objects.create(
                order=order,
                product=product,
                quantity=cart_item.quantity,
                price=product.price,
                subtotal=product.price * cart_item.quantity,
            )

            product.stock -= cart_item.quantity
            product.save(update_fields=["stock"])

        cart.items.all().delete()

        serializer = self.get_serializer(order)

        return Response(
            serializer.data,
            status=status.HTTP_201_CREATED,
        )


class MyOrdersView(generics.ListAPIView):
    serializer_class = OrderSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return (
            Order.objects
            .filter(user=self.request.user)
            .prefetch_related("items__product")
            .order_by("-created_at")
        )
class AdminOrderListView(generics.ListAPIView):
    serializer_class = OrderSerializer
    permission_classes = [IsAdmin]

    def get_queryset(self):
        return (
            Order.objects
            .select_related("user")
            .prefetch_related("items__product")
            .order_by("-created_at")
        )


class AdminOrderStatusUpdateView(generics.UpdateAPIView):
    serializer_class = OrderSerializer
    permission_classes = [IsAdmin]

    queryset = Order.objects.all()
    http_method_names = ["patch"]

    def update(self, request, *args, **kwargs):
        order = self.get_object()
        new_status = request.data.get("status")

        valid_statuses = [
            choice[0] for choice in Order.Status.choices
        ]

        if new_status not in valid_statuses:
            return Response(
                {
                    "detail": "Invalid order status.",
                    "valid_statuses": valid_statuses,
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        order.status = new_status
        order.save(update_fields=["status", "updated_at"])

        serializer = self.get_serializer(order)

        return Response(serializer.data)