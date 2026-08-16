from django.urls import path

from .views import (
    CategoryListCreateView,
    ProductListCreateView,
    ProductDetailView,
)


urlpatterns = [
    path(
        "categories/",
        CategoryListCreateView.as_view(),
        name="category_list",
    ),
    path(
        "products/",
        ProductListCreateView.as_view(),
        name="product_list",
    ),
    path(
        "products/<int:pk>/",
        ProductDetailView.as_view(),
        name="product_detail",
    ),
]