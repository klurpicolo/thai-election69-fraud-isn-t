import { useState, useEffect } from "react";
import type { ElectionData } from "../lib/types";

export function useElectionData() {
  const [data, setData] = useState<ElectionData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${import.meta.env.BASE_URL}data/election-data.json`)
      .then((r) => r.json())
      .then((d) => {
        setData(d);
        setLoading(false);
      });
  }, []);

  return { data, loading };
}
