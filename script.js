let boutonActualiser = document.getElementById("btn-refresh");
let searchInput = document.getElementById("search");
let livresCache = [];

function afficherListe(livres) {
    const liste = document.getElementById("liste");
    liste.innerHTML = "";

    livres.forEach(livre => {
        const li = document.createElement("li");
        li.textContent = livre.titre + " - " + livre.auteur + " / " + livre.categorie;

        const btnDelete = document.createElement("button");
        btnDelete.textContent = "Supprimer";

        btnDelete.addEventListener("click", () => {
            if (confirm(`Voulez-vous vraiment supprimer ${livre.titre} ?`)) {
                fetch(`http://localhost:5000/api/books/${livre.id}`, {
                    method: "DELETE"
                })
                    .then(res => res.json())
                    .then(data => {
                        alert(data.message);
                        boutonActualiser.click(); // recharge la liste
                    });
            }
        });

        li.appendChild(btnDelete);
        liste.appendChild(li);
    });
}

boutonActualiser.addEventListener("click", () => {
    fetch("http://localhost:5000/api/books")
        .then(response => response.json())
        .then(data => {
            livresCache = data; // stocker la liste complète
            afficherListe(livresCache);
        });
});


searchInput.addEventListener("input", () => {
    const recherche = searchInput.value.toLowerCase();
    const filtres = livresCache.filter(livre =>
        (livre.titre && livre.titre.toLowerCase().includes(recherche)) ||
        (livre.auteur && livre.auteur.toLowerCase().includes(recherche)) ||
        (livre.categorie && livre.categorie.toLowerCase().includes(recherche))
    );

    afficherListe(filtres);
});

// Gérer la soumission du formulaire d'ajout
const form = document.querySelector("form");
form.addEventListener("submit", (e) => {
    e.preventDefault();

    const formData = new FormData(form);

    fetch("http://localhost:5000/api/books", {
        method: "POST",
        body: formData
    })
        .then(response => {
            if (response.ok) {
                alert("Livre ajouté !");
                form.reset();
                boutonActualiser.click(); // Recharge la liste
            } else {
                console.error("Erreur lors de l'ajout du livre.");
            }
        })
        .catch(error => {
            console.error("Erreur réseau :", error);
        });
});
