# Interactive Online Restaurant App

## Author
### Zahra Feisal

##
## About the Project
The application enables users to view the restaurant's menu as well as make an order.

API used : db.json file using json-server

##
## Accessing and running the files
The folder <em>restaurant</em> has 4 folders; <em>bootstrap</em>, <em>css</em>, <em>images</em>, <em>js</em>, and 3 files; <em>db.json</em>, <em>index.html</em>, <em>README.MD</em>, in its root level.

##
### Running the files in the browser
Open <em>index.html</em> in the browser.

#### Home Section
Displayed when the user clicks <em>home</em> in the navigation bar. Contains brief description and an 'Order Now!' button. When clicked, the <strong>Order Section</strong> is displayed.

#### Menu Section
Displayed when the user clicks <em>menu</em> in the navigation bar. Shows restaurant menu. 

When the page loads, a GET Request is made to the json-server to fetch the menu items and post them in the menu section.

#### Order Section
Displayed when the user clicks <em>order</em> in the navigation bar or the 'Order Now!' button in the <strong>Home Section</strong>. There's an order form that enables users to select the food type and quantity they wish to order. The form is designed in such a way that the food categories are organized in a dropdown, for users to choose from. The 'quantity' input is below each category selection.

<strong>NOTE:</strong> If the user wishes to order more than one food item from the same category, they can simply submit the form again after the initial submission, this time with the additional item. Their order details will be updated.

Once the form is submitted, the 'Order Details', 'Order Summary' sections and 'Contact Details' form are revealed.

1. The 'Order Details' section displays the details from the order form submittes.
2. The 'Contact Details' form captures the name, phone number and email of the user. A question will be displayed with 'Yes' and 'Delete' buttons, When clicked; 

<ul>
<li><strong>Yes:</strong> The user's contact details are displayed in the 'Order Summary' section as they are.
</li>
<li>
<strong>Delete:</strong> The user's details are deleted permanently.
</li>
</ul>

3. The 'Order Summary' section displays the user's contact details as well as their order. It has a 'Delete' button that when clicked, deletes the entire order plus contact details.

##
## How the code runs - Order Section

The "users" object in the <em>db.json</em> file is initially cleared of previous users when the window loads, to prevent saving sensitive information to other users. A DELETE Request is made for each user.

### Order Form
Captures the user's order items and corresponding quantities and pushes them to the 'orderDetails' array.

When 'Take Order' is clicked, the form is submitted, the class name 'show' is added to the <em>div</em> element containing the 'Order Details', 'Contact Details' and 'Order Summary' sections, hence making them visible.

The array is displayed in the 'Order Details' section.

### Contact Details
When submitted, the information is displayed below the form, for the user to double-check. There's a question below, with 'Yes' and 'Delete' buttons. A GET Request is made to the server for the "users" object.

#### 'Yes' button clicked
A POST Request is made to the "users" object within the second promise after the GET Request. An object containing the contact details and order details is created. On the frontend, the same data is added to the 'Order Summary' section.

#### 'Delete' button clciked
The contact details is cleared on the frontend, above the confirmation question. The user details to be created to the server are updated.

### Order Summary
Renderes the order details of the specific user.

Has a 'Delete' button that when clicked;

##### Frontend
1. The text content is cleared

##### Backend
1. A DELETE Request is made to the server, whereby the user object is permanently deleted, that is the contact and order details. The order is therefore null and void.
