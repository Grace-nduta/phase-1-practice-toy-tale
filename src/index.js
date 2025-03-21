let addToy = false;

document.addEventListener("DOMContentLoaded", () => {
  const addBtn = document.querySelector("#new-toy-btn");
  const toyFormContainer = document.querySelector(".container");
  addBtn.addEventListener("click", () => {
    // hide & seek with the form
    addToy = !addToy;
    if (addToy) {
      toyFormContainer.style.display = "block";
    } else {
      toyFormContainer.style.display = "none";
    }
  });

  const toyCollection = document.querySelector("#toy-collection");
  const toyForm = document.querySelector(".add-toy-form");

  // Fetch and display toys
  fetch("http://localhost:3000/toys")
    .then((response) => response.json())
    .then((toys) => {
      toys.forEach((toy) => {
        renderToyCard(toy);
      });
    });

  // Add new toy
  toyForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const toyName = event.target.name.value;
    const toyImage = event.target.image.value;

    fetch("http://localhost:3000/toys", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        name: toyName,
        image: toyImage,
        likes: 0,
      }),
    })
      .then((response) => response.json())
      .then((newToy) => {
        renderToyCard(newToy);
        event.target.reset();
      });
  });

  // Render toy card
  function renderToyCard(toy) {
    const toyCard = document.createElement("div");
    toyCard.className = "card";

    toyCard.innerHTML = `
      <h2>${toy.name}</h2>
      <img src="${toy.image}" class="toy-avatar" />
      <p>${toy.likes} Likes</p>
      <button class="like-btn" id="${toy.id}">Like ❤️</button>
    `;

    const likeButton = toyCard.querySelector(".like-btn");
    likeButton.addEventListener("click", () => {
      const newLikes = toy.likes + 1;

      fetch(`http://localhost:3000/toys/${toy.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          likes: newLikes,
        }),
      })
        .then((response) => response.json())
        .then((updatedToy) => {
          toy.likes = updatedToy.likes;
          toyCard.querySelector("p").textContent = `${updatedToy.likes} Likes`;
        });
    });

    toyCollection.appendChild(toyCard);
  }
});
