"use client";

import dynamic from "next/dynamic";
import { useEffect, useMemo, useState } from "react";
import { factories, ports } from "../lib/data/seed";
import { destinationPoints } from "../lib/data/destinations";
import { loadAdminParameters } from "../lib/data/storage";
import { generateScenarios } from "../lib/graph/scenarios";
import { calculateCif, resolveCustomsRates } from "../lib/customs/calc";
import { packagingEngine } from "../lib/packaging/engine";
import { AdminParameters, NodePoint } from "../lib/types";

const MapView = dynamic(() => import("./components/MapView"), { ssr: false });

const criteria = [
  { id: "cost", label: "Meilleur coût" },
  { id: "time", label: "Meilleur délai" },
  { id: "risk", label: "Meilleure sécurité" },
  { id: "regulatory", label: "Simplicité réglementaire" }
];

export default function HomePage() {
  const [originId, setOriginId] = useState(factories[0].id);
  const [destinationId, setDestinationId] = useState(destinationPoints[0].id);
  const [units, setUnits] = useState(4);
  const [city, setCity] = useState("");
  const [criterion, setCriterion] = useState(criteria[0].id);
  const [params, setParams] = useState<AdminParameters>(() => loadAdminParameters());
  const [waypoint, setWaypoint] = useState<NodePoint | null>(null);
  const [selectedScenarioId, setSelectedScenarioId] = useState<string>("road");

  const origin = factories.find((factory) => factory.id === originId) ?? factories[0];
  const destination = destinationPoints.find((dest) => dest.id === destinationId) ?? destinationPoints[0];

  const scenarios = useMemo(() => {
    return generateScenarios({
      origin,
      destination,
      ports,
      params,
      waypoint
    });
  }, [origin, destination, params, waypoint]);

  const selectedScenario =
    scenarios.find((scenario) => scenario.id === selectedScenarioId) ?? scenarios[0];

  const bestScenario = useMemo(() => {
    const sorted = [...scenarios].sort((a, b) => {
      switch (criterion) {
        case "time":
          return a.totalDurationDays - b.totalDurationDays;
        case "risk":
          return a.riskScore - b.riskScore;
        case "regulatory":
          return a.regulatoryScore - b.regulatoryScore;
        default:
          return a.totalCost - b.totalCost;
      }
    });

    return sorted[0];
  }, [scenarios, criterion]);

  const customsRates = resolveCustomsRates(params, destination.name, "7309");
  const cif = calculateCif({
    productValue: units * 25000,
    freightCost: bestScenario.totalCost,
    insuranceRate: params.insuranceRate,
    dutyRate: customsRates.dutyRate,
    vatRate: customsRates.vatRate
  });

  const packaging = packagingEngine(units);

  const sensitivity = [
    { label: "Coût route/km", delta: params.roadCostPerKm * 0.1 },
    { label: "Coût mer", delta: params.seaCostPerKm * 0.1 },
    { label: "Délais port", delta: params.portDelayDays * 0.1 },
    { label: "VAT", delta: params.vatDefault * 0.1 },
    { label: "Droits", delta: params.dutyDefault * 0.1 },
    { label: "Assurance", delta: params.insuranceRate * 0.1 }
  ].sort((a, b) => b.delta - a.delta);

  const handleExport = (format: "json" | "csv") => {
    const payload = {
      origin: origin.name,
      destination: destination.name,
      city,
      units,
      criterion,
      scenario: bestScenario
    };

    if (format === "json") {
      const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
      triggerDownload(blob, "scenario.json");
      return;
    }

    const csv = `origin,destination,units,criterion,totalCost,totalDuration\n${origin.name},${destination.name},${units},${criterion},${bestScenario.totalCost},${bestScenario.totalDurationDays}`;
    const blob = new Blob([csv], { type: "text/csv" });
    triggerDownload(blob, "scenario.csv");
  };

  const handleWaypointAdd = (point: NodePoint) => {
    setWaypoint(point);
  };

  useEffect(() => {
    if (scenarios.length > 0 && !scenarios.find((scenario) => scenario.id === selectedScenarioId)) {
      setSelectedScenarioId(scenarios[0].id);
    }
  }, [scenarios, selectedScenarioId]);

  return (
    <div>
      <header>
        <img src="/images/bmta-logo.svg" alt="BMTA&C" width={120} height={36} />
        <h1>Simulateur logistique export</h1>
      </header>
      <div className="main-layout">
        <aside className="sidebar">
          <div className="section">
            <h3>Entrées</h3>
            <label>Origine</label>
            <select value={originId} onChange={(event) => setOriginId(event.target.value)}>
              {factories.map((factory) => (
                <option key={factory.id} value={factory.id}>
                  {factory.name}
                </option>
              ))}
            </select>
            <label>Destination (pays)</label>
            <select
              value={destinationId}
              onChange={(event) => setDestinationId(event.target.value)}
            >
              {destinationPoints.map((dest) => (
                <option key={dest.id} value={dest.id}>
                  {dest.name}
                </option>
              ))}
            </select>
            <label>Ville (option)</label>
            <input value={city} onChange={(event) => setCity(event.target.value)} placeholder="Ville" />
            <label>Nombre d'unités</label>
            <input
              type="number"
              min={2}
              max={50}
              value={units}
              onChange={(event) => setUnits(Number(event.target.value))}
            />
            <label>Critère</label>
            <select value={criterion} onChange={(event) => setCriterion(event.target.value)}>
              {criteria.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.label}
                </option>
              ))}
            </select>
          </div>

          <div className="section">
            <h3>Meilleur scénario</h3>
            <div className="scenario-card selected">
              <strong>{bestScenario.name}</strong>
              <p>Coût total: {bestScenario.totalCost.toLocaleString()} €</p>
              <p>Délai: {bestScenario.totalDurationDays} jours</p>
              <p>Risque: {bestScenario.riskScore}</p>
              <p>Simplicité: {bestScenario.regulatoryScore}</p>
              <p>{bestScenario.explanation}</p>
            </div>
          </div>

          <div className="section">
            <h3>Scénarios</h3>
            {scenarios.map((scenario) => (
              <div
                key={scenario.id}
                className={`scenario-card ${selectedScenario.id === scenario.id ? "selected" : ""}`}
                onClick={() => setSelectedScenarioId(scenario.id)}
                role="button"
                tabIndex={0}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    setSelectedScenarioId(scenario.id);
                  }
                }}
              >
                <div>
                  <span className="badge">{scenario.name}</span>
                  <div>
                    {scenario.segments.map((segment) => (
                      <span key={segment.id} className="segment-pill">
                        {segment.mode}
                      </span>
                    ))}
                  </div>
                </div>
                <p>Coût: {scenario.totalCost.toLocaleString()} €</p>
                <p>Délai: {scenario.totalDurationDays} jours</p>
              </div>
            ))}
          </div>

          <div className="section">
            <h3>Détail scénario</h3>
            {selectedScenario.segments.map((segment) => (
              <p key={segment.id}>
                {segment.mode} {segment.from.name} → {segment.to.name} · {segment.distanceKm.toFixed(0)} km ·{" "}
                {segment.durationDays} j
              </p>
            ))}
          </div>

          <div className="section">
            <h3>Packaging & conteneurs</h3>
            <p>Colis: {packaging.packages}</p>
            <p>CBM total: {packaging.totalCbm}</p>
            <p>Poids: {packaging.totalWeightKg} kg</p>
            <p>
              Reco: {packaging.recommendedContainers.count} × {packaging.recommendedContainers.type}
            </p>
            <p>{packaging.recommendedContainers.justification}</p>
          </div>

          <div className="section">
            <h3>Douanes & taxes</h3>
            <p>Droits: {(customsRates.dutyRate * 100).toFixed(1)}%</p>
            <p>TVA: {(customsRates.vatRate * 100).toFixed(1)}%</p>
            <p>Documents: {customsRates.documents.join(", ") || "N/A"}</p>
            <p>Restrictions: {customsRates.restrictions.join(", ") || "N/A"}</p>
            <p>CIF: {cif.cifValue.toFixed(0)} €</p>
            <p>Total rendu: {cif.totalLandedCost.toFixed(0)} €</p>
          </div>

          <div className="section">
            <h3>Étude de sensibilité</h3>
            <ul className="tornado-list">
              {sensitivity.map((item) => (
                <li key={item.label}>
                  <span>{item.label}</span>
                  <span>±{item.delta.toFixed(2)}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="section">
            <h3>Export</h3>
            <button onClick={() => handleExport("json")}>Exporter JSON</button>
            <button className="secondary" onClick={() => handleExport("csv")}>
              Exporter CSV
            </button>
          </div>

          <div className="section">
            <button
              className="secondary"
              onClick={() => {
                setParams(loadAdminParameters());
              }}
            >
              Recharger paramètres admin
            </button>
          </div>
        </aside>
        <main>
          <MapView
            nodes={[origin, destination, ...ports, ...(waypoint ? [waypoint] : [])]}
            scenarios={scenarios}
            selectedScenarioId={selectedScenario.id}
            onWaypointAdd={handleWaypointAdd}
          />
        </main>
      </div>
    </div>
  );
}

function triggerDownload(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}
