from django.urls import path

from .views import (
    CartItemCreateView,
    CartItemDeleteView,
    CartItemUpdateView,
    CartView,
)


urlpatterns = [
    path("", CartView.as_view(), name="cart"),
    path(
        "items/",
        CartItemCreateView.as_view(),
        name="cart_item_create",
    ),
    path(
        "items/<int:pk>/",
        CartItemUpdateView.as_view(),
        name="cart_item_update",
    ),
    path(
        "items/<int:pk>/delete/",
        CartItemDeleteView.as_view(),
        name="cart_item_delete",
    ),
]