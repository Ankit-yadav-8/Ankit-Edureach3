import { useState, useCallback, useRef, useEffect } from "react";

/**
 * useCollegePredictor
 * ───────────────────────────────────────────────────────────────
 * Key change vs the old version: the worker is created ONCE and kept
 * alive for the component's lifetime. The previous code terminated
 * and recreated the worker on every predict() call, which threw away
 * the cached CSV DB and forced a full 8-year reload each time — that
 * was the slow "Predicting…" wait.
 *
 * To still cancel an outdated prediction when the user changes inputs
 * and predicts again, we tag each request with a monotonic reqId and
 * ignore any response whose reqId isn't the latest. No worker churn.
 */
export function useCollegePredictor() {
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState(null);

  const workerRef = useRef(null);
  const reqIdRef  = useRef(0);   // latest request id; stale responses are dropped

  useEffect(() => {
    const worker = new Worker(
      new URL("../workers/collegePredictor.worker.js", import.meta.url),
      { type: "module" }
    );

    worker.onmessage = ({ data }) => {
      // Ignore responses from a superseded request.
      if (data.reqId !== reqIdRef.current) return;
      setLoading(false);
      if (data.ok) setResults(data.result);
      else         setError(data.error || "Prediction failed");
    };

    worker.onerror = (e) => {
      setLoading(false);
      setError(e.message || "Worker error");
    };

    workerRef.current = worker;
    return () => worker.terminate();
  }, []);

  const predict = useCallback((opts, grouped = false) => {
    const reqId = ++reqIdRef.current;   // newest request wins
    setLoading(true);
    setError(null);
    setResults(null);

    workerRef.current?.postMessage({
      reqId,
      type: grouped ? "grouped" : "flat",
      opts,
    });
  }, []);

  const reset = useCallback(() => {
    reqIdRef.current++;   // invalidate any in-flight response
    setResults(null);
    setLoading(false);
    setError(null);
  }, []);

  return { predict, reset, results, loading, error };
}