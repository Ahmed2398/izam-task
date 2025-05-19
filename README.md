# E-Commerce Product Management System

A modern, full-stack e-commerce product management system built with **Laravel** and **React**, featuring a powerful RESTful API backend and a responsive, dynamic frontend interface with enhanced user experience.

---

## 📖 Overview

This system delivers a comprehensive solution for managing products and handling shopping cart functionality in an e-commerce environment. It features a clean, modern UI with responsive layouts, efficient backend APIs, and seamless user interactions.

---

## 🚀 Key Features

### 🛒 Product Management

* Responsive product grid layout
* Search functionality by product name
* Filtering by:

  * Price range (minimum/maximum)
  * Category
* Product detail display:

  * Name and category
  * Pricing and stock availability
  * Quantity selector for orders

### 🛍️ Shopping Cart & Orders

* Add/remove products to/from cart
* Real-time quantity adjustments
* Persistent cart using **Local Storage**
* Dynamic order summary with:

  * Subtotal calculation
  * Shipping cost estimation
  * Tax computation
  * Final total display

### 🎨 User Interface

* Fully responsive and mobile-friendly
* Smooth transitions and animations
* Modern, clean, and consistent design using **Tailwind CSS**
* SweetAlert notifications for improved user experience
* Thoughtful empty state and loading indicators

---

## ⚙️ Getting Started

### 📦 Requirements

* PHP 8.2+
* Node.js 20+
* Composer

## 📥 Installation

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/Ahmed2398/izam-task.git
cd izam-task
```

---

### 2️⃣ Install Dependencies

#### Option A: Automated Installation (Linux/macOS)

If you're on Linux or macOS, you can run the installation script:

```bash
bash install.sh
```

>📝 **Note**: This requires a bash-compatible terminal (e.g., Terminal, iTerm, Git Bash).

---

#### Option B: Manual Installation

If you prefer or need to install manually:

```bash
composer install
npm install
cp .env.example .env
php artisan key:generate
php artisan migrate --seed
npm run dev
```

*Adjust `.env` settings (e.g., database connection) as needed before running migrations.*

---

### 3️⃣ Start the Development Server

```bash
composer run dev
```

---

### 4️⃣ Access the Application

* URL: `http://localhost:8000`
* Default credentials:

  * **Email:** `test@example.com`
  * **Password:** `password`

---

## 🛠️ Technology Stack

### Backend

* **Laravel 12**
* **SQLite Database**
* RESTful API architecture
* **Laravel Sanctum** for API authentication

### Frontend

* **React** with **TypeScript**
* **React Router** for navigation
* **Tailwind CSS** for responsive design
* **SweetAlert** for improved user notifications
* **Axios** for API communication
* Local Storage for cart persistence

---

## 📂 Project Structure

```
├── app/               # Laravel backend
│   ├── Console/
│   ├── Http/
│   └── Models/
├── resources/
│   └── js/            # React frontend
│       ├── components/
│       ├── context/
│       ├── layouts/
│       ├── pages/
│       └── types/
└── routes/
    └── api.php        # API routes
```

---

## 📚 Development Guidelines

### Backend

* API routes defined in `routes/api.php`
* Models located in `app/Models`
* Controllers in `app/Http/Controllers`
* Event-driven architecture for order notifications (OrderPlaced event)
* **API Endpoints:**
  * `GET /products` — Retrieve all products with filtering (by name, price range, category) and pagination
  * `GET /products/{id}` — Retrieve details for a single product
  * `GET /orders` — Retrieve all orders with caching and pagination
  * `GET /orders/{id}` — Retrieve a single order’s details (products, quantities, total)
  * `POST /orders` — Place a new order with product availability and quantity validation

### Frontend

* React components in `resources/js/`
* TypeScript interfaces in `resources/js/types/`
* Axios handles API requests
* No use of Inertia.js — direct REST API calls only

---

## 📬 API Testing

The project includes a **Postman collection file** for quick testing of all API endpoints.
You’ll find it in the root of the repository as:

```
postman_collection.json
```

This file contains sample requests for:

* Product listing, filtering, and details
* Order creation
* Order listing and details retrieval

Simply import this collection into **Postman** and adjust the base URL and authorization token (if required) to match your local development environment.
