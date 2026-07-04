import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DAYS from "../data/days.json";
import { C } from "../styles/theme";
import { countDayDone } from "../utils/progress";
import { loadDayProgress } from "../services/dayProgressService";
import { useTripProgress } from "../hooks/useTripProgress";
import DayCard from "../components/trip/DayCard";

export default function DaysPage() {
  const navigate = useNavigate();
  const [progress, setProgress] = useState({});
  const { effectiveIndex: todayIdx } = useTripProgress();

  useEffect(() => {
    loadDayProgress().then(setProgress);
  }, []);

  return (
    <div style={{ maxWidth: 1600, margin: "0 auto", padding: "20px" }}>
      <div style={{ fontSize: 18, color: C.gold, fontWeight: 700, marginBottom: 16 }}>★ Les 22 étapes ★</div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(180px,1fr))", gap: 14 }}>
        {DAYS.map((d, i) => (
          <DayCard
            key={d.n}
            day={d}
            doneCount={countDayDone(progress, d)}
            isToday={i === todayIdx}
            onClick={() => navigate(`/days/${d.n}`)}
          />
        ))}
      </div>
    </div>
  );
}
