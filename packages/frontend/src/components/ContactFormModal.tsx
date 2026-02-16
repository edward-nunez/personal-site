import { useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { z } from "zod";

const contactSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100, "Name must be under 100 characters"),
  email: z.string().trim().email("Invalid email address").max(255, "Email must be under 255 characters"),
  subject: z.string().trim().max(150, "Subject must be under 150 characters").optional().default(""),
  message: z.string().trim().min(1, "Message is required").max(1000, "Message must be under 1000 characters"),
});

type ContactForm = { name: string; email: string; subject: string; message: string };

interface ContactFormModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ContactFormModal = ({ isOpen, onClose }: ContactFormModalProps) => {
  const [form, setForm] = useState<ContactForm>({ name: "", email: "", subject: "", message: "" });
  const [errors, setErrors] = useState<Partial<Record<keyof ContactForm, string>>>({});
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (field: keyof ContactForm, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSubmit = () => {
    const result = contactSchema.safeParse(form);
    if (!result.success) {
      const fieldErrors: Partial<Record<keyof ContactForm, string>> = {};
      result.error.issues.forEach((issue) => {
        const field = issue.path[0] as keyof ContactForm;
        if (!fieldErrors[field]) fieldErrors[field] = issue.message;
      });
      setErrors(fieldErrors);
      return;
    }

    const subjectLine = result.data.subject
      ? result.data.subject
      : `Contact from ${result.data.name}`;
    const subject = encodeURIComponent(subjectLine);
    const body = encodeURIComponent(
      `Name: ${result.data.name}\nEmail: ${result.data.email}\n\n${result.data.message}`
    );
    window.location.href = `mailto:hello@example.com?subject=${subject}&body=${body}`;
    setSubmitted(true);
  };

  const handleClose = () => {
    setForm({ name: "", email: "", subject: "", message: "" });
    setErrors({});
    setSubmitted(false);
    onClose();
  };

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="contact-overlay"
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
            onClick={handleClose}
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
              maxHeight: "calc(100vh - 4rem)",
            }}
            className="flex flex-col manga-panel-thick bg-background overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-3 border-b-[3px] border-foreground halftone">
              <div className="flex items-center gap-2">
                <span className="text-accent font-mono text-sm font-bold">✉</span>
                <span className="font-mono text-sm font-bold tracking-wider">SEND_EMAIL</span>
              </div>
              <button
                onClick={handleClose}
                className="font-mono text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                [✕]
              </button>
            </div>

            {submitted ? (
              <div className="p-8 text-center space-y-4">
                <span className="text-4xl">📬</span>
                <p className="font-mono text-sm text-foreground font-bold">
                  EMAIL CLIENT OPENED
                </p>
                <p className="text-sm text-muted-foreground">
                  Your message has been pre-filled in your email client. Hit send to complete!
                </p>
                <button
                  onClick={handleClose}
                  className="manga-panel bg-accent text-accent-foreground px-6 py-2 font-mono text-xs font-bold tracking-wider hover:manga-shadow-accent hover:-translate-x-[2px] hover:-translate-y-[2px] transition-all duration-150"
                >
                  CLOSE
                </button>
              </div>
            ) : (
              <>
                {/* Form */}
                <div className="p-5 space-y-4">
                  {/* Name */}
                  <div className="space-y-1">
                    <label className="font-mono text-xs text-muted-foreground tracking-wider">NAME</label>
                    <input
                      type="text"
                      value={form.name}
                      onChange={(e) => handleChange("name", e.target.value)}
                      placeholder="Your name"
                      maxLength={100}
                      className="w-full bg-card manga-panel px-3 py-2 text-sm font-mono text-foreground placeholder:text-muted-foreground focus:outline-none"
                    />
                    {errors.name && (
                      <p className="font-mono text-xs text-destructive">{errors.name}</p>
                    )}
                  </div>

                  {/* Email */}
                  <div className="space-y-1">
                    <label className="font-mono text-xs text-muted-foreground tracking-wider">EMAIL</label>
                    <input
                      type="email"
                      value={form.email}
                      onChange={(e) => handleChange("email", e.target.value)}
                      placeholder="you@example.com"
                      maxLength={255}
                      className="w-full bg-card manga-panel px-3 py-2 text-sm font-mono text-foreground placeholder:text-muted-foreground focus:outline-none"
                    />
                    {errors.email && (
                      <p className="font-mono text-xs text-destructive">{errors.email}</p>
                    )}
                  </div>

                  {/* Subject (optional) */}
                  <div className="space-y-1">
                    <label className="font-mono text-xs text-muted-foreground tracking-wider">SUBJECT <span className="text-muted-foreground/60">(optional)</span></label>
                    <input
                      type="text"
                      value={form.subject}
                      onChange={(e) => handleChange("subject", e.target.value)}
                      placeholder="What's this about?"
                      maxLength={150}
                      className="w-full bg-card manga-panel px-3 py-2 text-sm font-mono text-foreground placeholder:text-muted-foreground focus:outline-none"
                    />
                  </div>

                  {/* Message */}
                  <div className="space-y-1">
                    <label className="font-mono text-xs text-muted-foreground tracking-wider">MESSAGE</label>
                    <textarea
                      value={form.message}
                      onChange={(e) => handleChange("message", e.target.value)}
                      placeholder="What's on your mind?"
                      maxLength={1000}
                      rows={5}
                      className="w-full bg-card manga-panel px-3 py-2 text-sm font-mono text-foreground placeholder:text-muted-foreground focus:outline-none resize-none"
                    />
                    <div className="flex justify-between">
                      {errors.message ? (
                        <p className="font-mono text-xs text-destructive">{errors.message}</p>
                      ) : (
                        <span />
                      )}
                      <span className="font-mono text-[10px] text-muted-foreground">
                        {form.message.length}/1000
                      </span>
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="border-t-[3px] border-foreground p-4 flex justify-end">
                  <button
                    onClick={handleSubmit}
                    className="manga-panel bg-accent text-accent-foreground px-6 py-2 font-mono text-xs font-bold tracking-wider hover:manga-shadow-accent hover:-translate-x-[2px] hover:-translate-y-[2px] transition-all duration-150"
                  >
                    SEND( )
                  </button>
                </div>
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
};

export default ContactFormModal;
