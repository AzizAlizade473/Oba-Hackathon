# 🚀 Epsilon: The Retail Intelligence Ecosystem

> **Turning Customer Receipts into Actionable R&D Data for Physical Retail.**
> *1st Place Winner — OBA Market Innovation Hackathon | Incubated by Veysəloğlu Group*

[![Status](https://img.shields.io/badge/Status-Production_Ready-success)]()
[![Stack](https://img.shields.io/badge/Stack-NestJS_|_Python_|_MySQL_|_AlpineJS-blue)]()
[![Deployment](https://img.shields.io/badge/Deployment-Docker_|_AWS_EC2-orange)]()
[![License](https://img.shields.io/badge/License-MIT-green)]()

---

## 📖 System Overview

**Epsilon** is a comprehensive B2B2C loyalty and data analytics platform designed for the "Hard Discount" and FMCG retail sectors. 

By gamifying the post-purchase experience, Epsilon transforms the "Silent Customer" into a real-time Research & Development (R&D) laboratory. Customers earn micro-cashback for rating products on their digital receipts, while the platform's AI and automation engines provide retail management with instant, data-driven operational commands (e.g., *Scale Production, Discount, Stop Restock*).

### 🎯 The Business Impact
*   **Eradicates "Dead Stock":** Identifies failing Private Label (PL) products in days, not months.
*   **Data-Driven Logistics:** Rebalances inventory based on regional sentiment analysis.
*   **Zero Marginal Cost:** Funded entirely by reallocating existing, passive loyalty budgets into active data acquisition.

---

## 🏗️ Architecture & Tech Stack

Epsilon is a cloud-native, microservices-based architecture orchestrated via **Docker Compose**, heavily optimized to run efficiently on AWS EC2 free-tier instances (8GB constraint).

### Core Components
| Service | Technology | Description | Port |
| :--- | :--- | :--- | :--- |
| **Backend API** | `NestJS` (Node 20) | Handles Auth, Orders, Products, and core business logic. | `:3000` |
| **Database** | `MySQL 8.0` | Relational DB storing 11 core entities (Users, Ratings, Cards). | `:3306` |
| **AI Classifier** | `FastAPI` (Python 3.10) | NLP engine using CPU-only PyTorch for review classification. | `:8000` |
| **Admin Dashboard**| `Nginx` + `Alpine.js` | Web UI for management to review AI recommendations. | `:8080` |
| **Order UI (POS)** | `Nginx` + `Alpine.js` | Cashier-facing interface for generating orders & receipts. | `:80` |

*Note: The customer-facing Mobile App (React Native/Expo) is maintained in a separate repository.*

---

## ⚙️ The Data Pipeline (How It Works)

Epsilon operates as a fully automated, closed-loop feedback engine:

1.  **The Purchase (`POST /orders`):** Cashier creates an order. The customer receives immediate base cashback (e.g., 2%). Reward vouchers (`ProductCredit`) are silently generated for eligible PL products.
2.  **The Rating (`POST /ratings`):** The customer rates the product via the app. The reward is instantly credited to their balance.
3.  **AI Classification (FastAPI):** If the rating is low (≤ 3 stars), the Python engine analyzes the comment and categorizes the root cause (e.g., *Quality, Price, Packaging*).
4.  **Spam Detection & Trust Scoring (n8n):** Scheduled workflows calculate a dynamic `ratingReliability` score using Z-Score divergence and time-anomaly detection. Spam is discarded.
5.  **The Decision Engine:** Verified data triggers automated business rules, generating API commands for management (e.g., `START_RESTOCK` for highly-rated items, `DISCOUNT_PRODUCT` for failing items).
6.  **Executive Reporting:** Live data is visualized via **Power BI** for strategic decision-making.

---



# Welcome to your Expo app 👋

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
   npx expo start
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## Get a fresh project

When you're ready, run:

```bash
npm run reset-project
```

This command will move the starter code to the **app-example** directory and create a blank **app** directory where you can start developing.

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.
