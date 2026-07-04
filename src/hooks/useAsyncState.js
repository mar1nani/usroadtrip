import { useCallback, useEffect, useState } from "react";

// Charge une valeur async au montage (via `load`), puis expose un setter
// qui met à jour l'état local immédiatement et persiste via `save` en tâche de fond.
export function useAsyncState(load, save, initial) {
  const [value, setValue] = useState(initial);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let active = true;
    load().then((v) => {
      if (active) {
        setValue(v);
        setReady(true);
      }
    });
    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const update = useCallback(
    (updater) => {
      setValue((prev) => {
        const next = typeof updater === "function" ? updater(prev) : updater;
        save(next);
        return next;
      });
    },
    [save]
  );

  return [value, update, ready];
}
