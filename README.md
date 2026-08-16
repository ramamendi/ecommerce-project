# Full-Stack E-Commerce Website

A full-stack e-commerce application built with Django REST Framework
and React.

## Features

### Customer
- User registration and login
- JWT authentication
- Browse products
- Add products to cart
- Update cart quantity
- Remove cart items
- Checkout
- View order history

### Admin
- Admin authentication
- Admin dashboard
- Add products
- Edit products
- Delete products
- Activate/deactivate products
- Manage product stock
- View all customer orders
- Update order status

## Tech Stack

Frontend:
- React
- React Router
- Axios
- Bootstrap

Backend:
- Python
- Django
- Django REST Framework
- JWT Authentication

Database:
- MySQL

Other:
- Cloudinary
- Git/GitHub

## Authentication

JWT authentication is used to secure API requests.

Access and refresh tokens are stored on the frontend.
Axios interceptors automatically attach the access token and
refresh it when required.

## User Roles

CUSTOMER
- Shopping and order functionality

ADMIN
- Product and order management

## Main API Modules

/users/
/products/
/cart/
/orders/

## Project Structure

frontend/
├── src/
│   ├── components/
│   ├── pages/
│   ├── api/
│   └── App.jsx

backend/
├── users/
├── products/
├── cart/
└── orders/