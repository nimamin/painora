import type { Metadata } from "next";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Painora — Problems are more valuable than ideas",
};

export default function HomePage() {
  return (
    <div className={styles.page}>
      <header className={styles.nav}>
        <div className={styles.logo}>Painora</div>
        <nav className={styles.navLinks}>
          <a href="#how">How it works</a>
          <a href="#marketplace">The flow</a>
          <a href="#governance">Ownership</a>
          <a href="#funding">Funding</a>
        </nav>
        <div className={styles.navCta}>
          <a className={styles.ghost} href="/pains">Browse pains</a>
          <a className={styles.primary} href="/chat">Declare a pain</a>
        </div>
      </header>

      <main>
        <section className={styles.hero}>
          <div className={`${styles.heroCopy} ${styles.reveal} ${styles.delay1}`}>
            <p className={styles.eyebrow}>Problems are more valuable than ideas.</p>
            <h1>
              Turn real human pain into<br />real products — together.
            </h1>
            <p className={styles.subhead}>
              Describe what hurts. AI refines the problem. Designers propose solutions.
              The community merges the best ideas into working products.
            </p>
            <div className={styles.heroActions}>
              <a className={styles.primary} href="/chat">Declare a pain</a>
              <a className={styles.ghost} href="#how">See the flow</a>
            </div>
            <div className={styles.trust}>
              <span>Built for makers, problem-solvers, and bold users</span>
              <div className={styles.pill}>IP stays with creators</div>
            </div>
          </div>
          <div className={`${styles.heroCard} ${styles.reveal} ${styles.delay2}`}>
            <div className={styles.cardTop}>
              <div>
                <h3>Declared pain</h3>
                <p>I need a calendar for all my friends’ birthdays.</p>
              </div>
              <span className={styles.badge}>New</span>
            </div>
            <div className={styles.cardBody}>
              <div className={styles.metric}>
                <span>AI clarity score</span>
                <strong>92% aligned after 4 questions</strong>
              </div>
              <div className={styles.metric}>
                <span>Solution pool</span>
                <strong>7 proposals from 3 architects</strong>
              </div>
              <div className={styles.metric}>
                <span>Merge celebration</span>
                <strong>Public event next Friday</strong>
              </div>
            </div>
            <div className={styles.cardFooter}>
              <div>
                <span className={styles.dot}></span>
                Funding pledged
              </div>
              <strong>$2,400</strong>
            </div>
          </div>
        </section>

        <nav className={`${styles.demoFlow} ${styles.reveal}`}>
          <span className={styles.demoLabel}>Demo</span>
          <a href="/chat">① Declare</a>
          <span className={styles.demoSep}>→</span>
          <a href="/pains">② Browse pains</a>
          <span className={styles.demoSep}>→</span>
          <a href="/pains/birthday-blindspot">③ Explore a pain</a>
          <span className={styles.demoSep}>→</span>
          <a href="/merge">④ Merge Festival</a>
        </nav>

        <section className={styles.grid} id="how">
          <div className={`${styles.tile} ${styles.reveal} ${styles.delay1}`}>
            <h2>Pain → Structure → Solution</h2>
            <p>
              Start with a plain-language pain. AI interviews you, removes ambiguity,
              and produces a formal Problem Specification. No idea pitches. Just the real problem.
            </p>
          </div>
          <div className={`${styles.tile} ${styles.reveal} ${styles.delay2}`}>
            <h3>1. Declare</h3>
            <p>Describe what hurts — in plain language. No frameworks, no jargon.</p>
          </div>
          <div className={`${styles.tile} ${styles.reveal} ${styles.delay3}`}>
            <h3>2. Clarify</h3>
            <p>AI asks until the pain is precise, structured, and ready to be solved.</p>
          </div>
          <div className={`${styles.tile} ${styles.reveal} ${styles.delay4}`}>
            <h3>3. Merge & build</h3>
            <p>Designers propose. The best ideas merge into a blueprint. Builders ship.</p>
          </div>
        </section>

        <section className={styles.split} id="marketplace">
          <div className={`${styles.reveal} ${styles.delay1}`}>
            <h2>The solution marketplace</h2>
            <p>
              Problem solvers compete, collaborate, and merge. Original designers
              keep IP ownership and license it to developers who build the product.
            </p>
            <a className={styles.mergeLink} href="/merge">Watch a Merge Festival live →</a>
          </div>
          <div className={styles.steps}>
            <div className={`${styles.step} ${styles.reveal} ${styles.delay1}`}>
              <span>1</span>
              <div>
                <strong>Architect proposals</strong>
                <p>Submit solution blueprints and business models.</p>
              </div>
            </div>
            <div className={`${styles.step} ${styles.reveal} ${styles.delay2}`}>
              <span>2</span>
              <div>
                <strong>Public merge celebration</strong>
                <p>Community and judges merge the best ideas into one plan.</p>
              </div>
            </div>
            <div className={`${styles.step} ${styles.reveal} ${styles.delay3}`}>
              <span>3</span>
              <div>
                <strong>License + build</strong>
                <p>Developers license the design and ship the product.</p>
              </div>
            </div>
          </div>
        </section>

        <section className={styles.testimonials} id="governance">
          <div className={`${styles.reveal} ${styles.delay1}`}>
            <h2>Governance that protects creators</h2>
            <p>
              Painora keeps the initial designer as the IP owner. Licensing makes
              building easy and fair.
            </p>
          </div>
          <div className={styles.quoteGrid}>
            <article className={`${styles.reveal} ${styles.delay1}`}>
              <p>
                &ldquo;Painora makes IP clear from day one. Designers lead, builders
                license, everyone wins.&rdquo;
              </p>
              <span>Product architect</span>
            </article>
            <article className={`${styles.reveal} ${styles.delay2}`}>
              <p>
                &ldquo;The merge celebration creates focus. We stop debating and ship the
                best combined plan.&rdquo;
              </p>
              <span>Innovation lead</span>
            </article>
            <article className={`${styles.reveal} ${styles.delay3}`}>
              <p>
                &ldquo;It feels like a marketplace for hard problems — with a real path
                to ownership.&rdquo;
              </p>
              <span>Independent builder</span>
            </article>
          </div>
        </section>

        <section className={styles.pricing} id="funding">
          <div className={`${styles.priceCard} ${styles.reveal} ${styles.delay1}`}>
            <div>
              <h2>Funding model that de-risks work</h2>
              <p>
                Users authorize a starter amount. Full payment only happens after
                satisfaction with the delivered solution.
              </p>
            </div>
            <ul>
              <li>Upfront pledge to open the project</li>
              <li>Milestone transparency through delivery</li>
              <li>Final payment after approval</li>
            </ul>
            <a className={styles.primary} href="/chat">Back a project</a>
          </div>
          <div className={`${styles.priceDetails} ${styles.reveal} ${styles.delay2}`}>
            <h3>For solution builders</h3>
            <p>Get early access to the pain marketplace and licensing tools.</p>
            <a className={styles.ghost} href="/chat">Join as a builder</a>
          </div>
        </section>

        <section className={styles.cta} id="cta">
          <div className={`${styles.reveal} ${styles.delay1}`}>
            <h2>Ready to declare a pain?</h2>
            <p>
              Start a conversation. AI will clarify the real problem, structure it,
              and open it to designers and builders.
            </p>
          </div>
          <div className={`${styles.ctaActions} ${styles.reveal} ${styles.delay2}`}>
            <div className={styles.chatInput} aria-label="Declare a pain">
              <span>painora.ai/chat</span>
              <input type="text" placeholder="Describe your pain..." />
              <a className={styles.chatButton} href="/chat">Start chat</a>
            </div>
          </div>
        </section>
      </main>

      <footer className={styles.footer}>
        <span>© 2026 Painora. All rights reserved.</span>
        <div className={styles.footerLinks}>
          <a href="mailto:hello@painora.com">hello@painora.com</a>
          <a href="#">Privacy</a>
          <a href="#">Terms</a>
        </div>
      </footer>
    </div>
  );
}
