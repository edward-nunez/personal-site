import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const ENGINEER_KEYWORDS: Record<string, string[]> = {
  languages: ["go", "golang", "typescript", "javascript", "rust", "python", "php"],
  frontend: ["react", "vue", "frontend", "front-end", "ui", "ux", "css", "tailwind", "next.js", "nextjs", "react native"],
  backend: ["node", "express", "api", "rest", "graphql", "grpc", "microservice", "backend", "back-end", "server"],
  data: ["postgresql", "postgres", "mysql", "redis", "timescaledb", "database", "sql", "nosql", "mongodb"],
  streaming: ["kafka", "event-driven", "streaming", "mqtt", "rabbitmq", "message queue", "pub/sub"],
  infra: ["docker", "kubernetes", "k8s", "terraform", "aws", "gcp", "azure", "ci/cd", "devops", "infrastructure"],
  architecture: ["distributed", "system design", "architecture", "scalable", "microservices", "event-driven", "domain-driven"],
  observability: ["prometheus", "grafana", "monitoring", "observability", "logging", "metrics", "tracing"],
  leadership: ["lead", "mentor", "manage", "team", "cross-functional", "senior", "staff", "principal", "architect"],
  testing: ["jest", "testing", "tdd", "test-driven", "unit test", "integration test", "e2e"],
};

const STRONG_THRESHOLD = 0.35;

const categoryLabels: Record<string, string> = {
  languages: "Programming Languages",
  frontend: "Frontend Development",
  backend: "Backend Services",
  data: "Databases & Data",
  streaming: "Event Streaming",
  infra: "Infrastructure & DevOps",
  architecture: "System Architecture",
  observability: "Observability",
  leadership: "Leadership & Mentoring",
  testing: "Testing",
};

const categoryMatchStatements: Record<string, string> = {
  languages: "Proficient in multiple languages listed — can hit the ground running on day one.",
  frontend: "Deep experience building performant, accessible UIs with modern frameworks.",
  backend: "Strong track record designing and shipping production backend services and APIs.",
  data: "Hands-on with the data layer — from schema design to query optimization.",
  streaming: "Built and operated real-time event pipelines in production environments.",
  infra: "Comfortable owning the full deploy pipeline, from containers to cloud infrastructure.",
  architecture: "Experienced designing systems at scale with clear domain boundaries.",
  observability: "Wired up monitoring, alerting, and tracing across distributed services.",
  leadership: "Led teams, mentored engineers, and driven cross-functional initiatives.",
  testing: "Practiced TDD and built comprehensive test suites across the stack.",
};

const categoryTransferStatements: Record<string, string> = {
  languages: "Programming fundamentals transfer directly — language ramp-up is fast.",
  frontend: "UI/UX intuition and component architecture carry over to any frontend stack.",
  backend: "API design patterns and service thinking apply regardless of specific tools.",
  data: "Data modeling and query skills are universal across database technologies.",
  streaming: "Event-driven thinking transfers well to any async or messaging system.",
  infra: "Infrastructure-as-code discipline applies to any cloud or CI/CD platform.",
  architecture: "Systems thinking and architectural judgment are tool-agnostic strengths.",
  observability: "The mindset of instrumenting and monitoring systems is broadly applicable.",
  leadership: "Team leadership and mentoring skills are fully transferable.",
  testing: "Testing discipline and quality-first thinking apply to any codebase.",
};

