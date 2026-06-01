// ============================================================
// ÉTAPE 4 — Neo4j : Recommandations de logements
// Exécuter dans Neo4j Browser ou cypher-shell
// ============================================================

// ─── Nettoyage (développement seulement) ────────────────────
MATCH (n) DETACH DELETE n;

// ════════════════════════════════════════════════════════════
// 1. CRÉATION DES NŒUDS : Caractéristiques
// ════════════════════════════════════════════════════════════
CREATE (:Caracteristique { nom: 'piscine' });
CREATE (:Caracteristique { nom: 'parking' });
CREATE (:Caracteristique { nom: 'wifi' });
CREATE (:Caracteristique { nom: 'climatisation' });
CREATE (:Caracteristique { nom: 'cuisine' });
CREATE (:Caracteristique { nom: 'animaux' });
CREATE (:Caracteristique { nom: 'jacuzzi' });

// ════════════════════════════════════════════════════════════
// 2. CRÉATION DES NŒUDS : Voyageurs
// ════════════════════════════════════════════════════════════
CREATE (:Voyageur {
  userId: '665f000000000000000000a3',
  nom: 'Mehdi Bouchaib',
  ville: 'Casablanca',
  budget: 600
});
CREATE (:Voyageur {
  userId: '665f000000000000000000a4',
  nom: 'Sofia Cherkaoui',
  ville: 'Rabat',
  budget: 1000
});
CREATE (:Voyageur {
  userId: '665f000000000000000000a5',
  nom: 'Karim Idrissi',
  ville: 'Marrakech',
  budget: 3000
});

// ════════════════════════════════════════════════════════════
// 3. CRÉATION DES NŒUDS : Logements (miroir de MongoDB annonces)
// ════════════════════════════════════════════════════════════
CREATE (:Logement {
  annonceId: '665f000000000000000000b1',
  ville: 'Casablanca',
  prixParNuit: 450,
  piscine: false, parking: true, wifi: true,
  climatisation: true, cuisine: true, animaux: false, jacuzzi: false
});
CREATE (:Logement {
  annonceId: '665f000000000000000000b2',
  ville: 'Marrakech',
  prixParNuit: 850,
  piscine: true, parking: false, wifi: true,
  climatisation: true, cuisine: true, animaux: false, jacuzzi: true
});
CREATE (:Logement {
  annonceId: '665f000000000000000000b3',
  ville: 'Marrakech',
  prixParNuit: 2200,
  piscine: true, parking: true, wifi: true,
  climatisation: true, cuisine: true, animaux: true, jacuzzi: true
});
CREATE (:Logement {
  annonceId: '665f000000000000000000b4',
  ville: 'Rabat',
  prixParNuit: 320,
  piscine: false, parking: false, wifi: true,
  climatisation: true, cuisine: true, animaux: false, jacuzzi: false
});
CREATE (:Logement {
  annonceId: '665f000000000000000000b5',
  ville: 'Fès',
  prixParNuit: 650,
  piscine: false, parking: false, wifi: true,
  climatisation: false, cuisine: true, animaux: false, jacuzzi: false
});
CREATE (:Logement {
  annonceId: '665f000000000000000000b6',
  ville: 'Marrakech',
  prixParNuit: 180,
  piscine: false, parking: false, wifi: true,
  climatisation: true, cuisine: false, animaux: false, jacuzzi: false
});
CREATE (:Logement {
  annonceId: '665f000000000000000000b7',
  ville: 'Casablanca',
  prixParNuit: 280,
  piscine: false, parking: true, wifi: true,
  climatisation: true, cuisine: true, animaux: false, jacuzzi: false
});
CREATE (:Logement {
  annonceId: '665f000000000000000000b8',
  ville: 'Mohammedia',
  prixParNuit: 3500,
  piscine: true, parking: true, wifi: true,
  climatisation: true, cuisine: true, animaux: true, jacuzzi: true
});

