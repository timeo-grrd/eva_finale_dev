let boutonActualiser = document.getElementById("btn-refresh");
let searchInput = document.getElementById("search");
let categorieFiltre = document.getElementById("categorie_filtre");
let prixFiltre = document.getElementById("prix_filtre");
let noteFiltre = document.getElementById("note_filtre");
let boutonTriPrix = document.getElementById("btn-sort-prix");
let sortiesCache = [];
let triPrixCroissant = true;

function updateSortButtonLabel() {
    if (!boutonTriPrix) return;
    boutonTriPrix.textContent = triPrixCroissant ? "Tri prix: croissant" : "Tri prix: décroissant";
}

function afficherListe(sorties) {
    const liste = document.getElementById("liste");
    liste.innerHTML = "";

    if (!sorties || sorties.length === 0) {
        const li = document.createElement("li");
        li.textContent = "Aucune activité disponible";
        li.className = "empty-state";
        liste.appendChild(li);
        return;
    }

    sorties.forEach(sortie => {
        const li = document.createElement("li");
        li.innerHTML = `<strong>Nom :</strong> ${sortie.titre} <br> <strong>Catégorie :</strong> ${sortie.categorie} <br> <strong>Budget :</strong> ${sortie.budget} € <br> <strong>Description :</strong> ${sortie.description} <br> <strong>Note :</strong> ${sortie.note}/5 <br>`;

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
                        boutonActualiser.click();
                    });
            }
        });

        li.appendChild(btnDelete);
        liste.appendChild(li);
    });
}

function applyFilters() {
    const recherche = searchInput.value.toLowerCase().trim();
    const catVal = categorieFiltre ? categorieFiltre.value : "categorie";
    const prixVal = prixFiltre ? prixFiltre.value : "prix";
    const noteVal = noteFiltre ? noteFiltre.value : "note";

    const filtres = sortiesCache.filter(sortie => {
        // Filtre texte
        if (recherche) {
            const match =
                (sortie.titre && sortie.titre.toLowerCase().includes(recherche)) ||
                (sortie.categorie && sortie.categorie.toLowerCase().includes(recherche)) ||
                (sortie.budget !== undefined && String(sortie.budget).includes(recherche)) ||
                (sortie.description && sortie.description.toLowerCase().includes(recherche)) ||
                (sortie.note !== undefined && String(sortie.note).includes(recherche));
            if (!match) return false;
        }

        // Filtre catégorie (insensible à la casse)
        if (catVal && catVal !== "categorie") {
            if (!sortie.categorie || sortie.categorie.toLowerCase() !== catVal.toLowerCase()) return false;
        }

        // Filtre prix
        if (prixVal && prixVal !== "prix") {
            const budget = parseFloat(sortie.budget);
            if (prixVal === "0-10" && !(budget >= 0 && budget <= 10)) return false;
            if (prixVal === "10-20" && !(budget > 10 && budget <= 20)) return false;
            if (prixVal === "20+" && !(budget > 20)) return false;
        }

        // Filtre note (robuste : note peut être string ou number)
        if (noteVal && noteVal !== "note") {
            const note = parseFloat(sortie.note);
            if (isNaN(note)) return false;
            if (noteVal === "0-2" && !(note >= 0 && note <= 2)) return false;
            if (noteVal === "2-4" && !(note > 2 && note <= 4)) return false;
            if (noteVal === "4-5" && !(note > 4 && note <= 5)) return false;
        }

        return true;
    });

    filtres.sort((a, b) => {
        const budgetA = parseFloat(a.budget) || 0;
        const budgetB = parseFloat(b.budget) || 0;
        return triPrixCroissant ? budgetA - budgetB : budgetB - budgetA;
    });

    afficherListe(filtres);
}

boutonActualiser.addEventListener("click", () => {
    fetch("http://localhost:5000/api/sorties")
        .then(response => response.json())
        .then(data => {
            sortiesCache = data;
            applyFilters();
        });
});

// Brancher tous les filtres sur la même fonction
searchInput.addEventListener("input", applyFilters);
if (categorieFiltre) categorieFiltre.addEventListener("change", applyFilters);
if (prixFiltre) prixFiltre.addEventListener("change", applyFilters);
if (noteFiltre) noteFiltre.addEventListener("change", applyFilters);
if (boutonTriPrix) {
    boutonTriPrix.addEventListener("click", () => {
        triPrixCroissant = !triPrixCroissant;
        updateSortButtonLabel();
        applyFilters();
    });
}

updateSortButtonLabel();

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
                boutonActualiser.click();
            } else {
                console.error("Erreur lors de l'ajout de la sortie.");
            }
        })
        .catch(error => {
            console.error("Erreur réseau :", error);
        });

});

