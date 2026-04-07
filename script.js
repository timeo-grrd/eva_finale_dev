let boutonActualiser = document.getElementById("btn-refresh");
let searchInput = document.getElementById("search");
let sortiesCache = [];

function afficherListe(sorties) {
    const liste = document.getElementById("liste");
    liste.innerHTML = "";

    sorties.forEach(sortie => {
        const li = document.createElement("li");
        li.innerHTML = `<strong>Nom :</strong> ${sortie.titre} <br> <strong>Catégorie :</strong> ${sortie.categorie} <br> <strong>Budget :</strong> ${sortie.budget} <br> <strong>Description :</strong> ${sortie.description} <br> <strong>Note :</strong> ${sortie.note} <br>`;

        const btnDelete = document.createElement("button");
        btnDelete.textContent = "Supprimer";

        btnDelete.addEventListener("click", () => {
            if (confirm(`Voulez-vous vraiment supprimer ${sortie.titre} ?`)) {
                fetch(`http://localhost:5000/api/sorties/${sortie.id}`, {
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
    fetch("http://localhost:5000/api/sorties")
        .then(response => response.json())
        .then(data => {
            sortiesCache = data; // stocker la liste complète
            afficherListe(sortiesCache);
        });
});


searchInput.addEventListener("input", () => {
    const recherche = searchInput.value.toLowerCase();
    const filtres = sortiesCache.filter(sortie =>
        (sortie.titre && sortie.titre.toLowerCase().includes(recherche)) ||
        (sortie.categorie && sortie.categorie.toLowerCase().includes(recherche)) ||
        (sortie.budget && sortie.budget.toLowerCase().includes(recherche)) ||
        (sortie.description && sortie.description.toLowerCase().includes(recherche)) ||
        (sortie.note && sortie.note.toLowerCase().includes(recherche))
    );


    afficherListe(filtres);
});

// Gérer la soumission du formulaire d'ajout
const form = document.querySelector("form");
form.addEventListener("submit", (e) => {
    e.preventDefault();

    const formData = new FormData(form);

    fetch("http://localhost:5000/api/sorties", {
        method: "POST",
        body: formData
    })
        .then(response => {
            if (response.ok) {
                alert("Sortie ajoutée !");
                form.reset();
                boutonActualiser.click(); // Recharge la liste
            } else {
                console.error("Erreur lors de l'ajout de la sortie.");
            }
        })
        .catch(error => {
            console.error("Erreur réseau :", error);
        });
});
