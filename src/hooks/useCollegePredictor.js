import { useState, useCallback, useRef, useEffect } from "react";

export function useCollegePredictor() {
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState(null);
  const workerRef             = useRef(null);

  useEffect(() => {
    workerRef.current = new Worker(
      new URL("../workers/collegePredictor.worker.js", import.meta.url),
      { type: "module" }
    );
    return () => workerRef.current?.terminate();
  }, []);

  const predict = useCallback((opts, grouped = false) => {
    setLoading(true);
    setError(null);
    setResults(null);

    workerRef.current?.terminate();
    workerRef.current = new Worker(
      new URL("../workers/collegePredictor.worker.js", import.meta.url),
      { type: "module" }
    );

    workerRef.current.onmessage = ({ data }) => {
      setLoading(false);
      if (data.ok) setResults(data.result);
      else         setError(data.error || "Prediction failed");
    };

    workerRef.current.onerror = (e) => {
      setLoading(false);
      setError(e.message || "Worker error");
    };

    workerRef.current.postMessage({
      type: grouped ? "grouped" : "flat",
      opts,
    });
  }, []);

  const reset = useCallback(() => {
    workerRef.current?.terminate();
    setResults(null);
    setLoading(false);
    setError(null);
  }, []);

  return { predict, reset, results, loading, error };
}