fetch("games.json")
  .then(res => res.json())
  .then(games => {
    const grid = document.getElementById("gamesGrid");

    games.forEach(game => {
      const card = document.createElement("div");
      card.className = "card";

      card.innerHTML = `
        <img src="${game.image}" alt="${game.title}">
        <div class="card-content">
          <h2>${game.title}</h2>
          <p>${game.description}</p>
        </div>
      `;

      card.addEventListener("click", () => {
        window.location.href = game.path;
      });

      grid.appendChild(card);
    });
  })
  .catch(() => {
    document.getElementById("gamesGrid").innerHTML =
      "<p>Failed to load games.</p>";
  });
