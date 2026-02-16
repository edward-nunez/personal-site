import projectCover1 from "@/assets/project-cover-1.jpg";
import projectCover2 from "@/assets/project-cover-2.jpg";
import projectCover3 from "@/assets/project-cover-3.jpg";
import projectCover4 from "@/assets/project-cover-4.jpg";
import projectCover5 from "@/assets/project-cover-5.jpg";
import projectCover6 from "@/assets/project-cover-6.jpg";

export interface ProjectContentBlock {
  type: "heading" | "paragraph" | "code" | "blockquote" | "list";
  text: string;
  language?: string;
  items?: string[];
}

export interface Project {
  chapter: string;
  title: string;
  slug: string;
  description: string;
  tech: string[];
  status: "COMPLETE" | "ONGOING";
  role: string;
  duration: string;
  highlights: string[];
  coverImage: string;
  content: ProjectContentBlock[];
}

export const projects: Project[] = [
  {
    chapter: "Ch.01",
    title: "Distributed Event Platform",
    slug: "distributed-event-platform",
    description:
      "Event-driven architecture processing 2M+ messages/day with fault-tolerant pipelines and real-time dashboards.",
    tech: ["Kafka", "React", "Go", "PostgreSQL"],
    status: "COMPLETE",
    role: "Lead Systems Architect",
    duration: "14 months",
    coverImage: projectCover1,
    highlights: [
      "Scaled from 200K to 2M+ messages/day without downtime",
      "Reduced P99 latency from 850ms to 120ms",
      "Zero-downtime deployment pipeline with canary releases",
      "Real-time monitoring dashboards with sub-second refresh",
    ],
    content: [
      { type: "heading", text: "The Problem" },
      {
        type: "paragraph",
        text: "The existing monolithic message processor was hitting its ceiling. At 200K messages per day, queue depths were growing, consumers were falling behind, and the on-call rotation was becoming a test of endurance rather than engineering.",
      },
      {
        type: "blockquote",
        text: "The best monitoring system is the one that never pages you — because the architecture handles failures before they become incidents.",
      },
      { type: "heading", text: "Architecture" },
      {
        type: "paragraph",
        text: "We decomposed the monolith into a pipeline of stateless Go services communicating through Kafka topics. Each service owns a single transformation — validation, enrichment, routing, persistence.",
      },
      { type: "heading", text: "Results" },
      {
        type: "paragraph",
        text: "The platform now processes over 2 million messages daily with a P99 latency of 120ms. The on-call team hasn't been paged for a pipeline issue in four months.",
      },
    ],
  },
  {
    chapter: "Ch.02",
    title: "Fleet Telemetry System",
    slug: "fleet-telemetry-system",
    description:
      "IoT platform ingesting vehicle telemetry data — GPS, OBD-II diagnostics, and predictive maintenance alerts.",
    tech: ["TypeScript", "TimescaleDB", "MQTT", "D3.js"],
    status: "COMPLETE",
    role: "Full-Stack Engineer",
    duration: "10 months",
    coverImage: projectCover2,
    highlights: [
      "Ingesting telemetry from 3,000+ vehicles in real-time",
      "Predictive maintenance reduced unplanned downtime by 40%",
      "Custom D3 visualizations for fleet health dashboards",
      "MQTT-based protocol handling 50K messages/minute",
    ],
    content: [
      { type: "heading", text: "The Challenge" },
      {
        type: "paragraph",
        text: "Fleet operators were flying blind. Vehicle health data existed but was siloed in OBD-II dongles, GPS trackers, and driver reports. The goal: ingest everything, correlate signals, and predict failures before they strand a driver.",
      },
      {
        type: "blockquote",
        text: "A sensor reading in isolation is noise. Correlated sensor readings over time are intelligence.",
      },
      { type: "heading", text: "Predictive Maintenance" },
      {
        type: "paragraph",
        text: "The maintenance engine applies rolling-window analysis over TimescaleDB continuous aggregates. Coolant temperature trending 8% above its 30-day baseline? Flag for inspection. Simple rules applied consistently across thousands of vehicles reduced unplanned downtime by 40%.",
      },
    ],
  },
  {
    chapter: "Ch.03",
    title: "Trail Mapping App",
    slug: "trail-mapping-app",
    description:
      "MTB trail discovery platform with GPS tracking, elevation profiles, condition reporting, and community features.",
    tech: ["React Native", "Mapbox", "GraphQL", "Firebase"],
    status: "COMPLETE",
    role: "Co-Founder & Lead Developer",
    duration: "8 months",
    coverImage: projectCover3,
    highlights: [
      "5,000+ trails mapped with crowd-sourced condition data",
      "Real-time GPS tracking with offline map support",
      "Elevation profile rendering with grade calculations",
      "Community ratings and trail condition reporting",
    ],
    content: [
      { type: "heading", text: "Origin Story" },
      {
        type: "paragraph",
        text: "Born from frustration on a ride. Showed up to a trailhead after an hour's drive only to find it closed for logging. So I built the thing I wished existed — a trail platform where riders report real conditions in real time.",
      },
      {
        type: "blockquote",
        text: "The best product ideas come from scratching your own itch with enough skill to build the solution.",
      },
      { type: "heading", text: "Offline-First Architecture" },
      {
        type: "paragraph",
        text: "Mountain bikers ride in places with no cell signal. The app had to work offline from day one. Map tiles are pre-cached by region. GPS tracks record locally and sync when connectivity returns.",
      },
      { type: "heading", text: "Community & Growth" },
      {
        type: "paragraph",
        text: "The community features transformed a utility into a platform. Over 5,000 trails mapped with fresh condition data that no competitor could match without the same engaged user base.",
      },
    ],
  },
  {
    chapter: "Ch.04",
    title: "Infra-as-Code Toolkit",
    slug: "infra-as-code-toolkit",
    description:
      "CLI toolkit for declarative infrastructure provisioning, drift detection, and automated rollback strategies.",
    tech: ["Rust", "Terraform", "Docker", "Shell"],
    status: "ONGOING",
    role: "Solo Developer",
    duration: "6 months (ongoing)",
    coverImage: projectCover4,
    highlights: [
      "Declarative YAML-based infrastructure definitions",
      "Drift detection with automatic remediation options",
      "Rollback strategies with state snapshot management",
      "50% faster provisioning vs raw Terraform for common patterns",
    ],
    content: [
      { type: "heading", text: "Motivation" },
      {
        type: "paragraph",
        text: "Terraform is powerful but verbose. Common infrastructure patterns require hundreds of lines of HCL that vary only slightly between projects. This toolkit wraps Terraform with opinionated, composable modules defined in concise YAML.",
      },
      {
        type: "blockquote",
        text: "Abstractions should eliminate toil, not hide complexity. Good infra tooling makes the simple things trivial and the complex things possible.",
      },
      { type: "heading", text: "Drift Detection" },
      {
        type: "paragraph",
        text: "Infrastructure drift is the silent killer. The toolkit runs continuous drift detection — comparing declared YAML against live infrastructure and flagging discrepancies with recommended remediation actions.",
      },
    ],
  },
  {
    chapter: "Ch.05",
    title: "API Gateway & Rate Limiter",
    slug: "api-gateway-rate-limiter",
    description:
      "High-performance API gateway with token-bucket rate limiting, request coalescing, and circuit breaker patterns.",
    tech: ["Go", "Redis", "gRPC", "Prometheus"],
    status: "COMPLETE",
    role: "Backend Engineer",
    duration: "7 months",
    coverImage: projectCover5,
    highlights: [
      "Sub-millisecond rate limit checks via Redis",
      "Request coalescing reduced upstream load by 60%",
      "Circuit breaker prevents cascade failures",
      "Handles 100K+ requests/second per node",
    ],
    content: [
      { type: "heading", text: "The Gateway Problem" },
      {
        type: "paragraph",
        text: "As the microservice fleet grew, every service was reimplementing authentication, rate limiting, and retry logic. The gateway centralizes cross-cutting concerns, letting services focus on business logic.",
      },
      {
        type: "blockquote",
        text: "Every service re-implementing auth is like every rider carrying a full toolkit — shared infrastructure exists for a reason.",
      },
      { type: "heading", text: "Token Bucket at Scale" },
      {
        type: "paragraph",
        text: "The rate limiter uses a distributed token bucket backed by Redis. Lua scripts ensure atomic check-and-decrement operations. Per-tenant and per-endpoint limits are configurable via a control plane, with real-time adjustment without restarts.",
      },
      { type: "heading", text: "Request Coalescing" },
      {
        type: "paragraph",
        text: "When multiple clients request the same resource simultaneously, the gateway coalesces them into a single upstream call. This reduced backend load by 60% for popular endpoints and eliminated thundering herd problems during cache expiration.",
      },
    ],
  },
  {
    chapter: "Ch.06",
    title: "Design System & Component Library",
    slug: "design-system-component-library",
    description:
      "Enterprise-grade design system with 60+ components, theme engine, accessibility baked in, and automated visual regression testing.",
    tech: ["React", "TypeScript", "Storybook", "Chromatic"],
    status: "ONGOING",
    role: "Frontend Architect",
    duration: "12 months (ongoing)",
    coverImage: projectCover6,
    highlights: [
      "60+ production-ready components with full a11y",
      "Theme engine supporting white-label deployments",
      "Automated visual regression testing via Chromatic",
      "Adopted by 8 product teams across the organization",
    ],
    content: [
      { type: "heading", text: "Why Build Your Own?" },
      {
        type: "paragraph",
        text: "Off-the-shelf component libraries get you 80% there. The last 20% — brand consistency, complex interaction patterns, white-label theming — is where custom design systems earn their cost. When eight product teams need to ship cohesive UIs, a shared system saves thousands of hours.",
      },
      {
        type: "blockquote",
        text: "A design system is a product serving products. Treat it with the same rigor you'd give a public API.",
      },
      { type: "heading", text: "The Theme Engine" },
      {
        type: "paragraph",
        text: "The theme engine uses CSS custom properties with a TypeScript configuration layer. Switching from Brand A to Brand B changes every color, radius, shadow, and typography scale without touching component code. White-label deployments went from weeks of custom CSS to a single config file.",
      },
      { type: "heading", text: "Visual Regression Testing" },
      {
        type: "paragraph",
        text: "Every PR runs automated visual comparisons via Chromatic. Component screenshots are compared pixel-by-pixel against baselines. This catches unintended visual changes before they reach production — the design equivalent of unit tests for your UI.",
      },
    ],
  },
  {
    chapter: "Ch.07",
    title: "Edge Cache Orchestrator",
    slug: "edge-cache-orchestrator",
    description:
      "Intelligent CDN cache invalidation layer that coordinates edge nodes across 12 regions with sub-second propagation.",
    tech: ["Rust", "Redis", "Cloudflare Workers", "Prometheus"],
    status: "ONGOING",
    role: "Backend Engineer",
    duration: "4 months",
    coverImage: "",
    highlights: [
      "Cache hit ratio improved from 72% to 94%",
      "Invalidation propagation under 800ms globally",
      "Automated purge policies based on content signatures",
      "Zero stale-content incidents since deployment",
    ],
    content: [
      { type: "heading", text: "The Challenge" },
      {
        type: "paragraph",
        text: "Stale cache serving was costing real money — outdated pricing pages, old product images, mismatched inventory counts. The existing TTL-based approach was too blunt for content that changes unpredictably.",
      },
      {
        type: "blockquote",
        text: "A cache that serves stale data isn't a performance optimization — it's a liability with a countdown timer.",
      },
      { type: "heading", text: "Solution" },
      {
        type: "paragraph",
        text: "We built a coordination layer in Rust that watches for content mutations and fans out targeted invalidation commands to edge nodes. Each piece of content gets a signature hash; when the hash changes, only affected cache keys are purged.",
      },
    ],
  },
];
