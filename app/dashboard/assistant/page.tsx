"use client";

import React, { useState } from "react";
import { MessageSquare, Send, Bot, User, Sparkles } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { chatMessages, type ChatMessage } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

export default function EVAssistantPage() {
    const [messages, setMessages] = useState<ChatMessage[]>(chatMessages);
    const [inputValue, setInputValue] = useState("");

    const handleSend = () => {
        if (!inputValue.trim()) return;

        const userMessage: ChatMessage = {
            id: messages.length + 1,
            role: "user",
            content: inputValue,
            timestamp: new Date().toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
            }),
        };

        const aiResponse: ChatMessage = {
            id: messages.length + 2,
            role: "assistant",
            content:
                "Thanks for your question! As this is a demo, I can share that our AI model analyzes your driving patterns, weather conditions, and vehicle data to provide personalized recommendations. For real-time insights, the full version connects to your vehicle's telematics system.",
            timestamp: new Date().toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
            }),
        };

        setMessages((prev) => [...prev, userMessage, aiResponse]);
        setInputValue("");
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
            <div className="flex-shrink-0">
                <h2 className="text-2xl font-bold flex items-center gap-2">
                    <MessageSquare className="h-6 w-6 text-primary" />
                    EV Assistant
                </h2>
                <p className="text-muted-foreground mt-1">
                    Chat with our AI assistant for EV tips, range optimization, and more.
                </p>
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
                        <span className="h-2 w-2 bg-emerald-500 rounded-full animate-pulse" />
                        <span className="text-xs text-muted-foreground">Online</span>
                    </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
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
                                <div className="text-sm leading-relaxed whitespace-pre-wrap">
                                    {message.content}
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
                                    A
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
                            disabled={!inputValue.trim()}
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
