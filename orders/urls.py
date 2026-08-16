from django.urls import path

from .views import (
    AdminOrderListView,
    AdminOrderStatusUpdateView,
    CheckoutView,
    MyOrdersView,
)


urlpatterns = [
    path(
        "checkout/",
        CheckoutView.as_view(),
        name="checkout",
    ),
    path(
        "my-orders/",
        MyOrdersView.as_view(),
        name="my_orders",
    ),
    path(
        "admin/",
        AdminOrderListView.as_view(),
        name="admin_orders",
    ),
    path(
        "admin/<int:pk>/status/",
        AdminOrderStatusUpdateView.as_view(),
        name="admin_order_status",
    ),
]