function assessFit(jobDescription: string) {
  const lower = jobDescription.toLowerCase();
  const matched: string[] = [];
  const unmatched: string[] = [];

  for (const [category, keywords] of Object.entries(ENGINEER_KEYWORDS)) {
    const hasMatch = keywords.some((kw) => lower.includes(kw));
    if (hasMatch) matched.push(category);
    else unmatched.push(category);
  }

  const score = matched.length / Object.keys(ENGINEER_KEYWORDS).length;
  const verdict: "strong" | "weak" = score >= STRONG_THRESHOLD ? "strong" : "weak";

  const summaries: Record<string, string> = {
    strong: `Based on this analysis, I'd recommend moving forward. There's strong alignment across ${matched.length} core skill areas including ${matched.slice(0, 3).map((m) => categoryLabels[m]).join(", ")}. The gaps noted below are areas I'm aware of and can address — they shouldn't be blockers.`,
    weak: `Honestly, this one's a stretch. Only ${matched.length} skill area${matched.length === 1 ? "" : "s"} overlap with what I bring to the table. That said, the transferable strengths below still carry weight — it depends on how flexible the role scope is.`,
  };

  return {
    score,
    verdict,
    matched,
    unmatched,
    matchedCategories: matched.map((m) => categoryLabels[m]),
    unmatchedCategories: unmatched.map((m) => categoryLabels[m]),
    summary: summaries[verdict],
  };
}

const VERDICT_STYLES = {
  strong: { label: "STRONG_FIT", color: "text-green-500", bg: "bg-green-500/10", border: "border-green-500/30" },
  weak: { label: "WEAK_FIT", color: "text-red-400", bg: "bg-red-400/10", border: "border-red-400/30" },
};

