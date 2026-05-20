import { useState, useEffect, useRef } from "react";

function useInView(ref, threshold = 0.15) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    if (!ref.current) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold }
    );
    obs.observe(ref.current);
    return () => obs.disconnect();
  }, [ref, threshold]);
  return visible;
}

function Reveal({ children, delay = 0, style = {} }) {
  const ref = useRef(null);
  const visible = useInView(ref);
  return (
    <div ref={ref} style={{
      opacity: visible ? 1 : 0,
      transform: visible ? "translateY(0)" : "translateY(16px)",
      transition: `opacity 0.6s ease ${delay}s, transform 0.6s ease ${delay}s`,
      ...style,
    }}>{children}</div>
  );
}

function Nav() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", h, { passive: true });
    return () => window.removeEventListener("scroll", h);
  }, []);
  return (
    <nav style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
      borderBottom: scrolled ? "1px solid #e8e0d4" : "1px solid transparent",
      background: scrolled ? "rgba(252,249,244,0.9)" : "transparent",
      backdropFilter: scrolled ? "blur(12px)" : "none",
      transition: "all 0.3s ease",
    }}>
      <div style={{
        maxWidth: 1080, margin: "0 auto", padding: "16px 32px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        <a href="#" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 18 }}>🐴</span>
          <span style={{ fontFamily: "var(--serif)", fontSize: 16, fontWeight: 600, color: "var(--primary)", letterSpacing: "-0.01em" }}>Agentic POA</span>
        </a>
        <div className="nav-links" style={{ display: "flex", alignItems: "center", gap: 28 }}>
          {[["Spec", "#spec"], ["Examples", "#scenarios"], ["Stack", "#stack"], ["Vision", "#vision"]].map(([t, h]) => (
            <a key={t} href={h} style={{ fontSize: 14, color: "var(--secondary)", textDecoration: "none", fontWeight: 450 }}>{t}</a>
          ))}
          <a href="https://github.com/agenticpoa/apoa" target="_blank" rel="noopener noreferrer" style={{
            fontSize: 13, fontWeight: 550, color: "#fff", background: "var(--primary)",
            padding: "8px 16px", borderRadius: 6, textDecoration: "none",
          }}>GitHub</a>
        </div>
      </div>
    </nav>
  );
}

function Hero() {
  const [m, setM] = useState(false);
  useEffect(() => { requestAnimationFrame(() => setM(true)); }, []);
  const f = (d) => ({ opacity: m ? 1 : 0, transform: m ? "translateY(0)" : "translateY(20px)", transition: `all 0.7s ease ${d}s` });
  return (
    <section style={{ paddingTop: 140, paddingBottom: 80 }}>
      <div style={{ maxWidth: 1080, margin: "0 auto", padding: "0 32px" }}>
        <div style={f(0.05)}>
          <span style={{ fontSize: 13, fontWeight: 550, color: "var(--accent)", letterSpacing: "0.04em" }}>OPEN STANDARD · WORKING DRAFT v0.1</span>
        </div>
        <h1 style={{
          fontFamily: "var(--serif)", fontSize: "clamp(44px, 6vw, 72px)",
          fontWeight: 400, lineHeight: 1.08, letterSpacing: "-0.03em",
          color: "var(--primary)", marginTop: 16, maxWidth: 720,
          ...f(0.15),
        }}>
          AI agents are already<br />acting on your behalf.
        </h1>
        <p style={{
          fontSize: 18, lineHeight: 1.7, color: "var(--secondary)",
          maxWidth: 560, marginTop: 24,
          ...f(0.25),
        }}>
          An AI agent recently negotiated and <a href="https://aaronstuyvenberg.com/posts/clawd-bought-a-car" target="_blank" rel="noopener noreferrer" style={{ color: "var(--accent)", textDecoration: "none", fontWeight: 550 }}>bought someone a car</a>. Its authorization model was a prompt that said "ask me before doing anything important." No scoped permissions. No audit trail. No kill switch.
        </p>
        <p style={{
          fontSize: 18, lineHeight: 1.7, color: "var(--secondary)",
          maxWidth: 560, marginTop: 12,
          ...f(0.3),
        }}>
          Agentic Power of Attorney is the missing infrastructure — an open standard for formally delegating bounded authority to AI agents.
        </p>
        <div style={{ display: "flex", gap: 12, marginTop: 32, ...f(0.35) }}>
          <a href="https://github.com/agenticpoa/apoa/blob/main/SPEC.md" target="_blank" rel="noopener noreferrer" style={{
            fontSize: 14, fontWeight: 550, color: "#fff", background: "var(--primary)",
            padding: "12px 24px", borderRadius: 8, textDecoration: "none",
          }}>Read the spec</a>
          <a href="#vision" style={{
            fontSize: 14, fontWeight: 550, color: "var(--primary)",
            padding: "12px 24px", borderRadius: 8, textDecoration: "none",
            border: "1px solid #d4cdc0",
          }}>See the vision</a>
        </div>
      </div>
    </section>
  );
}

