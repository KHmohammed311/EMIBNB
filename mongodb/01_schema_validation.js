// ============================================================
// ÉTAPE 1 — Création de la base de données et des collections
// avec JSON Schema de validation
// Exécuter dans mongosh : load("01_schema_validation.js")
// ============================================================

use("airbnb_clone");

// ─── Collection : users ─────────────────────────────────────
db.createCollection("users", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["name", "email", "passwordHash", "role", "memberSince"],
      additionalProperties: true,
      properties: {
        name:         { bsonType: "string",  description: "Nom complet obligatoire" },
        email:        { bsonType: "string",  pattern: "^.+@.+\\..+$", description: "Email valide obligatoire" },
        passwordHash: { bsonType: "string",  description: "Hash du mot de passe obligatoire" },
        role:         { enum: ["hote", "voyageur"], description: "Rôle : hote ou voyageur" },
        avatar:       { bsonType: "string" },
        languages:    { bsonType: "array", items: { bsonType: "string" } },
        memberSince:  { bsonType: "date" },
        avgRating:    { bsonType: "double", minimum: 0, maximum: 5 }
      }
    }
  },
  validationLevel: "moderate",
  validationAction: "error"
});
print("✓ Collection 'users' créée avec validation");

// ─── Collection : annonces ──────────────────────────────────
db.createCollection("annonces", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["titre", "description", "hoteId", "type", "prixParNuit", "maxVoyageurs", "localisation"],
      properties: {
        titre:          { bsonType: "string",  minLength: 3 },
        description:    { bsonType: "string",  minLength: 10 },
        hoteId:         { bsonType: "objectId" },
        type:           { enum: ["appartement", "maison", "chambre", "villa"] },
        prixParNuit:    { bsonType: "number",  minimum: 1 },
        maxVoyageurs:   { bsonType: "int",     minimum: 1 },
        photos:         { bsonType: "array",   items: { bsonType: "string" } },
        equipements:    { bsonType: "array",   items: { bsonType: "string" } },
        localisation: {
          bsonType: "object",
          required: ["ville", "pays"],
          properties: {
            ville:       { bsonType: "string" },
            pays:        { bsonType: "string" },
            coordonnees: { bsonType: "array", items: { bsonType: "double" }, minItems: 2, maxItems: 2 }
          }
        },
        caracteristiques: {
          bsonType: "object",
          properties: {
            piscine:       { bsonType: "bool" },
            parking:       { bsonType: "bool" },
            wifi:          { bsonType: "bool" },
            climatisation: { bsonType: "bool" },
            cuisine:       { bsonType: "bool" },
            animaux:       { bsonType: "bool" },
            jacuzzi:       { bsonType: "bool" }
          }
        },
        politiqueAnnulation: {
          bsonType: "object",
          properties: {
            type:               { enum: ["flexible", "moderee", "stricte"] },
            delaiRemboursement: { bsonType: "int", minimum: 0 }
          }
        },
        noteMoyenne: { bsonType: "double", minimum: 0, maximum: 5 },
        nbAvis:      { bsonType: "int",    minimum: 0 },
        topAvis: {
          bsonType: "array",
          maxItems: 3,
          items: {
            bsonType: "object",
            required: ["auteurId", "auteurNom", "note", "commentaire", "createdAt"],
            properties: {
              auteurId:    { bsonType: "objectId" },
              auteurNom:   { bsonType: "string" },
              note:        { bsonType: "int", minimum: 1, maximum: 5 },
              commentaire: { bsonType: "string" },
              createdAt:   { bsonType: "date" }
            }
          }
        }
      }
    }
  },
  validationLevel: "moderate",
  validationAction: "error"
});
print("✓ Collection 'annonces' créée avec validation");

// ─── Collection : reservations ──────────────────────────────
db.createCollection("reservations", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["annonceId", "voyageurId", "dateArrivee", "dateDepart", "prixTotal", "statut", "nbVoyageurs", "createdAt"],
      properties: {
        annonceId:       { bsonType: "objectId" },
        voyageurId:      { bsonType: "objectId" },
        dateArrivee:     { bsonType: "date" },
        dateDepart:      { bsonType: "date" },
        prixTotal:       { bsonType: "number", minimum: 0 },
        statut:          { enum: ["en_attente", "confirmee", "annulee", "terminee"] },
        nbVoyageurs:     { bsonType: "int",    minimum: 1 },
        fraisAnnulation: { bsonType: "number", minimum: 0 },
        createdAt:       { bsonType: "date" }
      }
    }
  },
  validationLevel: "moderate",
  validationAction: "error"
});
print("✓ Collection 'reservations' créée avec validation");

// ─── Collection : avis ──────────────────────────────────────
db.createCollection("avis", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["cibleId", "cibleType", "auteurId", "reservationId", "note", "commentaire", "createdAt"],
      properties: {
        cibleId:       { bsonType: "objectId" },
        cibleType:     { enum: ["annonce", "activite"] },
        auteurId:      { bsonType: "objectId" },
        reservationId: { bsonType: "objectId" },
        note:          { bsonType: "int", minimum: 1, maximum: 5 },
        commentaire:   { bsonType: "string", minLength: 5 },
        createdAt:     { bsonType: "date" }
      }
    }
  },
  validationLevel: "moderate",
  validationAction: "error"
});
print("✓ Collection 'avis' créée avec validation");

// ─── Collection : activites ─────────────────────────────────
db.createCollection("activites", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["titre", "hoteId", "ville", "prix", "duree", "maxParticipants", "categorie"],
      properties: {
        titre:           { bsonType: "string", minLength: 3 },
        hoteId:          { bsonType: "objectId" },
        ville:           { bsonType: "string" },
        prix:            { bsonType: "number", minimum: 0 },
        duree:           { bsonType: "int",    minimum: 1 },
        maxParticipants: { bsonType: "int",    minimum: 1 },
        categorie:       { bsonType: "string" },
        photos:          { bsonType: "array",  items: { bsonType: "string" } },
        noteMoyenne:     { bsonType: "double", minimum: 0, maximum: 5 }
      }
    }
  },
  validationLevel: "moderate",
  validationAction: "error"
});
print("✓ Collection 'activites' créée avec validation");

// ─── Collection : activite_reservations ────────────────────
db.createCollection("activite_reservations", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["activiteId", "voyageurId", "date", "nbParticipants", "prixTotal", "statut"],
      properties: {
        activiteId:     { bsonType: "objectId" },
        voyageurId:     { bsonType: "objectId" },
        date:           { bsonType: "date" },
        nbParticipants: { bsonType: "int",    minimum: 1 },
        prixTotal:      { bsonType: "number", minimum: 0 },
        statut:         { enum: ["en_attente", "confirmee", "annulee"] }
      }
    }
  },
  validationLevel: "moderate",
  validationAction: "error"
});
print("✓ Collection 'activite_reservations' créée avec validation");

// ─── Index utiles ───────────────────────────────────────────
db.users.createIndex({ email: 1 }, { unique: true });
db.annonces.createIndex({ "localisation.ville": 1, prixParNuit: 1 });
db.annonces.createIndex({ noteMoyenne: -1 });
db.annonces.createIndex({ hoteId: 1 });
db.reservations.createIndex({ annonceId: 1, dateArrivee: 1, dateDepart: 1 });
db.reservations.createIndex({ voyageurId: 1 });
db.avis.createIndex({ cibleId: 1, cibleType: 1 });
db.avis.createIndex({ auteurId: 1 });
db.activites.createIndex({ ville: 1, categorie: 1 });

print("\n✓ Tous les index créés");
print("✓ Base de données airbnb_clone initialisée avec succès");
