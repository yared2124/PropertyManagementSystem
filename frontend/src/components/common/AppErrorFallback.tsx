import React from "react";

export default function AppErrorFallback({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <div style={{ padding: 24, fontFamily: "system-ui" }}>
      <h1 style={{ fontSize: 18, fontWeight: 700, marginBottom: 12 }}>
        App crashed
      </h1>
      <pre
        style={{
          whiteSpace: "pre-wrap",
          background: "#fee",
          border: "1px solid #f99",
          padding: 12,
          borderRadius: 8,
          color: "#900",
          marginBottom: 12,
        }}
      >
        {error?.message || String(error)}
      </pre>
      <details style={{ marginBottom: 12 }}>
        <summary>Show stack</summary>
        <pre style={{ whiteSpace: "pre-wrap" }}>{error?.stack}</pre>
      </details>
      <button
        onClick={reset}
        style={{
          padding: "10px 14px",
          borderRadius: 8,
          border: "1px solid #ccc",
          cursor: "pointer",
          background: "#fff",
        }}
      >
        Try again
      </button>
    </div>
  );
}

