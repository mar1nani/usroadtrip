import { useState } from "react";
import TripMap from "./TripMap";
import StateStopsPanel from "./StateStopsPanel";
import DAYS from "../../data/days.json";

export default function InteractiveTripMap({ points, idx, onPick, carPoint }) {
  const [selectedStateAb, setSelectedStateAb] = useState(null);

  function handleStateClick(ab) {
    setSelectedStateAb((current) => (current === ab ? null : ab));
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12, width: "100%" }}>
      <TripMap
        points={points}
        idx={idx}
        onPick={onPick}
        carPoint={carPoint}
        selectedStateAb={selectedStateAb}
        onStateClick={handleStateClick}
      />
      <StateStopsPanel
        stateAb={selectedStateAb}
        days={DAYS}
        mapPoints={points}
        onClose={() => setSelectedStateAb(null)}
      />
    </div>
  );
}