function CodeBlock() {
  const [tab, setTab] = useState(0);
  const preStyle = {
    margin: 0, padding: "20px 24px", fontSize: 13, lineHeight: 1.8,
    fontFamily: "var(--mono)", color: "#a8a098", overflowX: "auto",
  };
  const str = { color: "#c4956a" };
  const cmt = { color: "#5a5550" };
  const bool = { color: "#8aab7a" };
  return (
    <Reveal>
      <div style={{ maxWidth: 1080, margin: "0 auto", padding: "0 32px" }}>
        <div style={{
          background: "#1c1917", borderRadius: 12, overflow: "hidden",
          border: "1px solid #2a2520",
        }}>
          <div style={{ padding: "10px 16px", borderBottom: "1px solid #2a2520", display: "flex", alignItems: "center", gap: 6 }}>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#3a3530" }} />
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#3a3530" }} />
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#3a3530" }} />
            <div style={{ marginLeft: 8, display: "flex", gap: 16 }}>
              {["authorization.yaml", "typescript.ts"].map((name, i) => (
                <button key={i} onClick={() => setTab(i)} style={{
                  background: "transparent", border: "none", cursor: "pointer", padding: 0,
                  fontSize: 11, fontFamily: "var(--mono)",
                  color: tab === i ? "#c4956a" : "#7a7068",
                  transition: "color 0.15s ease",
                }}>{name}</button>
              ))}
            </div>
          </div>
          {tab === 0 ? (
            <pre style={preStyle}>
{`authorization:
  principal: `}<span style={str}>"You"</span>{`
  agent: `}<span style={str}>"Your AI Assistant"</span>{`
  service: `}<span style={str}>"mychart.com"</span>{`
  scope:
    - `}<span style={str}>"appointments:read"</span>{`
    - `}<span style={str}>"prescriptions:refill_status:read"</span>{`
  constraints:
    signing: `}<span style={bool}>false</span>{`       `}<span style={cmt}>{"# never signs anything"}</span>{`
    data_export: `}<span style={bool}>false</span>{`    `}<span style={cmt}>{"# data stays on-platform"}</span>{`
  rules:
    - `}<span style={str}>"Alert me 48hrs before any appointment"</span>{`
    - `}<span style={str}>"Never respond to messages on my behalf"</span>{`
  expires: `}<span style={str}>"2026-09-01"</span>{`
  revocable: `}<span style={bool}>true</span>
            </pre>
          ) : (
            <pre style={preStyle}>
{`import { createToken, checkScope, generateKeyPair } from `}<span style={str}>'@apoa/core'</span>{`;

const keys = await generateKeyPair();

const token = await createToken({
  principal: { id: `}<span style={str}>"did:apoa:you"</span>{` },
  agent: { id: `}<span style={str}>"did:apoa:your-agent"</span>{`, name: `}<span style={str}>"Your AI Assistant"</span>{` },
  services: [{
    service: `}<span style={str}>"mychart.com"</span>{`,
    scopes: [`}<span style={str}>"appointments:read"</span>{`],
    accessMode: `}<span style={str}>"browser"</span>{`,
  }],
  expires: `}<span style={str}>"2026-09-01"</span>{`,
}, { privateKey: keys.privateKey });

checkScope(token, `}<span style={str}>"mychart.com"</span>{`, `}<span style={str}>"appointments:read"</span>{`);
`}<span style={cmt}>{"// { allowed: true }"}</span>
            </pre>
          )}
        </div>
      </div>
    </Reveal>
  );
}

