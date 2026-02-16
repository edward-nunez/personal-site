import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const MOCK_RESPONSES: Record<string, string> = {
  experience:
    "I have 8+ years of experience in systems architecture and full-stack engineering. I've led teams building distributed event platforms processing 2M+ messages/day, IoT telemetry systems for 3,000+ vehicle fleets, and developer tooling adopted across entire organizations. My core strengths are in Go, TypeScript, React, Kafka, and infrastructure-as-code.",
  skills:
    "My primary toolkit includes Go and TypeScript for backend services, React for frontend, Kafka for event streaming, PostgreSQL and TimescaleDB for data, Docker/Terraform for infrastructure, and Prometheus/Grafana for observability. I'm also proficient in Rust, GraphQL, and gRPC.",
  projects:
    "My notable projects include: a distributed event platform (Kafka + Go, 2M msgs/day), a fleet telemetry system (MQTT + TimescaleDB, 3K vehicles), a trail mapping app (React Native + Mapbox), an infra-as-code CLI toolkit (Rust + Terraform), an API gateway with rate limiting (Go + Redis), and an enterprise design system (React + Storybook, 60+ components).",
  architecture:
    "I specialize in event-driven architectures, microservice decomposition, and distributed systems design. I'm a strong advocate for starting with well-structured monoliths and extracting services along natural domain boundaries only when scaling needs justify the complexity.",
  leadership:
    "I've led cross-functional teams of 4-12 engineers, established engineering standards, run architecture review boards, and mentored junior developers. I believe in servant leadership — removing blockers, providing context, and creating environments where engineers can do their best work.",
  education:
    "I hold a B.S. in Computer Science with a focus on distributed systems. I'm a continuous learner — I read extensively on system design, contribute to open-source projects, and maintain a technical blog exploring the intersection of engineering and real-world analogies.",
  default:
    "That's a great question! I'd be happy to discuss that in more detail. Feel free to ask about my experience, technical skills, specific projects, architecture philosophy, leadership approach, or anything else about my background.",
};

function getMockResponse(input: string): string {
  const lower = input.toLowerCase();
  if (lower.includes("experience") || lower.includes("background") || lower.includes("years"))
    return MOCK_RESPONSES.experience;
  if (lower.includes("skill") || lower.includes("tech") || lower.includes("stack") || lower.includes("language"))
    return MOCK_RESPONSES.skills;
  if (lower.includes("project") || lower.includes("built") || lower.includes("portfolio") || lower.includes("work"))
    return MOCK_RESPONSES.projects;
  if (lower.includes("architect") || lower.includes("design") || lower.includes("system") || lower.includes("approach"))
    return MOCK_RESPONSES.architecture;
  if (lower.includes("lead") || lower.includes("team") || lower.includes("manage") || lower.includes("mentor"))
    return MOCK_RESPONSES.leadership;
  if (lower.includes("educat") || lower.includes("degree") || lower.includes("learn") || lower.includes("study"))
    return MOCK_RESPONSES.education;
  return MOCK_RESPONSES.default;
}

interface AskAIModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AskAIModal = ({ isOpen, onClose }: AskAIModalProps) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Hey! I'm the AI assistant for this portfolio. Ask me anything about experience, skills, projects, or architecture philosophy. What would you like to know?",
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const handleSend = () => {
    if (!input.trim() || isTyping) return;
    const userMsg: Message = { role: "user", content: input.trim() };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    setTimeout(() => {
      const response = getMockResponse(userMsg.content);
      setMessages((prev) => [...prev, { role: "assistant", content: response }]);
      setIsTyping(false);
    }, 800 + Math.random() * 600);
  };

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="ai-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 50,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {/* Backdrop */}
          <div
            onClick={onClose}
            style={{ position: "absolute", inset: 0 }}
            className="bg-foreground/20 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.95 }}
            transition={{ duration: 0.2 }}
            style={{
              position: "relative",
              zIndex: 1,
              width: "min(480px, calc(100vw - 2rem))",
              height: "min(720px, calc(100vh - 4rem))",
            }}
            className="flex flex-col manga-panel-thick bg-background overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-3 border-b-[3px] border-foreground halftone">
              <div className="flex items-center gap-2">
                <span className="text-accent font-mono text-sm font-bold">⚡</span>
                <span className="font-mono text-sm font-bold tracking-wider">ASK_AI</span>
              </div>
              <button
                onClick={onClose}
                className="font-mono text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                [✕]
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[85%] px-4 py-3 text-sm leading-relaxed ${
                      msg.role === "user"
                        ? "bg-accent text-accent-foreground manga-panel"
                        : "bg-secondary text-secondary-foreground manga-panel"
                    }`}
                  >
                    {msg.content}
                  </div>
                </motion.div>
              ))}

              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-secondary text-muted-foreground manga-panel px-4 py-3 text-sm font-mono">
                    <span className="animate-pulse">thinking...</span>
                  </div>
                </div>
              )}
              <div ref={bottomRef} />
            </div>

            {/* Input */}
            <div className="border-t-[3px] border-foreground p-3">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSend()}
                  placeholder="Ask about experience, skills, projects..."
                  className="flex-1 bg-card manga-panel px-3 py-2 text-sm font-mono text-foreground placeholder:text-muted-foreground focus:outline-none"
                />
                <button
                  onClick={handleSend}
                  disabled={!input.trim() || isTyping}
                  className="manga-panel bg-accent text-accent-foreground px-4 py-2 font-mono text-xs font-bold tracking-wider hover:manga-shadow-accent hover:-translate-x-[2px] hover:-translate-y-[2px] transition-all duration-150 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:translate-x-0 disabled:hover:translate-y-0 disabled:hover:shadow-none"
                >
                  SEND
                </button>
              </div>
              <p className="font-mono text-[10px] text-muted-foreground mt-2 text-center">
                Mock AI — responses are pre-configured for demo purposes
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
};

export default AskAIModal;
