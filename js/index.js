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
let orderDetails = [];

// prevent users from obtaining previous users' info
window.onload = () => deleteUsers();

// clear other users in server when page loads
function deleteUsers() {
  fetch("http://localhost:3000/users") // GET Request, READ
    .then((resp) => {
      if (!resp.ok) {
        throw new Error("Cannot fetch initial users");
      } else {
        return resp.json();
      }
    })
    .then((users) => {
      users.forEach((user) => {
        fetch(`http://localhost:3000/users/${user.id}`, {
          // DELETE Request, DELETE
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        })
          .then((resp) => {
            if (!resp.ok) {
              console.log("Error deleting users:", resp.statusText);
            }
          })
          .catch((error) => console.error("Error deleting users:", error));
      });
    })
    .catch((error) => console.error("Error deleting initial users:", error));
}

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

    const sandwiches = document.getElementById("sandwiches").value;
    const sandwichesQty = parseInt(
      document.getElementById("sandwichesQty").value,
      10
    );

    const pizza = document.getElementById("pizza").value;
    const pizzaQty = parseInt(document.getElementById("pizzaQty").value, 10);

    const meals = document.getElementById("meals").value;
    const mealsQty = parseInt(document.getElementById("mealsQty").value, 10);

    const hotDrinks = document.getElementById("hotDrinks").value;
    const hotDrinksQty = parseInt(
      document.getElementById("hotDrinksQty").value,
      10
    );

    if (sandwichesQty > 0) {
      orderDetails.push(`${sandwichesQty} x ${sandwiches}`);
    }

    if (pizzaQty > 0) {
      orderDetails.push(`${pizzaQty} x ${pizza}`);
    }

    if (mealsQty > 0) {
      orderDetails.push(`${mealsQty} x ${meals}`);
    }

    if (hotDrinksQty > 0) {
      orderDetails.push(`${hotDrinksQty} x ${hotDrinks}`);
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

    const userName = document.getElementById("name").value;
    const phone = document.getElementById("phone").value;
    const email = document.getElementById("email").value;

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

    // update users in db.json file
    fetch("http://localhost:3000/users")
      .then((resp) => resp.json()) // GET Request, READ
      .then(() => {
        // const userId = user.id;

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

        // Delete contact info frontend
        const deleteButton = document.getElementById("deleteButton");
        deleteButton.addEventListener("click", () => {
          contactData.innerHTML = "";

          const newUserName = document.getElementById("name").value;
          const newPhone = document.getElementById("phone").value;
          const newEmail = document.getElementById("email").value;

          // update user details to be created to users when yes is clicked
          userDetails = {
            name: newUserName,
            tel: newPhone,
            emailAddress: newEmail,
            order: orderDetails,
          };
        });
      })
      .catch((error) => console.error("Error posting to users:", error));
  });
});