function ProblemSection() {
  return (
    <section id="problem" style={{ paddingTop: 100, paddingBottom: 80 }}>
      <div style={{ maxWidth: 1080, margin: "0 auto", padding: "0 32px" }}>
        <Reveal>
          <div style={{ maxWidth: 600 }}>
            <span style={{ fontSize: 13, fontWeight: 550, color: "var(--accent)", letterSpacing: "0.04em" }}>THE PROBLEM</span>
            <h2 style={{ fontFamily: "var(--serif)", fontSize: "clamp(32px, 4vw, 48px)", fontWeight: 400, lineHeight: 1.12, letterSpacing: "-0.025em", color: "var(--primary)", marginTop: 12 }}>
              AI agents can do remarkable things. Except prove they're allowed&nbsp;to.
            </h2>
            <p style={{ fontSize: 16, lineHeight: 1.75, color: "var(--secondary)", marginTop: 20 }}>
              Your AI can pass the bar exam, but it can't check your kid's pediatrician appointment. Today, your options are to hand over your password, watch it do everything manually, wait for services to add APIs, or just not use agents at all.
            </p>
          </div>
        </Reveal>
        <Reveal delay={0.1}>
          <div className="responsive-grid-4" style={{
            display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 1,
            marginTop: 48, background: "#e0d9cc", borderRadius: 12, overflow: "hidden",
          }}>
            {[
              ["Share your password", "Hope the AI doesn't get phished, leak it, or hallucinate its way into your savings."],
              ["Supervise everything", "Defeating the purpose. You're a human clipboard."],
              ["Wait for APIs", "Your utility company will add OAuth after they migrate off IE6."],
              ["Don't use agents", "The default. Not because it's good."],
            ].map(([title, desc], i) => (
              <div key={i} style={{ padding: "28px 24px", background: "var(--bg)" }}>
                <h3 style={{ fontSize: 15, fontWeight: 600, color: "var(--primary)", lineHeight: 1.3 }}>{title}</h3>
                <p style={{ fontSize: 13, lineHeight: 1.6, color: "var(--tertiary)", marginTop: 8 }}>{desc}</p>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function HowSection() {
  return (
    <section id="spec" style={{ paddingTop: 80, paddingBottom: 80 }}>
      <div style={{ maxWidth: 1080, margin: "0 auto", padding: "0 32px" }}>
        <Reveal>
          <span style={{ fontSize: 13, fontWeight: 550, color: "var(--accent)", letterSpacing: "0.04em" }}>HOW IT WORKS</span>
          <h2 style={{ fontFamily: "var(--serif)", fontSize: "clamp(32px, 4vw, 48px)", fontWeight: 400, lineHeight: 1.12, letterSpacing: "-0.025em", color: "var(--primary)", marginTop: 12, maxWidth: 560 }}>
            Built on standards that already exist.
          </h2>
        </Reveal>
        <div className="responsive-grid-3" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 1, marginTop: 48, background: "#e0d9cc", borderRadius: 12, overflow: "hidden" }}>
          {[
            ["01", "Define authorization", "Scope, constraints, rules, expiration. What the agent can access and what it can't. A YAML file, not a 40-page legal document."],
            ["02", "Token is issued", "The authorization becomes a signed JWT — cryptographically verifiable, tamper-proof, portable. Optionally packaged as a W3C Verifiable Credential."],
            ["03", "Agent operates", "API services use OAuth. Browser-only services use secure credential injection — the AI never sees your password. Every action is logged."],
          ].map(([n, title, desc]) => (
            <div key={n} style={{ padding: "32px 28px", background: "var(--bg)" }}>
              <span style={{ fontFamily: "var(--mono)", fontSize: 12, color: "var(--accent)", fontWeight: 600 }}>{n}</span>
              <h3 style={{ fontSize: 17, fontWeight: 600, color: "var(--primary)", marginTop: 12, lineHeight: 1.3 }}>{title}</h3>
              <p style={{ fontSize: 14, lineHeight: 1.7, color: "var(--secondary)", marginTop: 10 }}>{desc}</p>
            </div>
          ))}
        </div>
        <Reveal delay={0.1}>
          <div className="responsive-grid-2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 1, marginTop: 1, background: "#e0d9cc", borderRadius: "0 0 12px 12px", overflow: "hidden" }}>
            {[
              ["API-based", "Extends OAuth 2.1 — the APOA token constrains scope, adds agent identity verification, delegation chain tracking, and audit."],
              ["Browser-based", "Secure credential injection for services without APIs. Encrypted vault → browser form. The AI model never touches your password."],
            ].map(([title, desc], i) => (
              <div key={i} style={{ padding: "28px 28px", background: "var(--bg)" }}>
                <span style={{ fontSize: 12, fontWeight: 600, color: "var(--accent)", letterSpacing: "0.04em" }}>MODE {i === 0 ? "A" : "B"}</span>
                <h4 style={{ fontSize: 15, fontWeight: 600, color: "var(--primary)", marginTop: 8, lineHeight: 1.3 }}>{title}</h4>
                <p style={{ fontSize: 13, lineHeight: 1.65, color: "var(--tertiary)", marginTop: 8 }}>{desc}</p>
              </div>
            ))}
          </div>
        </Reveal>
        <Reveal delay={0.15}>
          <div style={{ display: "flex", gap: 32, marginTop: 40, flexWrap: "wrap" }}>
            {["OAuth 2.1", "JWT / JWS", "W3C VCs", "W3C DIDs", "ZCAP-LD"].map(t => (
              <span key={t} style={{ fontSize: 13, color: "var(--tertiary)", fontFamily: "var(--mono)", fontWeight: 500 }}>{t}</span>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function IntegrationSection() {
  const items = [
    { label: "Consumer AI", title: "ChatGPT, Claude, Gemini", desc: "One authorization document governs every connected service. A single dashboard instead of a trail of forgotten OAuth grants." },
    { label: "Coding agents", title: "Claude Code, Codex, Cursor", desc: "Scope your agent to this repo only. No touching ~/.ssh. Autonomous for writing code, require approval for deploying." },
    { label: "Autonomous agents", title: "OpenClaw, AutoGPT, CrewAI", desc: "Replace \"ask me before doing anything important\" with machine-enforceable authorization. The infrastructure polices — not the LLM." },
    { label: "MCP servers", title: "Arcade.dev, connectors", desc: "MCP handles how to connect. APOA decides what the agent is allowed to do. Our adapter ships today." },
  ];
  return (
    <section style={{ paddingTop: 80, paddingBottom: 80 }}>
      <div style={{ maxWidth: 1080, margin: "0 auto", padding: "0 32px" }}>
        <Reveal>
          <span style={{ fontSize: 13, fontWeight: 550, color: "var(--accent)", letterSpacing: "0.04em" }}>INTEGRATION</span>
          <h2 style={{ fontFamily: "var(--serif)", fontSize: "clamp(32px, 4vw, 48px)", fontWeight: 400, lineHeight: 1.12, letterSpacing: "-0.025em", color: "var(--primary)", marginTop: 12, maxWidth: 560 }}>
            Works with the tools you already&nbsp;use.
          </h2>
        </Reveal>
        <Reveal delay={0.1}>
          <div className="responsive-grid-2" style={{
            display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 1,
            marginTop: 48, background: "#e0d9cc", borderRadius: 12, overflow: "hidden",
          }}>
            {items.map((item, i) => (
              <div key={i} style={{ padding: "28px 28px", background: "var(--bg)" }}>
                <span style={{ fontSize: 11, fontWeight: 600, color: "var(--accent)", letterSpacing: "0.06em", textTransform: "uppercase", fontFamily: "var(--mono)" }}>{item.label}</span>
                <h3 style={{ fontSize: 16, fontWeight: 600, color: "var(--primary)", marginTop: 8, lineHeight: 1.3 }}>{item.title}</h3>
                <p style={{ fontSize: 13, lineHeight: 1.65, color: "var(--tertiary)", marginTop: 8 }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function ScenariosSection() {
  const [active, setActive] = useState(0);
  const items = [
    { title: "Real Estate", poa: "Special / Limited POA", desc: "A dozen portals that don't talk to each other. Your agent monitors the mortgage, tracks closing, flags deadlines — across every service — without signing a thing.", services: ["nationwidemortgage.com", "docusign.com", "acmetitle.com"] },
    { title: "Healthcare", poa: "Healthcare / Medical POA", desc: "Parent with a chronic condition and four portals. Agent watches MyChart, tracks claims, monitors refills — so you can be family, not a case manager.", services: ["mychart.com", "aetna.com", "cvs.com"] },
    { title: "New Parent", poa: "Limited / Special POA", desc: "Insurance enrollment, daycare waitlists, pediatrician search, SSN tracking — all on no sleep. Agent handles logistical overhead.", services: ["healthcare.gov", "zocdoc.com", "ssa.gov"] },
    { title: "Aging Parent", poa: "Durable Financial POA", desc: "Dad's finances are in a shoebox. Agent monitors Medicare, SSA, banks, insurance — sends a clean summary instead of a panic attack.", services: ["medicare.gov", "ssa.gov", "bankofamerica.com"] },
    { title: "Military Deployment", poa: "Military POA", desc: "Deploying overseas. Spouse co-manages while agent monitors TRICARE, base housing, benefits — across government portals.", services: ["tricare.mil", "usaa.com", "navyfederal.org"] },
    { title: "Estate Settlement", poa: "Executor Authority", desc: "Someone you love has died. Agent inventories accounts, tracks deadlines, monitors claims — so you can grieve without missing a filing date.", services: ["fidelity.com", "irs.gov", "courts.gov"] },
  ];
  const s = items[active];
  return (
    <section id="scenarios" style={{ paddingTop: 80, paddingBottom: 80 }}>
      <div style={{ maxWidth: 1080, margin: "0 auto", padding: "0 32px" }}>
        <Reveal>
          <span style={{ fontSize: 13, fontWeight: 550, color: "var(--accent)", letterSpacing: "0.04em" }}>SCENARIOS</span>
          <h2 style={{ fontFamily: "var(--serif)", fontSize: "clamp(32px, 4vw, 48px)", fontWeight: 400, lineHeight: 1.12, letterSpacing: "-0.025em", color: "var(--primary)", marginTop: 12, maxWidth: 600 }}>
            Every scenario maps to a real power of attorney use&nbsp;case.
          </h2>
        </Reveal>
        <Reveal delay={0.1}>
          <div style={{ display: "flex", gap: 6, marginTop: 36, flexWrap: "wrap" }}>
            {items.map((item, i) => (
              <button key={i} onClick={() => setActive(i)} style={{
                padding: "8px 16px", borderRadius: 6, fontSize: 13, fontWeight: 550,
                border: "1px solid", cursor: "pointer", fontFamily: "var(--sans)",
                borderColor: active === i ? "var(--primary)" : "#d4cdc0",
                background: active === i ? "var(--primary)" : "transparent",
                color: active === i ? "#fff" : "var(--secondary)",
                transition: "all 0.2s ease",
              }}>{item.title}</button>
            ))}
          </div>
          <div key={active} style={{
            marginTop: 20, padding: "32px", borderRadius: 12,
            border: "1px solid #e0d9cc", background: "#faf8f4",
          }}>
            <div style={{ display: "flex", alignItems: "baseline", gap: 12, flexWrap: "wrap" }}>
              <h3 style={{ fontSize: 22, fontWeight: 600, color: "var(--primary)", fontFamily: "var(--serif)", letterSpacing: "-0.01em" }}>{s.title}</h3>
              <span style={{ fontSize: 12, color: "var(--accent)", fontFamily: "var(--mono)", fontWeight: 500 }}>{s.poa}</span>
            </div>
            <p style={{ fontSize: 15, lineHeight: 1.75, color: "var(--secondary)", marginTop: 14, maxWidth: 560 }}>{s.desc}</p>
            <div style={{ display: "flex", gap: 8, marginTop: 18, flexWrap: "wrap" }}>
              {s.services.map(svc => (
                <span key={svc} style={{ fontSize: 12, fontFamily: "var(--mono)", color: "var(--tertiary)", padding: "4px 10px", borderRadius: 4, background: "#f0ece4" }}>{svc}</span>
              ))}
            </div>
          </div>
        </Reveal>
        <Reveal delay={0.15}>
          <p style={{ fontSize: 14, color: "var(--tertiary)", marginTop: 20 }}>
            7 fully worked scenarios →{" "}
            <a href="https://github.com/agenticpoa/apoa/blob/main/EXAMPLES.md" style={{ color: "var(--accent)", textDecoration: "none", fontWeight: 550 }}>EXAMPLES.md</a>
          </p>
        </Reveal>
      </div>
    </section>
  );
}

function ShippedSection() {
  const items = [
    {
      label: "SDKS",
      title: "TypeScript and Python, same tokens",
      desc: "Issue in one runtime, verify in the other. Cross-language fixture tests keep them from drifting apart.",
      code: "await createToken({ principal, agent, services }, key)",
      refs: [
        { label: "npm @apoa/core", href: "https://www.npmjs.com/package/@apoa/core" },
        { label: "pip apoa", href: "https://pypi.org/project/apoa/" },
      ],
    },
    {
      label: "PROTOCOL ADAPTERS",
      title: "MCP and A2A, both wrapped",
      desc: "Our MCP adapter gates tool calls on MCP servers as middleware or stdio proxy. Our A2A adapter attenuates permissions across agent-to-agent hops.",
      code: "withAPOA(server, { key, mappings })",
      refs: [
        { label: "@apoa/mcp", href: "https://www.npmjs.com/package/@apoa/mcp" },
        { label: "@apoa/a2a", href: "https://www.npmjs.com/package/@apoa/a2a" },
      ],
    },
    {
      label: "SIGNING",
      title: "Your SSH key is your signature",
      desc: "sign.agenticpoa.com — agent signs autonomously, you co-sign, or you draw your signature in a browser. Tamper-evident audit chain. No accounts.",
      code: "ssh sign.agenticpoa.com sign --type git-commit",
      refs: [
        { label: "sshsign", href: "https://github.com/agenticpoa/sshsign" },
      ],
    },
    {
      label: "REFERENCE DEMOS",
      title: "Two AI agents can already negotiate a SAFE",
      desc: "A founder agent and an investor agent run a YC SAFE under enforced bounds. Every offer is logged. The signed PDF carries the audit trail.",
      code: "python negotiate.py --role founder",
      refs: [
        { label: "negotiate", href: "https://github.com/agenticpoa/negotiate" },
        { label: "claw-negotiate", href: "https://github.com/agenticpoa/claw-negotiate" },
      ],
    },
  ];
  return (
    <section id="stack" style={{ paddingTop: 80, paddingBottom: 80 }}>
      <div style={{ maxWidth: 1080, margin: "0 auto", padding: "0 32px" }}>
        <Reveal>
          <span style={{ fontSize: 13, fontWeight: 550, color: "var(--accent)", letterSpacing: "0.04em" }}>TODAY</span>
          <h2 style={{ fontFamily: "var(--serif)", fontSize: "clamp(32px, 4vw, 48px)", fontWeight: 400, lineHeight: 1.12, letterSpacing: "-0.025em", color: "var(--primary)", marginTop: 12, maxWidth: 560 }}>
            The standard exists. So does the stack.
          </h2>
        </Reveal>
        <Reveal delay={0.1}>
          <div className="responsive-grid-2" style={{
            display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 1,
            marginTop: 48, background: "#e0d9cc", borderRadius: 12, overflow: "hidden",
          }}>
            {items.map((item, i) => (
              <div key={i} style={{ padding: "28px 28px", background: "var(--bg)" }}>
                <span style={{ fontSize: 11, fontWeight: 600, color: "var(--accent)", letterSpacing: "0.06em", textTransform: "uppercase", fontFamily: "var(--mono)" }}>{item.label}</span>
                <h3 style={{ fontSize: 16, fontWeight: 600, color: "var(--primary)", marginTop: 8, lineHeight: 1.3 }}>{item.title}</h3>
                <p style={{ fontSize: 13, lineHeight: 1.65, color: "var(--tertiary)", marginTop: 8 }}>{item.desc}</p>
                <div style={{ fontSize: 12, fontFamily: "var(--mono)", color: "var(--secondary)", padding: "10px 14px", background: "#f0ece4", borderRadius: 6, marginTop: 14, overflowX: "auto" }}>{item.code}</div>
                <div style={{ display: "flex", gap: 8, marginTop: 12, flexWrap: "wrap" }}>
                  {item.refs.map(r => (
                    <a key={r.label} href={r.href} target="_blank" rel="noopener noreferrer" className="ref-chip" style={{ fontSize: 11, fontFamily: "var(--mono)", color: "var(--tertiary)", padding: "3px 8px", borderRadius: 4, background: "#f0ece4", textDecoration: "none", transition: "background 0.15s ease, color 0.15s ease" }}>{r.label}</a>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function VisionSection() {
  return (
    <section id="vision" style={{ paddingTop: 40, paddingBottom: 80 }}>
      <div style={{ maxWidth: 1080, margin: "0 auto", padding: "0 32px" }}>
        <Reveal>
          <div>
            <span style={{ fontSize: 13, fontWeight: 550, color: "var(--accent)", letterSpacing: "0.04em" }}>THE VISION</span>
            <h2 style={{ fontFamily: "var(--serif)", fontSize: "clamp(32px, 4vw, 48px)", fontWeight: 400, lineHeight: 1.12, letterSpacing: "-0.025em", color: "var(--primary)", marginTop: 12, maxWidth: 520 }}>
              "Buy me a house."
            </h2>
            <p style={{ fontSize: 16, lineHeight: 1.75, color: "var(--secondary)", marginTop: 20, maxWidth: 560 }}>
              An AI agent already bought someone a car. The next step is an agent that can negotiate a home purchase, handle the paperwork, and close the deal — with formal authority, a complete audit trail, and a kill switch you control at every step.
            </p>
          </div>
        </Reveal>
        <Reveal delay={0.1}>
          <div style={{ marginTop: 48, display: "flex", flexDirection: "column", gap: 0 }}>
            {[
              { label: "Already happening", title: "Act without guardrails", desc: "Agents access your email, browser, and accounts through shared credentials and natural language instructions. No scoping, no audit trail, no revocation. It works — until it doesn't.", active: false, highlight: true },
              { label: "v0.1 · APOA today", title: "Monitor & Act within bounds", desc: "Scoped permissions, credential isolation, full audit trail, instant revocation. The agent operates on your behalf with formal authorization — not just a prompt.", active: false, highlight: false },
              { label: "The destination", title: "Represent me", desc: "Agent negotiates, transacts, and commits — within tiered confirmation thresholds, co-principal authorization, and legally paired delegation. You approve what matters. Everything else is handled.", active: true, highlight: false },
            ].map((step, i) => (
              <div key={i} style={{ display: "flex", gap: 24 }}>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flexShrink: 0, width: 20 }}>
                  <div style={{
                    width: 10, height: 10, borderRadius: "50%", marginTop: 6, flexShrink: 0,
                    background: step.active ? "var(--accent)" : step.highlight ? "#c44" : "var(--bg)",
                    border: step.active ? "2px solid var(--accent)" : step.highlight ? "2px solid #c44" : "2px solid #c4bdb0",
                  }} />
                  {i < 2 && <div style={{ width: 1, flex: 1, background: "#d4cdc0" }} />}
                </div>
                <div style={{ paddingBottom: i < 2 ? 32 : 0 }}>
                  <span style={{ fontSize: 11, fontWeight: 600, color: step.active ? "var(--accent)" : step.highlight ? "#c44" : "var(--tertiary)", letterSpacing: "0.06em", textTransform: "uppercase", fontFamily: "var(--mono)" }}>{step.label}</span>
                  <h3 style={{ fontSize: 18, fontWeight: 600, color: "var(--primary)", marginTop: 4, lineHeight: 1.3 }}>{step.title}</h3>
                  <p style={{ fontSize: 14, lineHeight: 1.7, color: "var(--secondary)", marginTop: 6, maxWidth: 480 }}>{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </Reveal>
        <Reveal delay={0.2}>
          <p style={{
            fontSize: 15, lineHeight: 1.75, color: "var(--secondary)", marginTop: 48,
            maxWidth: 560, paddingTop: 32, borderTop: "1px solid #e0d9cc",
          }}>
            The technical roadmap for high-authority delegation — legal POA pairing, tiered confirmation thresholds, co-principal authorization — is in{" "}
            <a href="https://github.com/agenticpoa/apoa/blob/main/SPEC.md#appendix-d-future-work" style={{ color: "var(--accent)", textDecoration: "none", fontWeight: 550 }}>Appendix D of the Spec</a>.
          </p>
        </Reveal>
      </div>
    </section>
  );
}

function ComparisonSection() {
  const features = ["Scoped permissions", "Time-bounded access", "Instant revocation", "Full audit trail", "Works without APIs", "Delegation chains", "Credential isolation", "Legal alignment"];
  const cols = [
    { name: "APOA", vals: [1,1,1,1,1,1,1,1] },
    { name: "OAuth", vals: [1,1,1,0,0,0,0,0] },
    { name: "Browser agents", vals: [0,0,0,0,1,0,0,0] },
    { name: "Passwords", vals: [0,0,0,0,1,0,0,0] },
  ];
  return (
    <section style={{ paddingTop: 80, paddingBottom: 80 }}>
      <div style={{ maxWidth: 1080, margin: "0 auto", padding: "0 32px" }}>
        <Reveal>
          <span style={{ fontSize: 13, fontWeight: 550, color: "var(--accent)", letterSpacing: "0.04em" }}>COMPARISON</span>
          <h2 style={{ fontFamily: "var(--serif)", fontSize: "clamp(28px, 3.5vw, 40px)", fontWeight: 400, lineHeight: 1.15, letterSpacing: "-0.02em", color: "var(--primary)", marginTop: 12, maxWidth: 480 }}>
            The current state of the art.
          </h2>
        </Reveal>
        <Reveal delay={0.1}>
          <div style={{ marginTop: 36, overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
              <thead>
                <tr style={{ borderBottom: "2px solid #e0d9cc" }}>
                  <th style={{ textAlign: "left", padding: "12px 0", fontSize: 12, fontWeight: 600, color: "var(--tertiary)", letterSpacing: "0.04em", textTransform: "uppercase" }}>Feature</th>
                  {cols.map(c => (
                    <th key={c.name} style={{ textAlign: "center", padding: "12px 16px", fontSize: 12, fontWeight: 600, color: c.name === "APOA" ? "var(--accent)" : "var(--tertiary)", letterSpacing: "0.04em", textTransform: "uppercase" }}>{c.name}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {features.map((f, i) => (
                  <tr key={f} style={{ borderBottom: "1px solid #ece6db" }}>
                    <td style={{ padding: "12px 0", color: "var(--secondary)", fontWeight: 450 }}>{f}</td>
                    {cols.map(c => (
                      <td key={c.name} style={{ textAlign: "center", padding: "12px 16px", fontSize: 15 }}>
                        {c.vals[i]
                          ? <span style={{ color: "#4a7c59" }}>✓</span>
                          : <span style={{ color: "#c4a088", opacity: 0.6 }}>—</span>}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function CTASection() {
  return (
    <section style={{ paddingTop: 80, paddingBottom: 60 }}>
      <div style={{ maxWidth: 1080, margin: "0 auto", padding: "0 32px" }}>
        <Reveal>
          <div style={{ borderTop: "1px solid #e0d9cc", paddingTop: 80, maxWidth: 520 }}>
            <span style={{ fontSize: 13, fontWeight: 550, color: "var(--accent)", letterSpacing: "0.04em" }}>OPEN STANDARD</span>
            <h2 style={{ fontFamily: "var(--serif)", fontSize: "clamp(32px, 4vw, 48px)", fontWeight: 400, lineHeight: 1.12, letterSpacing: "-0.025em", color: "var(--primary)", marginTop: 12 }}>
              Built in the open.
            </h2>
            <p style={{ fontSize: 16, lineHeight: 1.75, color: "var(--secondary)", marginTop: 16 }}>
              APOA is Apache 2.0 licensed. The spec, examples, and reference implementations are open source. We're building toward formal standards body submission.
            </p>
            <div style={{ display: "flex", gap: 20, marginTop: 28, flexWrap: "wrap" }}>
              {[
                ["Read the Spec", "https://github.com/agenticpoa/apoa/blob/main/SPEC.md"],
                ["See Examples", "https://github.com/agenticpoa/apoa/blob/main/EXAMPLES.md"],
                ["Star on GitHub", "https://github.com/agenticpoa/apoa"],
              ].map(([label, href]) => (
                <a key={label} href={href} target="_blank" rel="noopener noreferrer" style={{
                  fontSize: 14, color: "var(--accent)", textDecoration: "none", fontWeight: 550,
                }}>{label} →</a>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer style={{ paddingTop: 48, paddingBottom: 48 }}>
      <div style={{ maxWidth: 1080, margin: "0 auto", padding: "0 32px" }}>
        <div style={{
          padding: "14px 20px", borderRadius: 8, marginBottom: 48,
          background: "#faf4ec", border: "1px solid #e8dfd2",
          fontSize: 13, lineHeight: 1.6, color: "var(--tertiary)",
        }}>
          <strong style={{ color: "var(--secondary)" }}>No tokens. No coins. No NFTs.</strong>{" "}
          The only "token" here is a signed JWT. If someone is selling you an "APOA token," it's a scam.
        </div>
        <div style={{ borderTop: "1px solid #e0d9cc", paddingTop: 32, display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 24 }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
              <span style={{ fontSize: 16 }}>🐴</span>
              <span style={{ fontFamily: "var(--serif)", fontSize: 14, fontWeight: 600, color: "var(--primary)" }}>Agentic POA</span>
            </div>
            <p style={{ fontSize: 13, color: "var(--tertiary)", lineHeight: 1.6, maxWidth: 380 }}>
              Meet Proxy — a <a href="https://en.wikipedia.org/wiki/Pony_of_the_Americas" target="_blank" rel="noopener noreferrer" style={{ color: "var(--tertiary)", textDecoration: "underline" }}>Pony of the Americas</a>. Calm, intelligent, and built to earn your trust. Which is more than we can say for your insurance company's login page.
            </p>
          </div>
          <div style={{ display: "flex", gap: 24 }}>
            {[["GitHub", "https://github.com/agenticpoa/apoa"], ["Spec", "https://github.com/agenticpoa/apoa/blob/main/SPEC.md"], ["Examples", "https://github.com/agenticpoa/apoa/blob/main/EXAMPLES.md"]].map(([l, h]) => (
              <a key={l} href={h} style={{ fontSize: 13, color: "var(--tertiary)", textDecoration: "none" }}>{l}</a>
            ))}
          </div>
        </div>
        <p style={{ fontSize: 11, color: "#c4bdb0", marginTop: 24 }}>Apache 2.0 · agenticpoa.com · agenticpowerofattorney.com</p>
      </div>
    </footer>
  );
}

export default function App() {
  return (
    <div style={{
      background: "#fcf9f4", color: "#1a1714",
      fontFamily: "'DM Sans', -apple-system, BlinkMacSystemFont, sans-serif",
      WebkitFontSmoothing: "antialiased", minHeight: "100vh",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Source+Serif+4:wght@400;600;700&family=DM+Sans:opsz,wght@9..40,400;9..40,450;9..40,500;9..40,550;9..40,600;9..40,700&family=JetBrains+Mono:wght@400;500;600&display=swap');
        :root {
          --serif: 'Source Serif 4', Georgia, serif;
          --sans: 'DM Sans', -apple-system, sans-serif;
          --mono: 'JetBrains Mono', monospace;
          --bg: #fcf9f4;
          --primary: #1a1714;
          --secondary: #5c564c;
          --tertiary: #918980;
          --accent: #a35810;
        }
        *, *::before, *::after { box-sizing: border-box; margin: 0; }
        body, html { background: #fcf9f4 !important; }
        ::selection { background: #a35810; color: #fff; }
        html { scroll-behavior: smooth; }
        section[id] { scroll-margin-top: 72px; }
        .ref-chip:hover { background: #e8e0d2; color: var(--secondary); }
        @media (max-width: 768px) {
          .nav-links a:not(:last-child) { display: none !important; }
          .responsive-grid-4 { grid-template-columns: 1fr 1fr !important; }
          .responsive-grid-3 { grid-template-columns: 1fr !important; }
          .responsive-grid-2 { grid-template-columns: 1fr !important; }
          table { font-size: 12px !important; }
          table th, table td { padding: 8px 6px !important; }
        }
      `}</style>
      <Nav />
      <main>
        <Hero />
        <CodeBlock />
        <ProblemSection />
        <HowSection />
        <IntegrationSection />
        <ScenariosSection />
        <ShippedSection />
        <VisionSection />
        <ComparisonSection />
        <CTASection />
        <Footer />
      </main>
    </div>
  );
}
