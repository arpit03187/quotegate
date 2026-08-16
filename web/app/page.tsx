import Link from "next/link";
import PhoneMock from "@/components/PhoneMock";
import SampleJobButton from "@/components/SampleJobButton";

export default function LandingPage() {
  return (
    <>
      <header className="site-header">
        <Link href="/" className="brand">
          QuoteGate
          <small>See it before the customer does</small>
        </Link>
        <nav className="nav">
          <a href="#problem">The problem</a>
          <a href="#how">How it works</a>
          <Link href="/console" className="btn btn-primary">
            Open QuoteGate
          </Link>
        </nav>
      </header>

      <main>
        <section className="wrap hero">
          <div>
            <p className="kicker">For HVAC, plumbing, and electrical shop owners</p>
            <h1>Your tech sent the quote. You found out tonight.</h1>
            <p className="lede">
              QuoteGate writes the quote from the job. It waits on your phone.
              The homeowner only sees it after you tap send.
            </p>
            <div className="cta-row">
              <SampleJobButton label="See a quote on your screen" />
              <a href="#problem" className="btn btn-ghost">
                Show me the problem
              </a>
            </div>
          </div>
          <div>
            <PhoneMock />
            <p className="caption">You see this first. The customer does not — until you send.</p>
          </div>
        </section>

        <section className="wrap section" id="problem">
          <h2>This happens all week</h2>
          <p className="story">
            Tech is at the house. Condenser is dead. Homeowner asks to add a
            thermostat. Someone sends $4,200 — the old number. Crew installs
            both. You eat $340. Or they get the quote with no repair option and
            call the next company.
          </p>
          <div className="compare">
            <article className="card today-card">
              <h3>Today</h3>
              <ol>
                <li>Tech texts a price, or the office emails it tomorrow.</li>
                <li>You are on another job. You never see it first.</li>
                <li>Customer already has the number. Extra work is already done.</li>
              </ol>
            </article>
            <article className="card next-card">
              <h3>With QuoteGate</h3>
              <ol>
                <li>Tech notes go in: “condenser dead, add thermostat.”</li>
                <li>You get $4,540 on your phone — condenser + thermostat.</li>
                <li>You tap send. Now the customer gets the quote.</li>
              </ol>
            </article>
          </div>
        </section>

        <section className="wrap section" id="how">
          <h2>Three steps. That’s the product.</h2>
          <p className="section-lead">
            No new dispatch board. No chatbot. Just the quote, held until you
            say yes.
          </p>
          <div className="grid-3">
            <article className="step">
              <div className="step-n">1</div>
              <h3>Tech writes what they found</h3>
              <p className="muted">A sentence from the driveway is enough.</p>
            </article>
            <article className="step">
              <div className="step-n">2</div>
              <h3>You get the quote</h3>
              <p className="muted">Price, line items, the text the customer would get. Change a line if it’s wrong.</p>
            </article>
            <article className="step">
              <div className="step-n">3</div>
              <h3>You send it</h3>
              <p className="muted">Or you reject it. Either way, nothing went to the house without you.</p>
            </article>
          </div>
        </section>

        <section className="band">
          <div className="wrap">
            <h2>Who this is for</h2>
            <p className="section-lead" style={{ color: "#d7cbb8" }}>
              You own the shop. You still want eyes on the big numbers. You
              live in the truck, not in software.
            </p>
            <div className="grid-3">
              <article className="card">
                <h3>HVAC, plumbing, electrical</h3>
                <p className="muted" style={{ color: "#c9b496" }}>
                  A few trucks to about fifteen. You already use Jobber or
                  Housecall Pro.
                </p>
              </article>
              <article className="card">
                <h3>You still check the quote</h3>
                <p className="muted" style={{ color: "#c9b496" }}>
                  Replacements, extras, and discounts should not go out just
                  because a tech was trying to close.
                </p>
              </article>
              <article className="card">
                <h3>Not for you if…</h3>
                <p className="muted" style={{ color: "#c9b496" }}>
                  You’re the only tech and you type every quote yourself. Or
                  you already have a sales desk that approves everything.
                </p>
              </article>
            </div>
          </div>
        </section>

        <section className="wrap section">
          <h2>Watch one go through</h2>
          <p className="section-lead">
            We’ll draft the condenser + thermostat job and put it in front of
            you. Send it, change the price, or kill it.
          </p>
          <div className="cta-row">
            <SampleJobButton label="Show me that $4,540 quote" />
            <Link href="/console/new" className="btn btn-ghost">
              Type your own job notes
            </Link>
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="wrap">QuoteGate · The customer sees the quote after you do</div>
      </footer>
    </>
  );
}
