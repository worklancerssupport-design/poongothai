import { useDataContext } from "@/contexts/DataContext";

export default function DataTest() {
  const data = useDataContext();

  const checks = [
    { label: "services", ok: Array.isArray(data.services) && data.services.length > 0, count: data.services.length },
    { label: "packages", ok: Array.isArray(data.packages) && data.packages.length > 0, count: data.packages.length },
    { label: "mens", ok: Array.isArray(data.mens) && data.mens.length > 0, count: data.mens.length },
    { label: "womens", ok: Array.isArray(data.womens) && data.womens.length > 0, count: data.womens.length },
    { label: "kids", ok: Array.isArray(data.kids) && data.kids.length > 0, count: data.kids.length },
    { label: "bridalCategories", ok: Array.isArray(data.bridalCategories) && data.bridalCategories.length > 0, count: data.bridalCategories.length },
    { label: "testimonials", ok: Array.isArray(data.testimonials) && data.testimonials.length > 0, count: data.testimonials.length },
    { label: "contact", ok: !!data.contact && !!data.contact.phone, count: 1 },
    { label: "owner", ok: !!data.owner && !!data.owner.name, count: 1 },
  ];

  const allPassed = checks.every((c) => c.ok);

  return (
    <div style={{ padding: 40, fontFamily: "monospace" }}>
      <h1>Data Test</h1>
      <p style={{ color: allPassed ? "green" : "red", fontWeight: "bold", fontSize: 18 }}>
        {allPassed ? "ALL CHECKS PASSED" : "SOME CHECKS FAILED"}
      </p>
      <table style={{ borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th style={{ textAlign: "left", padding: "8px 16px", borderBottom: "2px solid #333" }}>Data</th>
            <th style={{ textAlign: "left", padding: "8px 16px", borderBottom: "2px solid #333" }}>Status</th>
            <th style={{ textAlign: "right", padding: "8px 16px", borderBottom: "2px solid #333" }}>Count</th>
          </tr>
        </thead>
        <tbody>
          {checks.map((c) => (
            <tr key={c.label}>
              <td style={{ padding: "8px 16px", borderBottom: "1px solid #ddd" }}>{c.label}</td>
              <td style={{ padding: "8px 16px", borderBottom: "1px solid #ddd", color: c.ok ? "green" : "red" }}>
                {c.ok ? "OK" : "FAIL"}
              </td>
              <td style={{ padding: "8px 16px", borderBottom: "1px solid #ddd", textAlign: "right" }}>{c.count}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <h2 style={{ marginTop: 30 }}>Sample Data</h2>
      <pre style={{ background: "#f5f5f5", padding: 16, overflow: "auto", maxHeight: 400 }}>
        {JSON.stringify(data, null, 2).slice(0, 3000)}...
      </pre>
    </div>
  );
}
