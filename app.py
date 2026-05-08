from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
from services.generator import generate_document
from utils.pdf_generator import create_pdf
from database.db import create_table
from models.user_model import create_user, login_user
from models.document_model import save_document

app = Flask(__name__)
CORS(app)

create_table()

@app.route("/")
def home():
    return "DocuForge Running 🚀"

# ---------------- AUTH ----------------

@app.route("/signup", methods=["POST"])
def signup():
    data = request.json
    if create_user(data["username"], data["password"]):
        return jsonify({"message": "User created"})
    return jsonify({"error": "User exists"}), 400


@app.route("/login", methods=["POST"])
def login():
    data = request.json
    user_id = login_user(data["username"], data["password"])

    if user_id:
        return jsonify({"user_id": user_id})
    return jsonify({"error": "Invalid credentials"}), 401


# ---------------- GENERATE ----------------

@app.route("/generate", methods=["POST"])
def generate():
    data = request.json
    user_id = data.get("user_id")

    if not user_id:
        return jsonify({"error": "Unauthorized"}), 401

    document = generate_document(data)
    save_document(user_id, data, document)

    pdf_file = create_pdf(document, data)

    return jsonify({
        "generated_document": document,
        "pdf_file": pdf_file
    })


@app.route("/download/<filename>")
def download_file(filename):
    return send_file(filename, as_attachment=True)


if __name__ == "__main__":
    app.run(debug=True)