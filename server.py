from flask import Flask, jsonify, request, render_template

app = Flask(__name__)

@app.after_request
def add_cors_headers(response):
    response.headers["Access-Control-Allow-Origin"] = "*"
    response.headers["Access-Control-Allow-Methods"] = "GET, POST, DELETE, OPTIONS"
    response.headers["Access-Control-Allow-Headers"] = "Content-Type"
    return response

livres = [
    {"id" : 1, "titre" : "Les Fourmis", "auteur" : "Bernard Werber", "categorie": "Science-Fiction"},
    {"id" : 2, "titre" : "Vingt mille lieues sous les mers", "auteur" : "Jules Verne", "categorie": "Aventure"},
    {"id" : 3, "titre" : "L'Étranger", "auteur" : "Albert Camus", "categorie": "Roman"},
    {"id" : 4, "titre" : "Parisian Gentleman", "auteur" : "Hugo Jacomet", "categorie": "Essai"},
    {"id" : 5, "titre" : "Critique de la raison pure", "auteur" : "Emmanuel Kant", "categorie": "Philosophie"}
]

# GET api/books recupère les données de la liste de livre et le return sous forme de json pour garder le même format

@app.route("/api/books", methods=["GET"])
def get_books():
    return jsonify(livres)

@app.route("/api/books", methods=["POST"])
def add_books():
    titre = request.form.get("titre")
    auteur = request.form.get("auteur")
    categorie = request.form.get("categorie")
    if titre and auteur and categorie:
        new_id = max([livre.get("id", 0) for livre in livres], default=0) + 1 
        livres.append({"id" : new_id, "titre" : titre, "auteur" : auteur, "categorie": categorie})
        return "Good"
    return "Erreur : titre, auteur ou categorie manquant", 400

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/api/books/<int:id>", methods=["DELETE"])
def delete_book(id): 
    global livres # globale pour pouvoir modifier la liste
    if not any(livre.get("id") == id for livre in livres): # any pour vérifier si le livre existe
        return jsonify({"erreur": "Livre non trouvé"}), 404

    livres = [livre for livre in livres if livre.get("id") != id]
    return jsonify({"message" : "Livre supprimé"})

if __name__ == "__main__":
    app.run(debug=True)


