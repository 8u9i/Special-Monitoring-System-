# How to Design an API – Best Practices

## Introduction

**API** stands for **Application Programming Interface**. An API acts as a communication bridge between two applications using requests and responses, and it is exposed to external users. 

## How Does an API Work?

To understand how an API works, imagine you are in a store and want to buy a soda. As an external user, you cannot just walk in and take one – you need an intermediary. The seller (the API) serves as this link between you and the item (the data) you want. 

You request the soda, the seller searches for the brand and flavour you want, and then gives it to you after you pay. 

In technical terms:

1. The seller (API) queries the shelves (database) for the requested data. 
2. The API searches the database table for detailed data. 
3. Finally, the API sends you the data you need in JSON format. 

**Example Request and Response:**
```
Your Request: /api/soda/fanta

Your Response: {
  "data": {
    "id": 2,
    "name": "fanta soda",
    "color": "orange",
  }
}
```
The response is always in **JSON** (JavaScript Object Notation) format. 

---

## Best Practices for Designing an API

### 1. Name the API Properly

- **Use a clear, concise name** – If you want to query a database of apples, name it `api/apples/` instead of `api/fruits/`. 
- **Use words that explain the query** – Use nouns that represent the resource's contents, for example `api/stationery/pens` instead of `api/stationery/write`. 
- **Avoid special characters** – Characters like `%20?` can confuse end-users and make the API's purpose unclear. 

---

### 2. Define Parameters When Necessary

Avoid using additional parameters unless you truly need them. 

**Common parameter types:**
- **Request headers and cookies** – Small pieces of data sent from the server to the user's browser. 
- **URL query string** – Inserted in URLs to filter, organize, or track content. 
- **URL paths** – Required to give users a way to get the right information (e.g., `/users/`, `/users/<id>/`). 
- **Body query string/multipart** – Sets the HTTP method (POST for sending data, PUT for updating data). 

**When are parameters needed?** When external users make multiple queries and the API needs to query other services to get the desired data. Without parameters, the API service may slow down. 

---

### 3. Define Response Objects

Response objects are properties returned when an API is called. 

**Common response objects:**
- **Title** – The display title of the response (e.g., `User`). This is **required**. 
- **Subject** – The subject of the response, such as user-related information. 
- **Sender_id** – The ID of the sender or user. This is **optional**. 
- **Categories** – The category of the response object (e.g., `Users`). 

> **Important:** Only return what the external user needs. Returning everything from the API service – even unnecessary information – is a terrible design practice that negatively impacts performance. 

---

### 4. Define Error Objects

When returning an error message, it should be **clear and concise** – not just a generic error like "Error Found" or "Error occurred." 

**Example of a Good Error Message:**
```json
{
  "errors": [
    {
      "message": "Invalid user characters length. Retry it.",
      "code": 400
    }
  ]
}
```
This explains what the end user did wrong and shows that this is a client error. 

---

### 5. Use Correct HTTPS Request Methods

| Method | Purpose |
|--------|---------|
| **POST** | Send data to the API |
| **GET** | Retrieve data after the API queries the database |
| **PUT** | Update existing data in the database |
| **PATCH** | Correct or replace existing data |
| **DELETE** | Delete information or data from the database |

> **Bad Practice:** Using a POST method when a user wants to query data with an ID. Instead, use GET with an ID as a parameter. 

**Example of a Correct GET Request:**
```
GET /users/123
```
Know all the HTTP request methods before defining a method, and ensure the routing is crystal clear so users can call the API service easily. 

---

### 6. Don't Create Side Effects on the API

A **side effect** occurs when, for example, a user queries an API for a user's first name but receives the ID and full name instead. 

When creating an API, avoid defining everything in one function. If the API sets many flags or performs many tasks simultaneously, it should be split into multiple APIs. 

---

### 7. Use Atomicity

**Atomicity** means grouping multiple operations into a single logical entity. When creating an API, poor naming of a function is a terrible idea. 

**When is atomicity needed?**
Imagine creating a user as an admin, creating the admin group table, and then adding the admin user to that table. If one part fails (e.g., the user isn't created but the table is created), atomicity ensures the entire operation is rolled back or handled correctly. 

When using atomicity, call the **right action** instead of a generic action – otherwise it creates confusion and a massive mess in the API. 

---

### 8. Use Pagination for Large Responses

When creating a large microservice and the response body becomes too large, **pagination** makes it easier to return a small amount of information at a time. 

**Example:**
- A database has 70 users.
- Instead of sending all 70 at once (which is slow), break the response down: return the first 30 users, then the next 30, then the final 10. 

**Note:** Pagination violates the property of stateless APIs, where the external user stores session-related information on their end. 

---

### 9. Handle Large Responses with Fragmentation

When an API communicates internally, the response is usually short. But when the response surpasses its limit (e.g., 10kb or 15kb per response), break the response down and give it to another service bit by bit – similar to breaking TCP packets into fragments. 

---

## Key Takeaways

- ✅ Avoid strange characters – use words that represent the contents of the API response. 
- ✅ Use pagination and fragmentation when the response object is large. 
- ✅ **Cache your requests** if you have a lot of load on your database. 
- ✅ If you have heavy load, **reduce your response time** – pass only essential or critical data. This is called **service degradation**. 
- ✅ For perfect data consistency, **cache your responses**. 

---

*Remember: A well-designed API is clear, efficient, and predictable. Follow these best practices to build APIs that are easy to use, maintain, and scale.*