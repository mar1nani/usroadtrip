export function countTotalStops(days) {
  return days.reduce((s, d) => s + d.stops.length, 0);
}

export function countDoneStops(progress, days) {
  return days.reduce((s, d) => s + countDayDone(progress, d), 0);
}

export function countDaysStarted(progress, days) {
  return days.filter((d) => countDayDone(progress, d) > 0).length;
}

export function countDayDone(progress, day) {
  const c = (progress["d" + day.n] || {}).checks || {};
  return Object.values(c).filter(Boolean).length;
}
