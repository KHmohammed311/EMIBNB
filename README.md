# EMIBNB — Clone AirBnB Maroc

Projet réalisé dans le cadre du cours Bases de données NoSQL (S4). L'idée c'était de reproduire les fonctionnalités principales d'AirBnB mais adapté au contexte marocain, en utilisant plusieurs types de bases de données.

**Stack :** MongoDB · Spring Boot · Angular · Neo4j · Docker

---

## Lancement rapide (Docker)

La façon la plus simple de tout lancer d'un coup :

```bash
# Cloner le repo
git clone https://github.com/KHmohammed311/EMIBNB.git
cd EMIBNB

# Mettre son token ngrok dans .env
# (créer un compte gratuit sur https://ngrok.com pour avoir un token)
echo "NGROK_AUTHTOKEN=ton_token_ici" > .env

# Lancer tout
docker compose -f docker-compose.full.yml up --build -d
```

Ça démarre MongoDB, Neo4j, le backend, le frontend et un tunnel ngrok en une seule commande. Le premier lancement prend environ 5-10 min le temps de build les images.

Une fois lancé :
- Site en local : http://localhost
- URL publique (partage avec des amis) : http://localhost:4040 → onglet "Tunnels"
- Interface Neo4j : http://localhost:7474

Pour arrêter : `docker compose -f docker-compose.full.yml down`

---

## Comptes de test

L'auth est simulée côté frontend. Les comptes disponibles :

| Login | Mot de passe | Nom |
|-------|-------------|-----|
| admin | admin | Utilisateur 1 |
| khelifi | khelifi | Mohamed |
| mantrach | mantrach | Hamza |
| gharbi | gharbi | Anas |

---

## Lancement sans Docker (développement)

Si tu veux lancer les parties séparément :

**MongoDB** (doit tourner sur le port 27017)
```bash
cd mongodb
mongosh < 01_schema_validation.js
mongosh < 02_insert_data.js
```

**Neo4j** (port 7687, mot de passe : `password`)
```bash
docker run -d --name neo4j -p 7474:7474 -p 7687:7687 \
  -e NEO4J_AUTH=neo4j/password neo4j:5
# Puis coller le contenu de neo4j/01_setup_neo4j.cypher dans le browser Neo4j
```

**Backend**
```bash
cd backend
mvn spring-boot:run
# Démarre sur http://localhost:8080
```

**Frontend**
```bash
cd frontend
npm install
ng serve
# Démarre sur http://localhost:4200
```

---

## Ce qui est implémenté

**MongoDB**
- 6 collections : users, annonces, reservations, avis, activites, activite_reservations
- Computed Pattern : la note moyenne et le nombre d'avis se mettent à jour automatiquement à chaque avis ajouté ou supprimé
- Subset Pattern : les 3 meilleurs avis sont stockés directement dans l'annonce pour éviter des requêtes supplémentaires
- Vérification de disponibilité avant toute réservation (conflit de dates → HTTP 409)

**Neo4j**
- Graphe de préférences voyageur ↔ caractéristiques de logement
- Recommandations basées sur les séjours passés et les préférences déclarées
- Endpoint `/api/recommandations/{userId}`

**Frontend Angular**
- Page d'accueil avec recherche et filtres (ville, type, prix, voyageurs)
- Détail d'une annonce avec avis et formulaire de réservation
- Dashboard hôte pour créer et gérer ses annonces
- Section activités touristiques

---

## Structure du projet

```
EMIBNB/
├── backend/          → API REST Spring Boot (Java 21)
├── frontend/         → Application Angular 17
├── mongodb/          → Scripts d'initialisation MongoDB
├── neo4j/            → Scripts Cypher Neo4j
├── docker/           → Configs pour réplication et sharding
└── docker-compose.full.yml  → Déploiement complet en une commande
```

---

## Réplication et Sharding

Des configs Docker sont disponibles dans le dossier `docker/` pour tester MongoDB en replica set (3 nœuds) ou en cluster shardé (3 shards).

```bash
# Replica set
docker compose -f docker/docker-compose-replicaset.yml up -d
mongosh --port 27017 --eval "rs.status()"

# Cluster shardé
docker compose -f docker/docker-compose-sharding.yml up -d
mongosh --port 27017 --eval "sh.status()"
```

La shard key choisie sur la collection `annonces` est `{ "localisation.ville": 1 }`, ce qui permet de distribuer les données par ville.
