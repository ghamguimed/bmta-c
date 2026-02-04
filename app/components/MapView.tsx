"use client";

import { MapContainer, TileLayer, GeoJSON, Marker, Polyline, Tooltip, useMapEvents } from "react-leaflet";
import { useEffect, useState } from "react";
import type { LatLngExpression } from "leaflet";
import type { FeatureCollection } from "geojson";
import { NodePoint, Scenario } from "../../lib/types";

interface MapViewProps {
  nodes: NodePoint[];
  scenarios: Scenario[];
  selectedScenarioId: string;
  onWaypointAdd: (point: NodePoint) => void;
}

function ClickHandler({ onWaypointAdd }: { onWaypointAdd: (point: NodePoint) => void }) {
  useMapEvents({
    click(event) {
      onWaypointAdd({
        id: `waypoint-${event.latlng.lat}-${event.latlng.lng}`,
        name: "Waypoint",
        type: "waypoint",
        lat: event.latlng.lat,
        lng: event.latlng.lng
      });
    }
  });

  return null;
}

export default function MapView({ nodes, scenarios, selectedScenarioId, onWaypointAdd }: MapViewProps) {
  const [geoData, setGeoData] = useState<FeatureCollection | null>(null);
  const selectedScenario = scenarios.find((scenario) => scenario.id === selectedScenarioId);

  useEffect(() => {
    fetch("/geo/morocco_sahara.geojson")
      .then((res) => res.json())
      .then(setGeoData)
      .catch(() => setGeoData(null));
  }, []);

  return (
    <MapContainer center={[20, 10]} zoom={2} className="map-container">
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {geoData && <GeoJSON data={geoData} style={{ color: "#1f7ae0", weight: 2, fillOpacity: 0.1 }} />}
      <ClickHandler onWaypointAdd={onWaypointAdd} />

      {nodes.map((node) => (
        <Marker key={node.id} position={[node.lat, node.lng] as LatLngExpression}>
          <Tooltip>{node.name}</Tooltip>
        </Marker>
      ))}

      {selectedScenario?.segments.map((segment) => (
        <Polyline
          key={segment.id}
          positions={[
            [segment.from.lat, segment.from.lng],
            [segment.to.lat, segment.to.lng]
          ]}
          pathOptions={{
            color:
              segment.mode === "SEA"
                ? "#0ea5e9"
                : segment.mode === "AIR"
                  ? "#f97316"
                  : "#22c55e"
          }}
        >
          <Tooltip>
            {segment.mode} · {segment.distanceKm.toFixed(0)} km · {segment.durationDays} jours
          </Tooltip>
        </Polyline>
      ))}
    </MapContainer>
  );
}
