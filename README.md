# Next.js + GraphQL – Shopping Cart

This is a frontend built to implement a minimal e-commerce storefront with Next.js (App Router), TypeScript, GraphQL, and Material UI, showcasing clean code practices, modular architecture, state management, and deployment workflows.

🔗 **Live Demo:** [shopping-cart-nextjs-qraphql](https://shopping-cart-nextjs-qraphql.vercel.app/)

---

## 🛠️ Tech Stack

- **Next.js (App Router)**
- **TypeScript**
- **GraphQL (Apollo Client / fetch layer)**
- **Material UI**
- **Formik** for forms
- **Jest** for testing
- **ESLint** for linting
- **Vercel** for deployment

---

## 🧪 Running the Project

### Prerequisites

- Node.js (>=18)
- Yarn (1.x)

### Steps

```bash
# Clone the repo
git clone git@github.com:SaumikSarkar/shopping-cart-nextjs-qraphql.git
cd shopping-cart-nextjs-qraphql

# Install dependencies
yarn install

# Run the dev server
yarn dev
# → App will be available at http://localhost:3000

# Run lint checks
yarn lint

# Auto-fix lint issues
yarn lint:fix

# Run unit tests
yarn test
```

---

## 📦 Deployment

- CI/CD: GitHub Actions workflow for PR validation
- Hosting: Vercel (Next.js optimized)
- Static pages: GitHub Pages

---

## 🚀 Features Implemented

### ✅ Core Pages

- **Login Page**

  - Username/password validation using **Formik**
  - Session handled via **cookies**
  - Route guards based on user permissions

- **Product Listing Page (PLP)**

  - Product listing with **pagination & infinite scrolling**
  - **Search with debounce** (query not functional due to lack of backend docs)
  - **Filtering UI** (hardcoded, as attributes query returned errors)
  - Graceful fallbacks for missing product images

- **Product Detail Page (PDP)**

  - Product details with **image carousel**
  - Support for **variants** & **quantity selection**
  - **Add to cart** functionality

- **Cart Page**

  - Full cart listing with **subtotal & total calculations**
  - Ability to **add/reduce quantity** and **remove items**
  - (Thumbnails not rendered due to backend serving invalid image URLs)

- **Checkout Page**
  - Partial implementation (checkout-related mutations were failing in Postman collection)

### ✅ Additional Implementations
- **Skeleton states** everywhere for smooth UX  
- **Material UI** for components & styling  
- **ESLint** with custom configurations  
- **Unit tests with Jest** – 90%+ coverage  
- **GitHub Actions Workflow** for PR checks  
- **Deployed on Vercel** + **GitHub Pages for static pages**  
- **PR-based workflow** with proper commit history  

---

## ⚠️ Known Issues & Backend Limitations
- **Attributes query failing** → fallback hardcoded filters used  
- **Search query undocumented** → debounce implemented, query incomplete  
- **Product pricing & images missing** → only 2 products render correctly in PDP; fallback images used  
- **Checkout mutations failing** → checkout not fully functional  
- **Image URLs pointing to localhost:8000** → cart/product thumbnails broken  
- **Backend often unstable (503)** → impacts app reliability  

---

## 🔧 What Can Be Improved
- Form validation handling could be better in **Login page**, handling pristine, dirty, and blur states  
- More robust **UX for PLP**, along with style enhancements  
- More detailed **PDP page** (as more information can be displayed)  
- Better **UX on Cart and Checkout pages**  
- Add **Error Boundaries** wherever required  
- Identifying **performance issues** and memoizing in necessary places  
- More modular architecture with proper **separation of concerns**  
- Inline comments wherever required to improve code readability  
- Add **Husky pre-commit hooks** and **lint-staged** to enforce code quality  

---

## 📝 Notes

This project focuses on demonstrating code semantics, architecture, and approach more than feature completeness, given backend API instabilities. With a stable backend and proper API documentation, the app can be fully functional with the outlined improvements.