// ════════════════════════════════════════════════════════════
// 4. RELATIONS : (Logement)-[:POSSEDE]->(Caracteristique)
// ════════════════════════════════════════════════════════════
MATCH (l:Logement), (c:Caracteristique)
WHERE
  (l.annonceId = '665f000000000000000000b1' AND c.nom IN ['parking','wifi','climatisation','cuisine'])
  OR (l.annonceId = '665f000000000000000000b2' AND c.nom IN ['piscine','wifi','climatisation','cuisine','jacuzzi'])
  OR (l.annonceId = '665f000000000000000000b3' AND c.nom IN ['piscine','parking','wifi','climatisation','cuisine','animaux','jacuzzi'])
  OR (l.annonceId = '665f000000000000000000b4' AND c.nom IN ['wifi','climatisation','cuisine'])
  OR (l.annonceId = '665f000000000000000000b5' AND c.nom IN ['wifi','cuisine'])
  OR (l.annonceId = '665f000000000000000000b6' AND c.nom IN ['wifi','climatisation'])
  OR (l.annonceId = '665f000000000000000000b7' AND c.nom IN ['parking','wifi','climatisation','cuisine'])
  OR (l.annonceId = '665f000000000000000000b8' AND c.nom IN ['piscine','parking','wifi','climatisation','cuisine','animaux','jacuzzi'])
CREATE (l)-[:POSSEDE]->(c);

// ════════════════════════════════════════════════════════════
// 5. RELATIONS : (Voyageur)-[:PREFERE]->(Caracteristique)
// Poids de 1 (faible) à 5 (forte préférence)
// ════════════════════════════════════════════════════════════

// Mehdi : préfère WiFi, climatisation, cuisine
MATCH (v:Voyageur { userId: '665f000000000000000000a3' }), (c:Caracteristique)
WHERE c.nom IN ['wifi','climatisation','cuisine','parking']
CREATE (v)-[:PREFERE { poids: CASE c.nom
  WHEN 'wifi' THEN 5
  WHEN 'climatisation' THEN 4
  WHEN 'cuisine' THEN 4
  WHEN 'parking' THEN 2
  ELSE 1 END }]->(c);

// Sofia : préfère piscine, jacuzzi, WiFi, cuisine
MATCH (v:Voyageur { userId: '665f000000000000000000a4' }), (c:Caracteristique)
WHERE c.nom IN ['piscine','jacuzzi','wifi','cuisine','climatisation']
CREATE (v)-[:PREFERE { poids: CASE c.nom
  WHEN 'piscine' THEN 5
  WHEN 'jacuzzi' THEN 5
  WHEN 'wifi' THEN 4
  WHEN 'cuisine' THEN 3
  WHEN 'climatisation' THEN 2
  ELSE 1 END }]->(c);

// Karim : préfère tout (voyageur premium)
MATCH (v:Voyageur { userId: '665f000000000000000000a5' }), (c:Caracteristique)
WHERE c.nom IN ['piscine','jacuzzi','parking','animaux','wifi','cuisine']
CREATE (v)-[:PREFERE { poids: CASE c.nom
  WHEN 'piscine' THEN 5
  WHEN 'jacuzzi' THEN 4
  WHEN 'parking' THEN 4
  WHEN 'animaux' THEN 5
  WHEN 'wifi' THEN 3
  WHEN 'cuisine' THEN 3
  ELSE 1 END }]->(c);

// ════════════════════════════════════════════════════════════
// 6. RELATIONS : (Voyageur)-[:A_SEJOURNE]->(Logement)
// ════════════════════════════════════════════════════════════
MATCH (v:Voyageur { userId: '665f000000000000000000a3' }),
      (l:Logement { annonceId: '665f000000000000000000b1' })
CREATE (v)-[:A_SEJOURNE { note: 5 }]->(l);

MATCH (v:Voyageur { userId: '665f000000000000000000a4' }),
      (l:Logement { annonceId: '665f000000000000000000b2' })
CREATE (v)-[:A_SEJOURNE { note: 5 }]->(l);

MATCH (v:Voyageur { userId: '665f000000000000000000a5' }),
      (l:Logement { annonceId: '665f000000000000000000b3' })
CREATE (v)-[:A_SEJOURNE { note: 5 }]->(l);

MATCH (v:Voyageur { userId: '665f000000000000000000a3' }),
      (l:Logement { annonceId: '665f000000000000000000b4' })
CREATE (v)-[:A_SEJOURNE { note: 4 }]->(l);

MATCH (v:Voyageur { userId: '665f000000000000000000a4' }),
      (l:Logement { annonceId: '665f000000000000000000b5' })
CREATE (v)-[:A_SEJOURNE { note: 5 }]->(l);

// Vérification
MATCH (n) RETURN labels(n) AS type, count(n) AS total;
