import { AdminParameters, CountryConfig, NodePoint } from "../types";

export const factories: NodePoint[] = [
  {
    id: "factory-benguerir",
    name: "Usine Benguerir",
    type: "factory",
    lat: 32.2346,
    lng: -7.9546
  },
  {
    id: "factory-paris",
    name: "Usine Paris",
    type: "factory",
    lat: 48.8566,
    lng: 2.3522
  }
];

export const destinations = [
  "Nigeria",
  "Kenya",
  "Ghana",
  "Côte d’Ivoire",
  "Maroc",
  "Afrique du Sud",
  "Sénégal",
  "Rwanda",
  "Tanzanie",
  "Ouganda",
  "Zambie",
  "Égypte",
  "Cameroun",
  "Brésil",
  "Mexique",
  "États Unis",
  "Emirats Arabes Unis",
  "Arabie saoudite",
  "Qatar",
  "Bahrein",
  "Kuwait",
  "Vietnam",
  "France",
  "Espagne",
  "Italie",
  "Portugal",
  "RoyaumeUni",
  "Allemagne"
];

export const ports: NodePoint[] = [
  {
    id: "port-casablanca",
    name: "Port Casablanca",
    type: "port",
    lat: 33.5731,
    lng: -7.5898
  },
  {
    id: "port-tangier",
    name: "Port Tanger Med",
    type: "port",
    lat: 35.8872,
    lng: -5.3245
  },
  {
    id: "port-lehavre",
    name: "Port Le Havre",
    type: "port",
    lat: 49.4944,
    lng: 0.1079
  },
  {
    id: "port-jebelali",
    name: "Port Jebel Ali",
    type: "port",
    lat: 25.0117,
    lng: 55.0615
  }
];

export const defaultCountryConfigs: CountryConfig[] = [
  {
    country: "Arabie saoudite",
    vatRate: 0.15,
    dutiesByHs: {
      "7309": 0.05,
      "8418": 0.05
    },
    documents: ["SABER", "Certificat d'origine"],
    restrictions: ["ISPM15 sur le bois", "Conformité CE"]
  },
  {
    country: "Emirats Arabes Unis",
    vatRate: 0.05,
    dutiesByHs: {
      "7309": 0.05,
      "8418": 0.05
    },
    documents: ["Certificat d'origine", "Facture commerciale"],
    restrictions: ["Batteries lithium réglementées"]
  },
  {
    country: "Bahrein",
    vatRate: 0.1,
    dutiesByHs: {
      "7309": 0.05
    },
    documents: ["Facture commerciale"],
    restrictions: []
  }
];

export const defaultParameters: AdminParameters = {
  insuranceRate: 0.01,
  roadCostPerKm: 2.2,
  seaCostPerKm: 0.8,
  airCostPerKm: 4.5,
  portDelayDays: 2,
  vatDefault: 0.05,
  dutyDefault: 0.05,
  countries: defaultCountryConfigs
};
