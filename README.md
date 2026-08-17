# 🛒 Full-Stack E-Commerce Website

A full-stack e-commerce web application built using **React** and **Django REST Framework**.

The application provides separate experiences for **customers and administrators**, including product browsing, cart management, checkout, order tracking, product management, and order management.

---

## 🚀 Features

### 👤 Customer Features

- User registration
- User login and logout
- JWT authentication
- Browse available products
- View product details
- Add products to cart
- Increase/decrease product quantity
- Remove products from cart
- View cart total
- Checkout
- View order history
- Track order status
- Product availability handling

### 👨‍💼 Admin Features

- Admin authentication
- Protected admin dashboard
- Add products
- Edit products
- Delete products
- Manage product stock
- Activate/deactivate products
- View all customer orders
- Update order status
- Separate admin navigation
- Protected admin routes

### 🔐 Authentication & Security

- JWT-based authentication
- Access and refresh tokens
- Automatic access-token refresh
- Axios request/response interceptors
- Role-based access control
- Protected admin routes
- Environment variables for database credentials

---

## 🛠️ Technology Stack

### Frontend

- React
- React Router
- Axios
- Bootstrap
- Vite

### Backend

- Python
- Django
- Django REST Framework
- Simple JWT

### Database

- MySQL 8.4

### Image Storage

- Cloudinary

### Development Tools

- Git
- GitHub
- VS Code
- MySQL Workbench

---

## 🏗️ Project Architecture

```text
                    React Frontend
                         │
                         │ REST API / Axios
                         ▼
              Django REST Framework
                         │
          ┌──────────────┼──────────────┐
          │              │              │
          ▼              ▼              ▼
        Users         Products       Cart / Orders
          │              │              │
          └──────────────┼──────────────┘
                         │
                         ▼
                     MySQL 8.4
                         
                     Cloudinary
                   Product Images



📁 Project Structure
ecommerce-project/
│
├── cart/
│   ├── migrations/
│   ├── models.py
│   ├── serializers.py
│   ├── urls.py
│   └── views.py
│
├── config/
│   ├── settings.py
│   ├── urls.py
│   ├── asgi.py
│   └── wsgi.py
│
├── orders/
│   ├── migrations/
│   ├── models.py
│   ├── serializers.py
│   ├── urls.py
│   └── views.py
│
├── products/
│   ├── migrations/
│   ├── models.py
│   ├── serializers.py
│   ├── urls.py
│   └── views.py
│
├── users/
│   ├── migrations/
│   ├── models.py
│   ├── permissions.py
│   ├── serializers.py
│   ├── urls.py
│   └── views.py
│
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
│
├── manage.py
├── requirements.txt
├── .gitignore
└── README.md