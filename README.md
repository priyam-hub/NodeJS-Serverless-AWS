<div align = "center">
  
# 🛠️ Serverless CRUD API using AWS Lambda, API Gateway & DynamoDB

This repository contains a **serverless backend application** built using **Node.js**, **AWS Lambda**, **API Gateway**, and **DynamoDB**. It demonstrates how to implement a scalable and cost-efficient REST API for user management — including **Create**, **Read**, **Update**, and **Delete** (CRUD) operations — using the **Serverless Framework**.

</div>
---

## 🚀 Features

* Serverless architecture using AWS Lambda
* REST API endpoints via API Gateway
* DynamoDB for persistent NoSQL storage
* Clean and modular code (Node.js)
* IAM role-based access control
* Easily deployable using the Serverless Framework

---

## 📁 Project Structure

```
├── handler.js           # Lambda function logic for CRUD operations
├── serverless.yml       # Serverless framework configuration
├── package.json         # Node.js dependencies
└── README.md            # Project documentation
```

---

## 🧩 Technologies Used

* **Node.js** (v18.x)
* **AWS Lambda**
* **Amazon API Gateway**
* **Amazon DynamoDB**
* **Serverless Framework**

---

## 📦 Installation & Setup

### Prerequisites

* Node.js installed
* AWS CLI configured
* Serverless Framework installed globally

  ```bash
  npm install -g serverless
  ```

### Steps

1. Clone the repository:

   ```bash
   git clone https://github.com/your-username/serverless-dynamodb-crud.git
   cd serverless-dynamodb-crud
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Deploy to AWS:

   ```bash
   serverless deploy
   ```

   After deployment, the terminal will show the endpoint URLs for your APIs.

---

## 📬 API Endpoints

| Method | Endpoint            | Description       |
| ------ | ------------------- | ----------------- |
| POST   | `/create-user`      | Create a new user |
| GET    | `/get-users`        | Get all users     |
| PUT    | `/update-user/{id}` | Update user by ID |
| DELETE | `/delete-user/{id}` | Delete user by ID |

**Note:** All requests and responses use `application/json` format.

---

## 📘 Sample Request Body

### POST `/create-user`

```json
{
  "id": "123",
  "name": "John Doe",
  "email": "john@example.com"
}
```

### PUT `/update-user/{id}`

```json
{
  "name": "Jane Doe",
  "email": "jane@example.com"
}
```

---

## 🛡 IAM Role Requirements

Make sure the Lambda execution role has permission to access DynamoDB:

```yaml
Effect: Allow
Action:
  - dynamodb:PutItem
  - dynamodb:Scan
  - dynamodb:UpdateItem
  - dynamodb:DeleteItem
Resource: arn:aws:dynamodb:<region>:<account-id>:table/Users
```

---

## 🧹 Clean Up

To remove all resources created:

```bash
serverless remove
```

---

## 📄 License

This project is licensed under the MIT License.
