"use client";

import React, { useState, useEffect, useRef } from "react";
import { MessageSquare, Send, Bot, Sparkles, PlusCircle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { type ChatMessage } from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import { askEVAssistant } from "@/lib/evAssistant";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export default function EVAssistantPage() {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [inputValue, setInputValue] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isMounted, setIsMounted] = useState(false);
    const messagesScrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const el = messagesScrollRef.current;
        if (!el) return;

        const scrollToBottom = () => {
            el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
        };

        scrollToBottom();
        const raf = requestAnimationFrame(() => {
            requestAnimationFrame(scrollToBottom);
        });
        const t = setTimeout(scrollToBottom, 120);
        return () => {
            cancelAnimationFrame(raf);
            clearTimeout(t);
        };
    }, [messages, isLoading]);

    useEffect(() => {
        setIsMounted(true);
        const saved = localStorage.getItem("ev_chat_history");
        if (saved) {
            try {
                setMessages(JSON.parse(saved));
            } catch (e) {
                console.error("Failed to parse chat history", e);
            }
        } else {
            setMessages([
                {
                    id: Date.now(),
                    role: "assistant",
                    content: "Hello Raj! I'm your personalized EV Assistant. How can I help you today?",
                    timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
                }
            ]);
        }
    }, []);

    useEffect(() => {
        if (isMounted && messages.length > 0) {
            localStorage.setItem("ev_chat_history", JSON.stringify(messages));
        }
    }, [messages, isMounted]);

    const handleNewChat = () => {
        localStorage.removeItem("ev_chat_history");
        setMessages([
            {
                id: Date.now(),
                role: "assistant",
                content: "Hello Raj! I'm your personalized EV Assistant. How can I help you today?",
                timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
            }
        ]);
    };

    const handleSend = async () => {
        if (!inputValue.trim() || isLoading) return;

        const userMsg = inputValue;
        const userMessage: ChatMessage = {
            id: Date.now(),
            role: "user",
            content: userMsg,
            timestamp: new Date().toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
            }),
        };

        const updatedMessages = [...messages, userMessage];
        setMessages(updatedMessages);
        setInputValue("");
        setIsLoading(true);

        try {
            // Map the history appropriately
            const historyForAi = updatedMessages.map(m => ({ role: m.role, content: m.content }));
            const aiContent = await askEVAssistant(historyForAi);
            
            const aiResponse: ChatMessage = {
                id: Date.now() + 1,
                role: "assistant",
                content: aiContent,
                timestamp: new Date().toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                }),
            };
            
            setMessages((prev) => [...prev, aiResponse]);
        } catch (error) {
            console.error("Error calling EV Assistant:", error);
            const fallback =
                "I'm having trouble connecting right now. Please try again later.";
            let content = fallback;
            if (error instanceof Error) {
                if (
                    error.message.includes("OPENAI_API_KEY") ||
                    error.message.includes("missing OPENAI")
                ) {
                    content =
                        "The assistant can’t run because **OPENAI_API_KEY** is not set on the server. Add it to **`.env.local`** (or `.env`) in the project root, then restart `npm run dev`. See `.env.example`.";
                } else if (error.message.startsWith("HTTP ")) {
                    content = `${fallback} (${error.message})`;
                } else if (error.message.length > 0 && error.message.length < 280) {
                    content = error.message;
                }
            }
            const errorResponse: ChatMessage = {
                id: Date.now() + 1,
                role: "assistant",
                content,
                timestamp: new Date().toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                }),
            };
            setMessages((prev) => [...prev, errorResponse]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <div className="space-y-6 h-[calc(100vh-10rem)] flex flex-col">
            {/* Header */}
            <div className="flex-shrink-0 flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold flex items-center gap-2">
                        <MessageSquare className="h-6 w-6 text-primary" />
                        EV Assistant
                    </h2>
                    <p className="text-muted-foreground mt-1">
                        Chat with our AI assistant for EV tips, range optimization, and more.
                    </p>
                    <p className="text-xs text-muted-foreground mt-1.5 max-w-xl">
                        Each reply uses your live app data: Profile, last Range Prediction (and derived battery
                        health when available), fuel cost comparison, and CO₂ Savings — not demo chart trends
                        from the dashboard UI.
                    </p>
                </div>
                <Button onClick={handleNewChat} variant="outline" className="gap-2">
                    <PlusCircle className="h-4 w-4" />
                    New Chat
                </Button>
            </div>

            {/* Chat Container */}
            <Card className="flex-1 flex flex-col overflow-hidden">
                {/* Chat Header */}
                <div className="p-4 border-b border-border/50 flex items-center gap-3 flex-shrink-0">
                    <div className="h-10 w-10 rounded-xl bg-primary/20 flex items-center justify-center">
                        <Bot className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                        <h3 className="font-semibold flex items-center gap-2">
                            EVlytics AI
                            <Sparkles className="h-4 w-4 text-primary" />
                        </h3>
                        <p className="text-xs text-muted-foreground">
                            Powered by Advanced EV Intelligence
                        </p>
                    </div>
                    <div className="ml-auto flex items-center gap-2">
                        <span className={cn("h-2 w-2 rounded-full animate-pulse", isLoading ? "bg-amber-500" : "bg-emerald-500")} />
                        <span className="text-xs text-muted-foreground">{isLoading ? "Typing..." : "Online"}</span>
                    </div>
                </div>

                {/* Messages */}
                <div
                    ref={messagesScrollRef}
                    className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 min-h-0"
                >
                    {messages.map((message) => (
                        <div
                            key={message.id}
                            className={cn(
                                "flex gap-3",
                                message.role === "user" ? "justify-end" : "justify-start"
                            )}
                        >
                            {message.role === "assistant" && (
                                <div className="h-8 w-8 rounded-lg bg-primary/20 flex items-center justify-center flex-shrink-0 mt-1">
                                    <Bot className="h-4 w-4 text-primary" />
                                </div>
                            )}
                            <div
                                className={cn(
                                    "max-w-[80%] sm:max-w-[70%] rounded-2xl px-4 py-3",
                                    message.role === "user"
                                        ? "bg-primary text-primary-foreground rounded-br-md"
                                        : "bg-accent/50 border border-border/50 rounded-bl-md"
                                )}
                            >
                                <div className={cn("text-sm leading-relaxed", message.role === "user" ? "whitespace-pre-wrap" : "")}>
                                    {message.role === "assistant" ? (
                                        <ReactMarkdown 
                                            remarkPlugins={[remarkGfm]}
                                            components={{
                                                p: ({node, ...props}) => <p className="mb-2 last:mb-0" {...props} />,
                                                ul: ({node, ...props}) => <ul className="list-disc pl-4 space-y-1 mb-2" {...props} />,
                                                ol: ({node, ...props}) => <ol className="list-decimal pl-4 space-y-1 mb-2" {...props} />,
                                                li: ({node, ...props}) => <li className="pl-1" {...props} />,
                                                strong: ({node, ...props}) => <strong className="font-semibold" {...props} />
                                            }}
                                        >
                                            {message.content}
                                        </ReactMarkdown>
                                    ) : (
                                        message.content
                                    )}
                                </div>
                                <p
                                    className={cn(
                                        "text-[10px] mt-2 opacity-70",
                                        message.role === "user"
                                            ? "text-primary-foreground/70"
                                            : "text-muted-foreground"
                                    )}
                                >
                                    {message.timestamp}
                                </p>
                            </div>
                            {message.role === "user" && (
                                <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary/60 to-emerald-600/60 flex items-center justify-center flex-shrink-0 mt-1 text-white text-xs font-semibold">
                                    R
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                {/* Input Area */}
                <div className="p-4 border-t border-border/50 flex-shrink-0">
                    <div className="flex items-center gap-3">
                        <Input
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="Ask about your EV..."
                            className="flex-1 bg-accent/30 border-border/50"
                        />
                        <Button
                            onClick={handleSend}
                            size="icon"
                            className="h-10 w-10 rounded-xl flex-shrink-0"
                            disabled={!inputValue.trim() || isLoading}
                        >
                            <Send className="h-4 w-4" />
                        </Button>
                    </div>
                    <p className="text-[10px] text-muted-foreground text-center mt-2">
                        EVlytics AI may produce inaccurate information. This is a demo
                        interface.
                    </p>
                </div>
            </Card>
        </div>
    );
}
