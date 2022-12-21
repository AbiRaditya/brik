**Create product management server using nodejs (nestjs, expressjs, or other framework) with this criteria:**
**Database (Provide ERD)**

- Table products
  - id
  - name
  - description
  - price
  - image_url
- Table orders
  - id
  - Total_price
- Table customers
  - id
  - name

**API (Provide API documentation)**

- **CRUD product**

  - Create product API
  - Read all products API
  - Read product by id API
  - Update product API
  - Delete product API

- **Create orders API**

API documentation link = https://documenter.getpostman.com/view/17090003/2s8Z6scG4w

Body: - Array of products - Customer name
Response:

- 200
  - { success: true, message: ‘successfully create order’ }
- 400
  - { success: false, message: ‘failed to create customer’ }

Create order flow:

1.  Create customer
2.  Create orders

Specifications:

- We don’t want customer without order
- We don’t want any order without customer

Deploy
Please deploy the server to your preferred cloud.

- If you think this design needs more table or additional flow, feel free to add those.
- feel free to use your preferred architecture

**Point plus**

- deploy documentation
