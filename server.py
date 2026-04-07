from flask import Flask, jsonify, request, render_template

app = Flask(__name__)

@app.after_request
def add_cors_headers(response):
    response.headers["Access-Control-Allow-Origin"] = "*"
    response.headers["Access-Control-Allow-Methods"] = "GET, POST, DELETE, OPTIONS"
    response.headers["Access-Control-Allow-Headers"] = "Content-Type"
    return response

sorties = [
    {"id": 1, "titre": "Soirée cinéma entre amis", "categorie": "cinéma", "budget": 10, "description": "Regarder un film récent ou culte avec des amis dans une ambiance conviviale.", "note": 4},
    {"id": 2, "titre": "Balade au parc", "categorie": "nature", "budget": 0, "description": "Profiter d'une promenade relaxante dans un parc ou jardin public.", "note": 5},
    {"id": 3, "titre": "Match de foot amateur", "categorie": "sport", "budget": 5, "description": "Jouer ou regarder un match de football entre étudiants.", "note": 4},
    {"id": 4, "titre": "Dîner street food", "categorie": "food", "budget": 15, "description": "Découvrir différents stands de street food pour un repas varié.", "note": 5},
    {"id": 5, "titre": "Visite de musée gratuit", "categorie": "culture", "budget": 0, "description": "Explorer un musée lors d'une journée gratuite ou à tarif réduit.", "note": 4},
    {"id": 6, "titre": "Soirée jeux de société", "categorie": "jeu", "budget": 5, "description": "Partager un moment ludique autour de jeux de société classiques ou modernes.", "note": 5},
    {"id": 7, "titre": "Randonnée en groupe", "categorie": "nature", "budget": 5, "description": "Partir en randonnée avec des amis pour découvrir de nouveaux paysages.", "note": 5},
    {"id": 8, "titre": "Concert local", "categorie": "culture", "budget": 20, "description": "Assister à un concert d'artistes locaux dans une petite salle.", "note": 4}
]

# GET api/books recupère les données de la liste de livre et le return sous forme de json pour garder le même format

@app.route("/api/sorties", methods=["GET"])
def get_sorties():
    return jsonify(sorties)

@app.route("/api/sorties", methods=["POST"])
def add_sorties():
    titre = request.form.get("titre")
    categorie = request.form.get("categorie")
    budget = request.form.get("budget")
    description = request.form.get("description")
    note = request.form.get("note")
    if titre and categorie and budget and description and note:
        new_id = max([sortie.get("id", 0) for sortie in sorties], default=0) + 1 
        sorties.append({"id" : new_id, "titre" : titre, "categorie": categorie, "budget": budget, "description": description, "note": note})
        return "Good"
    return "Erreur : titre, categorie, budget, description ou note manquant", 400

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/api/sorties/<int:id>", methods=["DELETE"])
def delete_book(id): 
    global sorties # globale pour pouvoir modifier la liste
    if not any(sortie.get("id") == id for sortie in sorties): # any pour vérifier si le livre existe
        return jsonify({"erreur": "Sortie non trouvée"}), 404

    sorties = [sortie for sortie in sorties if sortie.get("id") != id]
    return jsonify({"message" : "Sortie supprimée"})

if __name__ == "__main__":
    app.run(debug=True)


