"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, Bot, Loader2 } from "lucide-react";
import RoadmapApiAxiosInstance from "@/app/api/axiosInstance";
import { apiRoutes } from "@/app/api/apiRoutes";
import axios from "axios";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const SYSTEM_PROMPT = `You are DevMap AI, a friendly and knowledgeable learning assistant for DevMap — a structured tech education platform.
You help learners with:
- Explaining programming concepts (HTML, CSS, JavaScript, React, Node.js, databases, etc.)
- Debugging code issues  
- Guiding them through their current roadmap milestones
- Recommending next steps in their learning journey
Keep answers concise, clear, and practical. Use code examples when helpful.`;

export default function AIChatBot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Hi! I'm DevMap AI. Ask me anything about programming concepts, your roadmap, or anything you're stuck on. 🚀",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
      setTimeout(() => inputRef.current?.focus(), 200);
    }
  }, [messages, open]);

  const sendMessage = async () => {
    const text = input.trim();
    if (!text || loading) return;

    const userMsg: Message = { role: "user", content: text };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      // Strategy 1: Try the backend API route (same server your mobile teammate uses)
      // The backend receives the message and returns { reply: "..." } or { message: "..." }
      try {
        const backendRes = await RoadmapApiAxiosInstance.post(apiRoutes.AI.chat.route, {
          message: text,
          messages: newMessages.map((m) => ({ role: m.role, content: m.content })),
          systemPrompt: SYSTEM_PROMPT,
        });

        // Handle various response shapes the backend might use
        const reply =
          backendRes.data?.reply ||
          backendRes.data?.message ||
          backendRes.data?.content ||
          backendRes.data?.response ||
          backendRes.data?.data?.reply ||
          backendRes.data?.data?.message;

        if (reply && typeof reply === "string") {
          setMessages((prev) => [...prev, { role: "assistant", content: reply }]);
          return;
        }
      } catch (backendErr: unknown) {
        // Backend route failed (404 = route doesn't exist yet, or wrong path)
        // Fall through to Next.js proxy
        const isNotFound = axios.isAxiosError(backendErr) && backendErr.response?.status === 404;
        if (!isNotFound) {
          // Non-404 error from backend — surface it
          const msg = axios.isAxiosError(backendErr)
            ? (backendErr.response?.data as any)?.message || backendErr.message
            : "Backend AI service error";
          throw new Error(msg);
        }
      }

      // Strategy 2: Fall back to our Next.js server-side Anthropic proxy
      const proxyRes = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          system: SYSTEM_PROMPT,
          messages: newMessages.map((m) => ({ role: m.role, content: m.content })),
        }),
      });

      const proxyData = await proxyRes.json();

      if (!proxyRes.ok) {
        throw new Error(proxyData?.error ?? `Request failed (${proxyRes.status})`);
      }

      const reply = proxyData?.content?.[0]?.text ?? "Sorry, I couldn't get a response. Please try again.";
      setMessages((prev) => [...prev, { role: "assistant", content: reply }]);

    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Something went wrong. Please try again.";
      setMessages((prev) => [...prev, { role: "assistant", content: message }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setOpen((prev) => !prev)}
        className={`fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full shadow-xl flex items-center justify-center transition-all duration-200 ${
          open
            ? "bg-destructive hover:bg-destructive/90 scale-90"
            : "bg-primary hover:bg-secondary scale-100 hover:scale-105"
        }`}
        aria-label="Toggle DevMap AI chat"
      >
        {open ? <X size={20} className="text-white" /> : <Bot size={22} className="text-white" />}
      </button>

      {/* Chat panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="fixed bottom-24 right-6 z-50 w-[340px] sm:w-[380px] rounded-2xl border border-border bg-card shadow-2xl flex flex-col overflow-hidden"
            style={{ maxHeight: "520px" }}
          >
            {/* Header */}
            <div className="flex items-center gap-3 px-4 py-3 bg-slate-900 dark:bg-slate-800 border-b border-white/10 shrink-0">
              <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center shrink-0">
                <Bot size={18} className="text-white" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <p className="text-sm font-semibold text-white">DevMap Ai</p>
                  <span className="text-xs">✨</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
                  <p className="text-[10px] text-green-400">Online</p>
                </div>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="ml-auto p-1 rounded-lg hover:bg-white/10 transition-colors text-white/60 hover:text-white"
              >
                <X size={15} />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 min-h-0">
              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.15 }}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  {msg.role === "assistant" && (
                    <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center mr-2 mt-0.5 shrink-0">
                      <Bot size={12} className="text-primary" />
                    </div>
                  )}
                  <div
                    className={`max-w-[80%] rounded-2xl px-3 py-2 text-sm leading-relaxed whitespace-pre-wrap break-words ${
                      msg.role === "user"
                        ? "bg-primary text-white rounded-tr-sm"
                        : "bg-muted text-foreground rounded-tl-sm"
                    }`}
                  >
                    {msg.content}
                  </div>
                </motion.div>
              ))}

              {loading && (
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                    <Bot size={12} className="text-primary" />
                  </div>
                  <div className="bg-muted rounded-2xl rounded-tl-sm px-3 py-2 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground/50 animate-bounce" style={{ animationDelay: "0ms" }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground/50 animate-bounce" style={{ animationDelay: "150ms" }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground/50 animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Footer */}
            <p className="text-center text-[10px] text-muted-foreground py-1 bg-muted/30 border-t border-border shrink-0">
              Powered by DevMap AI • CS concepts &amp; code explanations
            </p>

            {/* Input */}
            <div className="p-3 border-t border-border shrink-0">
              <div className="flex items-center gap-2 rounded-xl border border-border bg-background px-3 py-2 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20 transition-all">
                <input
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask about CS concepts..."
                  className="flex-1 text-sm bg-transparent outline-none text-foreground placeholder:text-muted-foreground"
                  disabled={loading}
                />
                <button
                  onClick={sendMessage}
                  disabled={!input.trim() || loading}
                  className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center text-white hover:bg-secondary transition-colors disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
                >
                  <Send size={13} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
