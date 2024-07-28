// get references to elements
const navSection = document.querySelector(".navSection");
const menuBar = document.getElementById("menuBar");
const menuContainer = document.querySelector("#container");
const orderForm = document.getElementById("orderForm");
const ordersContainer = document.getElementById("orderDetails");
const contactDetailsMainDiv = document.querySelector(".contactDetails");
const contactForm = document.getElementById("contactForm");
const contactData = document.getElementById("contactData");
const orderSummary = document.getElementById("orderSummary");
const foodItemInput = document.getElementById("orders");
const suggestionsContainer = document.querySelector('.suggestions');
let orderDetails = [];

window.addEventListener('load', () => {
  fetch('http://localhost:3000/users')
  .then(resp => resp.json())
  .then(users => {
    users.forEach(user => {
      fetch(`http://localhost:3000/users/${user.id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'apllication/json'
        }
      })
      .then(resp => resp.json())
      .then(users => console.log(users))
    })
  })
})

document.addEventListener("DOMContentLoaded", () => {
  // fetch items from server and display them to menu section
  fetch("http://localhost:3000/menu") // GET Request, READ
    .then((resp) => {
      if (!resp.ok) {
        throw new Error("Network response was not okay");
      }
      return resp.json();
    })
    .then((menu) => {
      const displayMenuItems = (items) => {
        items.forEach((item) => {
          const itemContainer = document.createElement("div");
          itemContainer.classList.add("menuItem");

          const itemName = document.createElement("h3");
          itemName.textContent = item.name;
          itemName.classList.add("menuItemName");

          const itemImg = document.createElement("img");
          itemImg.src = item.image;
          itemImg.alt = item.name;
          itemImg.className = "foodPicMenu";

          const itemPrice = document.createElement("p");
          itemPrice.textContent = `${item.price} /=`;
          itemPrice.classList.add("menuItemPrice");

          const itemDescription = document.createElement("p");
          itemDescription.textContent = item.description;
          itemDescription.classList.add("menuItemDescription");

          // updaTe DOM
          itemContainer.append(itemName, itemDescription, itemPrice, itemImg);
          menuContainer.appendChild(itemContainer);
        });
      };
      // function call on menu items
      displayMenuItems(menu.sandwiches);
      displayMenuItems(menu.pizza);
      displayMenuItems(menu.meals);
      displayMenuItems(menu.hotDrinks);

      // suggests menu items to users as they type, avoid them inputting unavailable items
      const allMenu = [].concat(...Object.values(menu)).map(item => item.name)

      foodItemInput.addEventListener('input', () => {
        const order = foodItemInput.value.toLowerCase();
        suggestionsContainer.innerHTML = ''

        if (order) {
          const suggestions = allMenu.filter(item => item.toLowerCase().includes(order));

          suggestions.forEach(suggestion => {
            const p = document.createElement('p')
            p.textContent = `↖ ${suggestion}`

            suggestionsContainer.appendChild(p)

            p.addEventListener('click', () => {
              foodItemInput.value = suggestion;

              suggestionsContainer.innerHTML = ''
            })
          })
        }
      })
    })
    .catch((error) =>
      console.error("error fetching initial menu data:", error)
    );

  // click eventListener on the menu bar, applicable in media queries
  menuBar.addEventListener("click", () => {
    menuBar.classList.toggle("fa-times");
    navSection.classList.toggle("active");
  });

  // scroll eventListener, avoid menu bar overlapping content
  window.addEventListener("scroll", () => {
    menuBar.classList.remove("fa-times");
    navSection.classList.remove("active");
  });

  // submit eventListener on order form
  orderForm.addEventListener("submit", (event) => {
    event.preventDefault();

    contactDetailsMainDiv.classList.add("show"); // enable users to input contacts & view order details and summary after submitting

    const foodItem = document.getElementById("orders").value;
    const foodQty = parseInt(document.getElementById("quantity").value, 10);

    if (foodQty > 0) {
      orderDetails.push(`${foodQty} x ${foodItem}`);
    }

    ordersContainer.innerHTML = "";
    orderDetails.forEach((detail) => {
      const p = document.createElement("p");
      p.textContent = detail;
      p.classList.add("orderDetailsDescription");

      ordersContainer.appendChild(p);
    });
    orderForm.reset();
    return orderDetails;
  });

  // submit eventListener for contact form
  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();

    let userName = document.getElementById("name").value;
    let phone = document.getElementById("phone").value;
    let email = document.getElementById("email").value;

    const nameP = document.createElement("p");
    nameP.textContent = `Name : ${userName}`;
    nameP.classList.add("orderDetailsDescription");

    const phoneP = document.createElement("p");
    phoneP.textContent = `Phone Number : ${phone}`;
    phoneP.classList.add("orderDetailsDescription");

    const emailP = document.createElement("p");
    emailP.textContent = `Email Address : ${email}`;
    emailP.classList.add("orderDetailsDescription");

    contactData.append(nameP, phoneP, emailP);

    contactForm.reset();

    let userDetails = {
      name: userName,
      tel: phone,
      emailAddress: email,
      order: orderDetails,
    };

    // Delete contact info frontend
    const deleteButton = document.getElementById("deleteButton");
    deleteButton.addEventListener("click", () => {
      contactData.innerHTML = "";

      let newUserName = document.getElementById("name").value;
      let newPhone = document.getElementById("phone").value;
      let newEmail = document.getElementById("email").value;

      // update user details to be created to users when yes is clicked
      userDetails.name = newUserName
      userDetails.tel = newPhone
      userDetails.emailAddress = newEmail
    });

    // Edit contact info on frontent
    const editButton = document.getElementById('editButton');
    editButton.addEventListener("click", () => {
      if (contactData.classList.contains('editMode')) {
        let newName = document.querySelector('.nameEdit').value
        let newTel = document.querySelector('.phoneEdit').value
        let newMail = document.querySelector('.emailEdit').value

        nameP.textContent = `Name : ${newName}`;
        phoneP.textContent = `Phone number : ${newTel}`;
        emailP.textContent = `Email Address : ${newMail}`;

        editButton.textContent = 'Edit'

        // update user details to be created to users when yes is clicked
        userDetails.name = newName
        userDetails.tel = newTel
        userDetails.emailAddress = newMail

        contactData.innerHTML = ''
        contactData.append(nameP, phoneP, emailP)
      } else {
        contactData.innerHTML = ''

        const nameEdit = document.createElement('input');
        nameEdit.type = 'text'
        nameEdit.classList.add("contactInputs", 'nameEdit');

        const phoneEdit = document.createElement('input');
        phoneEdit.type = 'tel'
        phoneEdit.pattern = '[0-9]{4}-[0-9]{3}-[0-9]{3}';
        phoneEdit.classList.add("contactInputs", 'phoneEdit');

        const emailEdit = document.createElement('input')
        emailEdit.type = 'email'
        emailEdit.classList.add("contactInputs", 'emailEdit');

        nameEdit.value = userName
        phoneEdit.value = phone
        emailEdit.value = email

        editButton.textContent = 'Save'

        contactData.append(nameEdit, phoneEdit, emailEdit)
      }
      contactData.classList.toggle('editMode')
    })

    // update users in db.json file
    fetch("http://localhost:3000/users")
      .then((resp) => resp.json()) // GET Request, READ
      .then(() => {
        // CREATE user object in 'users'
        const yesButton = document.getElementById("yesButton");
        yesButton.addEventListener("click", () => {
          fetch("http://localhost:3000/users", {
            // POST Request, CREATE
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(userDetails),
          })
            .then((resp) => {
              if (!resp.ok) {
                throw new Error("Response was NOT okay");
              }
              return resp.json();
            })
            .then((userData) => {
              // display user info in order summary section
              orderSummary.innerHTML = "";

              const userNameP = document.createElement("p");
              userNameP.textContent = `Name: ${userData.name}`;
              userNameP.classList.add("orderDetailsDescription");

              const phoneP = document.createElement("p");
              phoneP.textContent = `Phone Number : ${userData.tel}`;
              phoneP.classList.add("orderDetailsDescription");

              const emailP = document.createElement("p");
              emailP.textContent = `Email Address : ${userData.emailAddress}`;
              emailP.classList.add("orderDetailsDescription");

              const orderP = document.createElement("p");
              orderP.textContent = `Order Details : ${userData.order}`;
              orderP.classList.add("orderDetailsDescription");

              orderSummary.append(userNameP, phoneP, emailP, orderP);
              contactData.innerHTML = "";

              const userNewId = userData.id;

              // Delete user
              const deleteOrderButton = document
                .getElementById("deleteOrderButton")
                .addEventListener("click", () => {
                  // DELETE user from db.json
                  fetch(`http://localhost:3000/users/${userNewId}`, {
                    method: "DELETE", // DELETE Request, DELETE
                    headers: {
                      "Content-Type": "application/json",
                    },
                  })
                    .then((resp) => {
                      if (!resp.ok) {
                        throw new Error("unable to delete user");
                      }

                      // delete user's info on frontend
                      orderSummary.innerHTML = "";
                      contactData.innerHTML = "";
                      ordersContainer.innerHTML = "";
                      orderDetails = [];
                    })
                    .catch((error) =>
                      console.error("Error in deletion:", error)
                    );
                });
            })
            .catch((error) =>
              console.error("Error fetching user data:", error)
            );
        });
      })
      .catch((error) => console.error("Error posting to users:", error));
  });
});
