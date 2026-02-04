# Simulateur logistique export (BMTA&C)

## Lancement

```bash
npm install
npm run dev
```

Puis ouvrir `http://localhost:3000`.

## Structure des fichiers

```
app/
  admin/                 # Admin Panel pour les paramètres
  api/searates/          # Proxy SeaRates (serveur)
  components/            # Composants UI (carte)
lib/
  costing/               # Calculs de coûts et segments
  customs/               # CIF, droits, TVA
  data/                  # Seeds et stockage local
  graph/                 # Graphe + génération scénarios
  packaging/             # PackagingEngine
  searates/              # Client SeaRates côté serveur
  types/                 # Types TypeScript
public/
  geo/                   # GeoJSON frontières
  images/                # Logo
```

## Exemples de données seed

- Pays et destinations : `lib/data/destinations.ts`
- Ports et usines : `lib/data/seed.ts`
- Paramètres admin par défaut : `lib/data/seed.ts`
- Exemple de droits KSA (France/Maroc) : `public/data/ksa-customs-sample.json`

Ces seeds sont utilisés lorsque l'API SeaRates est indisponible.

## Variables d’environnement

```
SEARATES_API_KEY=...
```

La clé n’est jamais exposée côté client.