const JobFitSection = () => {
  const [jd, setJd] = useState("");
  const [result, setResult] = useState<ReturnType<typeof assessFit> | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleAnalyze = () => {
    if (!jd.trim() || isAnalyzing) return;
    setIsAnalyzing(true);
    setResult(null);

    setTimeout(() => {
      setResult(assessFit(jd));
      setIsAnalyzing(false);
    }, 1200 + Math.random() * 800);
  };

  const handleReset = () => {
    setJd("");
    setResult(null);
  };

  const verdictStyle = result ? VERDICT_STYLES[result.verdict] : null;
  const matched = result?.matched ?? [];
  const unmatched = result?.unmatched ?? [];

  return (
    <section id="job-fit" className="py-24 relative">
      <div className="absolute inset-0 speed-lines opacity-30" />
      <div className="container mx-auto px-6 lg:px-12 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <p className="font-mono text-sm text-muted-foreground tracking-widest uppercase mb-2">
            // Chapter 05
          </p>
          <h2 className="text-5xl md:text-6xl font-bold mb-4">
            FIT_CHECK<span className="text-accent">⚡</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mb-10 font-mono text-sm">
            Paste a job description below and the system will analyze alignment with core skills,
            experience domains, and technical competencies.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="w-full"
        >
          <div className="manga-panel-thick bg-card overflow-hidden">
            {/* Header */}
            <div className="px-5 py-3 border-b-[3px] border-foreground halftone flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-accent font-mono text-sm font-bold">⚙</span>
                <span className="font-mono text-sm font-bold tracking-wider">JOB_ANALYZER</span>
              </div>
              {result && (
                <button
                  onClick={handleReset}
                  className="font-mono text-xs text-muted-foreground hover:text-foreground transition-colors"
                >
                  [RESET]
                </button>
              )}
            </div>

            {/* Input area */}
            <div className="p-5 space-y-4">
              <textarea
                value={jd}
                onChange={(e) => setJd(e.target.value)}
                placeholder="Paste the full job description here..."
                maxLength={5000}
                rows={6}
                disabled={isAnalyzing}
                className="w-full bg-background manga-panel px-4 py-3 text-sm font-mono text-foreground placeholder:text-muted-foreground focus:outline-none resize-none disabled:opacity-50"
              />

              <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] text-muted-foreground">
                  {jd.length}/5000 chars — client-side keyword analysis
                </span>
                <button
                  onClick={handleAnalyze}
                  disabled={!jd.trim() || isAnalyzing}
                  className="manga-panel bg-accent text-accent-foreground px-5 py-2 font-mono text-xs font-bold tracking-wider hover:manga-shadow-accent hover:-translate-x-[2px] hover:-translate-y-[2px] transition-all duration-150 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:translate-x-0 disabled:hover:translate-y-0 disabled:hover:shadow-none"
                >
                  {isAnalyzing ? "ANALYZING..." : "ANALYZE()"}
                </button>
              </div>
            </div>

            {/* Loading state */}
            <AnimatePresence>
              {isAnalyzing && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="px-5 pb-5"
                >
                  <div className="manga-panel bg-secondary p-4">
                    <p className="font-mono text-sm text-muted-foreground animate-pulse">
                      ⚡ Scanning job description against skill matrix...
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Results */}
            <AnimatePresence>
              {result && verdictStyle && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.4 }}
                  className="border-t-[3px] border-foreground"
                >
                  <div className="p-5 space-y-5">
                    {/* Verdict badge */}
                    <div className={`manga-panel ${verdictStyle.bg} ${verdictStyle.border} border px-4 py-2 inline-block`}>
                      <span className={`font-mono text-lg font-black tracking-wider ${verdictStyle.color}`}>
                        {verdictStyle.label}
                      </span>
                    </div>

                    {/* Context-aware sections */}
                    {result.verdict === "strong" ? (
                      <>
                        {/* Strong Fit: Where I Match — top 3 with statements */}
                        {matched.length > 0 && (
                          <div className="space-y-3">
                            <p className="font-mono text-xs text-muted-foreground tracking-wider">WHERE_I_MATCH:</p>
                            <div className="space-y-2">
                              {matched.slice(0, 3).map((key) => (
                                <div key={key} className="manga-panel bg-green-500/5 border border-green-500/20 px-4 py-3">
                                  <p className="font-mono text-xs font-bold text-green-500 mb-1">✓ {categoryLabels[key]}</p>
                                  <p className="text-sm text-muted-foreground leading-relaxed">{categoryMatchStatements[key]}</p>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Strong Fit: Gaps to Note */}
                        {unmatched.length > 0 && (
                          <div className="space-y-2">
                            <p className="font-mono text-xs text-muted-foreground tracking-wider">GAPS_TO_NOTE:</p>
                            <div className="manga-panel bg-amber-500/5 border border-amber-500/20 px-4 py-3">
                              <p className="text-sm text-muted-foreground leading-relaxed">
                                No direct keyword matches for <span className="text-amber-500 font-medium">{unmatched.map((key) => categoryLabels[key]).join(", ")}</span>. These aren't dealbreakers — adjacent experience and fast ramp-up ability cover the gap.
                              </p>
                            </div>
                          </div>
                        )}
                      </>
                    ) : (
                      <>
                        {/* Weak Fit: Where I Don't Fit — top 3 with statements */}
                        {unmatched.length > 0 && (
                          <div className="space-y-3">
                            <p className="font-mono text-xs text-muted-foreground tracking-wider">WHERE_I_DONT_FIT:</p>
                            <div className="space-y-2">
                              {unmatched.slice(0, 3).map((key) => (
                                <div key={key} className="manga-panel bg-red-400/5 border border-red-400/20 px-4 py-3">
                                  <p className="font-mono text-xs font-bold text-red-400 mb-1">✗ {categoryLabels[key]}</p>
                                  <p className="text-sm text-muted-foreground leading-relaxed">
                                    This role requires expertise here that falls outside current core competencies.
                                  </p>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Weak Fit: What Transfers — with statements */}
                        {matched.length > 0 && (
                          <div className="space-y-3">
                            <p className="font-mono text-xs text-muted-foreground tracking-wider">WHAT_TRANSFERS:</p>
                            <div className="space-y-2">
                              {matched.map((key) => (
                                <div key={key} className="manga-panel bg-accent/5 border border-accent/20 px-4 py-3">
                                  <p className="font-mono text-xs font-bold text-accent mb-1">↝ {categoryLabels[key]}</p>
                                  <p className="text-sm text-muted-foreground leading-relaxed">{categoryTransferStatements[key]}</p>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </>
                    )}

                    {/* My Recommendation */}
                    <div className="space-y-2">
                      <p className="font-mono text-xs text-muted-foreground tracking-wider">MY_RECOMMENDATION:</p>
                      <p className="text-sm text-foreground leading-relaxed">{result.summary}</p>
                    </div>

                    <p className="font-mono text-[10px] text-muted-foreground text-center pt-2">
                      Demo analysis — uses client-side keyword matching, not a real LLM
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default JobFitSection;
