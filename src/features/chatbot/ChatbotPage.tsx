import { useState } from "react";
import { Sparkles, Zap } from "lucide-react";
import { ContextLabel } from "@/components/common/ContextLabel";
import { PageTitle } from "@/components/common/PageTitle";
import { ChatMessage, SuggestionChips, ChatInput } from "./components";
import type { ChatMessageData } from "./components/ChatMessage";
import type { SuggestionChip } from "./components/SuggestionChips";

// Simulates data fetched from API
const initialMessages: ChatMessageData[] = [
  {
    id: "1",
    role: "ai",
    content: "Hi! I'm your Foxio assistant. How can I help you get started today?",
  },
  {
    id: "2",
    role: "user",
    content: "How do I set up automation?",
  },
  {
    id: "3",
    role: "ai",
    content: "Here's how to set up your first automation:",
    steps: [
      { number: 1, text: "Navigate to Settings from the dashboard sidebar." },
      { number: 2, text: "Click \"New Automation\" and choose a trigger event." },
      { number: 3, text: "Configure your action steps and save the workflow." },
    ],
    action: { label: "Open automation setup", icon: <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5" /> },
  },
];

const suggestions: SuggestionChip[] = [
  { id: "1", label: "How do I connect?", icon: <Zap className="w-3 h-3" /> },
  { id: "2", label: "Show shortcuts", icon: <Sparkles className="w-3 h-3" /> },
];

export function ChatbotPage() {
  const [messages, setMessages] = useState<ChatMessageData[]>(initialMessages);

  const handleSend = (text: string) => {
    const userMsg: ChatMessageData = {
      id: Date.now().toString(),
      role: "user",
      content: text,
    };
    setMessages((prev) => [...prev, userMsg]);
  };

  const handleSuggestion = (chip: SuggestionChip) => {
    handleSend(chip.label);
  };

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto space-y-4">
        <PageTitle name="Chatbot" />
        <ContextLabel
          text="Currently viewing: Getting Started Guide"
          onDismiss={() => {}}
        />

        <div className="space-y-3 sm:space-y-4">
          {messages.map((msg) => (
            <ChatMessage key={msg.id} message={msg} />
          ))}
        </div>
      </div>

      {/* Footer: Suggestions + Input */}
      <div className="shrink-0 border-t border-border/50 pt-3 space-y-2">
        <SuggestionChips chips={suggestions} onSelect={handleSuggestion} />
        <ChatInput onSend={handleSend} />
      </div>
    </div>
  );
}
