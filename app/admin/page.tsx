"use client";

import { useState } from "react";
import { defaultParameters } from "../../lib/data/seed";
import { loadAdminParameters, saveAdminParameters } from "../../lib/data/storage";
import { AdminParameters, CountryConfig } from "../../lib/types";

export default function AdminPage() {
  const [params, setParams] = useState<AdminParameters>(() => loadAdminParameters());

  const updateField = (field: keyof AdminParameters, value: number) => {
    setParams((prev) => ({ ...prev, [field]: value }));
  };

  const updateCountry = (index: number, updates: Partial<CountryConfig>) => {
    setParams((prev) => {
      const updated = [...prev.countries];
      updated[index] = { ...updated[index], ...updates };
      return { ...prev, countries: updated };
    });
  };

  const addCountry = () => {
    setParams((prev) => ({
      ...prev,
      countries: [
        ...prev.countries,
        {
          country: "Nouveau pays",
          vatRate: prev.vatDefault,
          dutiesByHs: { default: prev.dutyDefault },
          documents: [],
          restrictions: []
        }
      ]
    }));
  };

  const handleSave = () => {
    saveAdminParameters(params);
    alert("Paramètres sauvegardés !");
  };

  return (
    <div>
      <header>
        <img src="/images/bmta-logo.svg" alt="BMTA&C" width={120} height={36} />
        <h1>Admin Panel - Paramètres</h1>
      </header>
      <main className="sidebar" style={{ width: "100%" }}>
        <div className="section">
          <button className="secondary" onClick={() => setParams(defaultParameters)}>
            Réinitialiser
          </button>
          <p style={{ marginTop: "8px", fontSize: "13px", color: "#4b5563" }}>
            Exemple de taux KSA importable disponible dans <code>public/data/ksa-customs-sample.json</code>.
          </p>
        </div>
        <div className="admin-grid">
          <div className="card">
            <h3>Paramètres globaux</h3>
            <label>Insurance rate</label>
            <input
              type="number"
              step={0.001}
              value={params.insuranceRate}
              onChange={(event) => updateField("insuranceRate", Number(event.target.value))}
            />
            <label>Coût route / km</label>
            <input
              type="number"
              step={0.1}
              value={params.roadCostPerKm}
              onChange={(event) => updateField("roadCostPerKm", Number(event.target.value))}
            />
            <label>Coût mer / km</label>
            <input
              type="number"
              step={0.1}
              value={params.seaCostPerKm}
              onChange={(event) => updateField("seaCostPerKm", Number(event.target.value))}
            />
            <label>Coût air / km</label>
            <input
              type="number"
              step={0.1}
              value={params.airCostPerKm}
              onChange={(event) => updateField("airCostPerKm", Number(event.target.value))}
            />
            <label>Délais port (jours)</label>
            <input
              type="number"
              step={0.1}
              value={params.portDelayDays}
              onChange={(event) => updateField("portDelayDays", Number(event.target.value))}
            />
            <label>VAT par défaut</label>
            <input
              type="number"
              step={0.01}
              value={params.vatDefault}
              onChange={(event) => updateField("vatDefault", Number(event.target.value))}
            />
            <label>Droits par défaut</label>
            <input
              type="number"
              step={0.01}
              value={params.dutyDefault}
              onChange={(event) => updateField("dutyDefault", Number(event.target.value))}
            />
          </div>
          <div className="card">
            <h3>Configurations pays</h3>
            {params.countries.map((country, index) => (
              <div key={country.country} style={{ marginBottom: "16px" }}>
                <label>Pays</label>
                <input
                  value={country.country}
                  onChange={(event) => updateCountry(index, { country: event.target.value })}
                />
                <label>TVA</label>
                <input
                  type="number"
                  step={0.01}
                  value={country.vatRate}
                  onChange={(event) => updateCountry(index, { vatRate: Number(event.target.value) })}
                />
                <label>Droits (HS 7309)</label>
                <input
                  type="number"
                  step={0.01}
                  value={country.dutiesByHs["7309"] ?? params.dutyDefault}
                  onChange={(event) =>
                    updateCountry(index, {
                      dutiesByHs: {
                        ...country.dutiesByHs,
                        "7309": Number(event.target.value)
                      }
                    })
                  }
                />
                <label>Documents requis (séparés par ,)</label>
                <input
                  value={country.documents.join(", ")}
                  onChange={(event) =>
                    updateCountry(index, { documents: event.target.value.split(",").map((doc) => doc.trim()) })
                  }
                />
                <label>Restrictions (séparées par ,)</label>
                <input
                  value={country.restrictions.join(", ")}
                  onChange={(event) =>
                    updateCountry(index, { restrictions: event.target.value.split(",").map((doc) => doc.trim()) })
                  }
                />
              </div>
            ))}
            <button className="secondary" onClick={addCountry}>
              Ajouter un pays
            </button>
          </div>
        </div>
        <div className="section">
          <button onClick={handleSave}>Sauvegarder</button>
        </div>
      </main>
    </div>
  );
}
