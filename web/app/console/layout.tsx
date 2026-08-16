import Link from "next/link";

export default function ConsoleLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <header className="console-header">
        <Link href="/" className="brand">
          QuoteGate
          <small>Quotes waiting for you</small>
        </Link>
        <nav className="nav">
          <Link href="/console">Queue</Link>
          <Link href="/console/new">New quote</Link>
          <Link href="/">How it works</Link>
          <Link href="/console/new" className="btn btn-primary">
            New quote
          </Link>
        </nav>
      </header>
      <div className="console-main">{children}</div>
    </>
  );
}
