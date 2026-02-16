export interface ContentBlock {
  type: "heading" | "paragraph" | "code" | "blockquote";
  text: string;
  language?: string;
}

export interface BlogPost {
  volume: string;
  date: string;
  title: string;
  excerpt: string;
  tags: string[];
  readTime: string;
  slug: string;
  coverImage: string;
  content: ContentBlock[];
}

import blogCover1 from "@/assets/blog-cover-1.jpg";
import blogCover2 from "@/assets/blog-cover-2.jpg";
import blogCover3 from "@/assets/blog-cover-3.jpg";
import blogCover4 from "@/assets/blog-cover-4.jpg";
import blogCover5 from "@/assets/blog-cover-5.jpg";
import blogCover6 from "@/assets/blog-cover-6.jpg";

export const blogPosts: BlogPost[] = [
  {
    volume: "Vol.01",
    date: "2026-02-10",
    title: "System Design Like a Sport Touring Route",
    excerpt:
      "How planning a 500-mile ride through mountain passes mirrors designing fault-tolerant distributed systems.",
    tags: ["Architecture", "Moto"],
    readTime: "6 min",
    slug: "system-design-like-a-sport-touring-route",
    coverImage: blogCover1,
    content: [
      { type: "heading", text: "The Pre-Ride Brief" },
      {
        type: "paragraph",
        text: "Before any serious sport-touring run you spread the map across the garage workbench. You mark fuel stops, note elevation changes, flag unpredictable weather zones. You build in contingency — alternate routes if a pass closes, rest stops where fatigue is likeliest to hit. This ritual is indistinguishable from capacity planning a distributed system.",
      },
      {
        type: "blockquote",
        text: "A route without fallback waypoints is an outage waiting to happen — on tarmac or in production.",
      },
      { type: "heading", text: "Redundancy in Every Switchback" },
      {
        type: "paragraph",
        text: "Mountain passes don't forgive single points of failure. A sport-touring rider carries a toolkit, a rain layer, and the knowledge of where the nearest shelter sits. In system design, we call this redundancy — read replicas, multi-AZ deployments, circuit breakers. Both domains punish the unprepared with the same blunt lesson: if you haven't planned for failure, you've planned to fail.",
      },
      {
        type: "paragraph",
        text: "Consider the classic two-up touring scenario. You and your passenger represent a primary-secondary architecture. Communication is constant — lean signals through body weight, throttle modulation telegraphed through engine note. Lose that feedback loop and the system destabilizes, same as a follower that stops acknowledging heartbeat pings.",
      },
      { type: "heading", text: "Throughput vs. Latency" },
      {
        type: "paragraph",
        text: "On a long-haul day you face the eternal trade-off: push hard on the interstate (high throughput, low engagement) or carve the back roads (lower throughput, richer signal). System architects face the same choice daily. Batch processing vs. real-time streams. The right answer depends entirely on the use case — hauling miles or savoring corners.",
      },
      {
        type: "code",
        language: "typescript",
        text: `// Route planner: batch vs. stream analogy
interface RouteStrategy {
  mode: "interstate" | "backroad";
  throughput: number;   // miles per hour
  engagement: number;   // subjective 1-10
  fuelStops: number;
}

function selectStrategy(deadline: Date, distance: number): RouteStrategy {
  const hoursAvailable = (deadline.getTime() - Date.now()) / 3.6e6;
  const requiredSpeed = distance / hoursAvailable;
  
  return requiredSpeed > 65
    ? { mode: "interstate", throughput: 75, engagement: 3, fuelStops: Math.ceil(distance / 250) }
    : { mode: "backroad", throughput: 45, engagement: 9, fuelStops: Math.ceil(distance / 150) };
}`,
      },
      { type: "heading", text: "The Debrief" },
      {
        type: "paragraph",
        text: "Every great ride ends with a debrief — what went well, what nearly went sideways, what to change next time. Post-incident reviews in engineering serve the exact same purpose. The riders and engineers who improve fastest are the ones who treat every journey as a dataset, not just an experience.",
      },
    ],
  },
  {
    volume: "Vol.02",
    date: "2026-01-22",
    title: "Retrobikes & Legacy Systems",
    excerpt:
      "What restoring a '70s UJM taught me about refactoring legacy codebases without breaking everything.",
    tags: ["Engineering", "Retrobikes"],
    readTime: "8 min",
    slug: "retrobikes-and-legacy-systems",
    coverImage: blogCover2,
    content: [
      { type: "heading", text: "Finding the Barn Find" },
      {
        type: "paragraph",
        text: "Every retrobike restoration starts with archaeology. You peel back decades of questionable modifications, aftermarket hacks, and well-intentioned but poorly executed 'upgrades.' Sound familiar? Legacy codebases accumulate the same layers.",
      },
      {
        type: "blockquote",
        text: "The previous owner always had their reasons. Respect the context before you judge the code.",
      },
      { type: "heading", text: "The Strangler Fig Pattern, Garage Edition" },
      {
        type: "paragraph",
        text: "You don't strip a vintage UJM to the frame on day one. You start with what's dangerous — frayed wiring, corroded brake lines, perished tires. Then you work outward, replacing systems incrementally while keeping the bike rideable.",
      },
      {
        type: "paragraph",
        text: "The key insight from both domains: maintain a running system throughout the migration. A bike on jack stands for six months becomes a parts donor. A codebase in a perpetual rewrite branch becomes shelfware. Ship incrementally or don't ship at all.",
      },
      { type: "heading", text: "Patina Has Value" },
      {
        type: "paragraph",
        text: "Not everything old needs replacing. The patina on a vintage tank tells a story. Some legacy code is battle-tested, edge-case-hardened, and perfectly adequate. The discipline is knowing which parts to preserve and which to replace.",
      },
    ],
  },
  {
    volume: "Vol.03",
    date: "2025-12-15",
    title: "Flow State: Singletrack & Code",
    excerpt:
      "The parallels between reading trail features at speed and navigating complex system architectures.",
    tags: ["MTB", "Philosophy"],
    readTime: "5 min",
    slug: "flow-state-singletrack-and-code",
    coverImage: blogCover3,
    content: [
      { type: "heading", text: "Eyes Up, Scan Ahead" },
      {
        type: "paragraph",
        text: "The first rule of mountain biking: look where you want to go, not where you are. Fix your gaze on the obstacle and you'll hit it every time. In complex codebases the principle is identical — zoom out, understand the architecture's flow, then navigate.",
      },
      {
        type: "blockquote",
        text: "Target fixation kills on the trail and in the codebase. Look through the problem, not at it.",
      },
      { type: "heading", text: "Reading the Trail" },
      {
        type: "paragraph",
        text: "Experienced riders read terrain like a language. Root patterns, camber changes, soil transitions — each is a signal about what's coming next. Senior engineers develop the same literacy with code.",
      },
      { type: "heading", text: "Controlled Aggression" },
      {
        type: "paragraph",
        text: "The fastest riders aren't reckless — they're precisely aggressive. They commit fully to line choices but maintain the ability to adjust. In engineering, this translates to strong opinions loosely held.",
      },
    ],
  },
  {
    volume: "Vol.04",
    date: "2025-11-03",
    title: "Event-Driven Architecture in Practice",
    excerpt:
      "Building reactive systems that handle backpressure gracefully — lessons from Kafka and real-world telemetry.",
    tags: ["Kafka", "System Design"],
    readTime: "12 min",
    slug: "event-driven-architecture-in-practice",
    coverImage: blogCover4,
    content: [
      { type: "heading", text: "Why Events?" },
      {
        type: "paragraph",
        text: "Request-response architectures are the sport bikes of system design — direct, fast, purpose-built. Event-driven architectures are the adventure tourers — they handle varied terrain, carry more payload, and adapt to conditions you didn't plan for.",
      },
      {
        type: "blockquote",
        text: "If your services are chatting more than they're working, it's time to decouple with events.",
      },
      { type: "heading", text: "Backpressure: The Art of Saying 'Not Yet'" },
      {
        type: "paragraph",
        text: "Every rider knows the feeling — you're descending a technical section and the terrain is feeding you features faster than you can process them. The answer isn't to speed up; it's to modulate. Backpressure in event systems works identically.",
      },
      { type: "heading", text: "Exactly-Once: The Myth and the Practice" },
      {
        type: "paragraph",
        text: "Exactly-once delivery in distributed systems is like a perfectly clean chain — theoretically possible, practically aspirational. What we actually build is effectively-once: idempotent consumers that can safely process the same event twice without side effects.",
      },
    ],
  },
  {
    volume: "Vol.05",
    date: "2025-09-18",
    title: "Observability as a Riding Habit",
    excerpt:
      "Why instrumenting your services is like checking your mirrors — you don't notice until you stop doing it.",
    tags: ["DevOps", "Philosophy"],
    readTime: "7 min",
    slug: "observability-as-a-riding-habit",
    coverImage: blogCover5,
    content: [
      { type: "heading", text: "The Mirror Check" },
      {
        type: "paragraph",
        text: "New riders forget mirrors. Experienced riders check them reflexively — every few seconds, before every lane change, constantly building a mental model of what's behind them. Observability in production systems works the same way. Metrics, logs, and traces are your mirrors.",
      },
      {
        type: "blockquote",
        text: "You can't manage what you can't measure. You can't ride what you can't see.",
      },
      { type: "heading", text: "The Three Pillars on Two Wheels" },
      {
        type: "paragraph",
        text: "Metrics are your instrument cluster — speed, RPM, fuel level. Logs are your ride journal — detailed notes about what happened and when. Traces are your GPS track — the full path a request (or rider) took through the system. All three together give you the complete picture.",
      },
      { type: "heading", text: "Alert Fatigue is Real" },
      {
        type: "paragraph",
        text: "A motorcycle with every warning light blinking is as useful as a PagerDuty that fires on every metric wiggle. The art is in tuning thresholds — knowing which signals matter and which are noise. Instrument everything, alert selectively.",
      },
    ],
  },
  {
    volume: "Vol.06",
    date: "2025-08-05",
    title: "Writing Code That Reads Like Prose",
    excerpt:
      "Clean code isn't about cleverness — it's about empathy for the next person who reads it.",
    tags: ["Engineering", "Philosophy"],
    readTime: "6 min",
    slug: "writing-code-that-reads-like-prose",
    coverImage: blogCover6,
    content: [
      { type: "heading", text: "The Reader, Not the Writer" },
      {
        type: "paragraph",
        text: "Code is read ten times more than it's written. Every naming choice, every abstraction boundary, every comment is an act of communication with a future reader — who might be you in six months, having forgotten everything.",
      },
      {
        type: "blockquote",
        text: "Programs must be written for people to read, and only incidentally for machines to execute.",
      },
      { type: "heading", text: "Names as Documentation" },
      {
        type: "paragraph",
        text: "A function called 'process' tells you nothing. A function called 'validateAndEnrichTelemetryPayload' tells you everything. The extra keystrokes cost milliseconds; the clarity saves hours. Name things for what they do, not how they do it.",
      },
      { type: "heading", text: "The Right Level of Abstraction" },
      {
        type: "paragraph",
        text: "Too little abstraction and you're reading implementation details everywhere. Too much and you're chasing through seven layers of indirection to find the actual logic. The sweet spot is where each function reads like a paragraph in a well-structured essay.",
      },
    ],
  },
  {
    volume: "Vol.07",
    date: "2025-07-12",
    title: "Database Indexing: The Suspension Setup Analogy",
    excerpt:
      "Tuning your database indexes is remarkably similar to dialing in motorcycle suspension — both are invisible until they're wrong.",
    tags: ["Databases", "Moto"],
    readTime: "9 min",
    slug: "database-indexing-suspension-setup",
    coverImage: blogCover1,
    content: [
      { type: "heading", text: "The Default Settings Problem" },
      {
        type: "paragraph",
        text: "Every motorcycle ships with suspension settings tuned for a mythical average rider on a mythical average road. Every database ships with no indexes beyond the primary key. Both work okay until you push them — then you discover just how much performance you've been leaving on the table.",
      },
      {
        type: "blockquote",
        text: "An unindexed query on a growing table is a suspension bottoming out on every bump — it only gets worse.",
      },
      { type: "heading", text: "Compression and Rebound" },
      {
        type: "paragraph",
        text: "Suspension has two directions: compression (absorbing the hit) and rebound (recovering from it). Database reads and writes have the same duality. A covering index speeds reads but slows writes. A lean index strategy favors write throughput at the cost of query performance. You're always tuning the trade-off.",
      },
      { type: "heading", text: "Over-Indexing is Over-Damping" },
      {
        type: "paragraph",
        text: "Stiffen suspension too much and the tire loses contact with the road — you get less grip, not more. Over-index a database and writes slow to a crawl, storage bloats, and the query planner starts making bad decisions. More isn't better; correct is better.",
      },
    ],
  },
  {
    volume: "Vol.08",
    date: "2025-06-01",
    title: "Microservices: When to Split, When to Stay",
    excerpt:
      "Not every application needs microservices. The real skill is knowing when a monolith is the right bike for the road.",
    tags: ["Architecture", "Engineering"],
    readTime: "10 min",
    slug: "microservices-when-to-split",
    coverImage: blogCover4,
    content: [
      { type: "heading", text: "The Monolith Isn't the Enemy" },
      {
        type: "paragraph",
        text: "The industry spent a decade vilifying monoliths while ignoring the operational complexity that microservices bring. A well-structured monolith is like a sport-touring bike — one machine that does many things competently. Microservices are like a race team's fleet — specialized, fast, but expensive to maintain.",
      },
      {
        type: "blockquote",
        text: "If your team can't build a well-structured monolith, microservices won't save you — they'll just distribute the mess.",
      },
      { type: "heading", text: "The Split Criteria" },
      {
        type: "paragraph",
        text: "Split when you have independent scaling needs, independent deployment cadences, or genuinely separate bounded contexts with minimal data sharing. If your 'microservices' need synchronous calls to five other services to handle a single request, you've built a distributed monolith — the worst of both worlds.",
      },
      { type: "heading", text: "Start Mono, Extract Later" },
      {
        type: "paragraph",
        text: "Build the monolith first. Find the natural seams. Extract services along those seams when the pain justifies the complexity. This isn't lazy — it's strategic. You'll have better domain knowledge, clearer boundaries, and actual production data to inform your decomposition decisions.",
      },
    ],
  },
  {
    volume: "Vol.07",
    date: "2026-01-05",
    title: "Why I Stopped Chasing 100% Test Coverage",
    excerpt:
      "The diminishing returns of coverage metrics and where to invest testing effort for maximum confidence.",
    tags: ["Testing", "Opinion"],
    readTime: "5 min",
    slug: "why-i-stopped-chasing-100-percent-coverage",
    coverImage: "",
    content: [
      { type: "heading", text: "The Coverage Trap" },
      {
        type: "paragraph",
        text: "There's a seductive simplicity to coverage numbers. Green badge, high percentage, merge with confidence. But somewhere around 85% I started noticing that the tests I was writing to push toward 100% were testing implementation details, not behavior.",
      },
      {
        type: "blockquote",
        text: "A test suite that gives you confidence is worth more than one that gives you a number.",
      },
      { type: "heading", text: "Where Tests Actually Matter" },
      {
        type: "paragraph",
        text: "Integration boundaries, state transitions, error paths — these are where bugs hide and where tests earn their keep. Testing that a button has the right CSS class? That's a test that will break on every refactor and catch zero bugs.",
      },
    ],
  },
];
