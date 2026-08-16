export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          fontFamily: "ui-sans-serif, system-ui, sans-serif",
          background: "#0f1115",
          color: "#e8eaed",
        }}
      >
        <header
          style={{
            padding: "16px 24px",
            borderBottom: "1px solid #2a2f3a",
            display: "flex",
            gap: 24,
            alignItems: "baseline",
          }}
        >
          <strong>QuoteGate</strong>
          <a href="/" style={{ color: "#9aa3b2", textDecoration: "none" }}>
            Queue
          </a>
        </header>
        <main style={{ padding: 24, maxWidth: 960 }}>{children}</main>
      </body>
    </html>
  );
}
