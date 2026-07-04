import { useEffect, useState } from "react";
import { loadSettings, saveSettingsPatch } from "../services/settingsService";
import { currentDayIndex, TRIP_DAYS_COUNT, TRIP_START } from "../utils/dateUtils";

// "Où en est le voyage" (quel jour des 22 est actif) : suit le calendrier par
// défaut, mais dès qu'une étape est confirmée manuellement (DayPage), cette
// confirmation devient la seule source de vérité — plus fiable que la date
// système si le trip ne suit pas exactement le planning.
export function useTripProgress() {
  const [confirmedDayIndex, setConfirmedDayIndex] = useState(undefined); // undefined = chargement

  useEffect(() => {
    loadSettings().then((s) => setConfirmedDayIndex(s.confirmedDayIndex ?? null));
  }, []);

  const loading = confirmedDayIndex === undefined;
  const calendarIndex = currentDayIndex();
  const rawEffective = loading ? calendarIndex : confirmedDayIndex ?? calendarIndex;
  const effectiveIndex = Math.min(rawEffective, TRIP_DAYS_COUNT - 1);
  const tripComplete = !loading && confirmedDayIndex != null && confirmedDayIndex >= TRIP_DAYS_COUNT;
  // Le road trip (les 22 étapes) est considéré "démarré" soit par confirmation
  // manuelle (bouton "Je démarre mon trip"), soit dès que le calendrier
  // atteint réellement TRIP_START — avant ça, on est encore à Chicago
  // (pré-roadtrip), même si `effectiveIndex` retombe sur 0 par défaut.
  const started = (!loading && confirmedDayIndex != null) || new Date() >= TRIP_START;

  async function confirmDay(dayNumber) {
    const next = await saveSettingsPatch({ confirmedDayIndex: dayNumber });
    setConfirmedDayIndex(next.confirmedDayIndex);
  }

  return { effectiveIndex, tripComplete, started, confirmDay, loading };
}
