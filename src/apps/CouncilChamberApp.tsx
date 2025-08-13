import React, { useState, useRef, useEffect, useCallback } from "react";

import type { Agent, CouncilMessage } from "../types";

const AgentAvatar: React.FC<{ agent: Agent }> = ({ agent }) => {
  const baseClasses =
    "w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white shadow-md flex-shrink-0";
  const agentStyles: Record<Agent, { initials: any; color: any }> = {
    Kairos: { initials: "K", color: "bg-blue-600" },
    Sophia: { initials: "S", color: "bg-purple-600" },
    Jordan: { initials: "J", color: "bg-green-600" },
    System: { initials: "i", color: "bg-slate-500" },
    Zero: { initials: "Z", color: "bg-gray-400" },
    Ghost: { initials: "G", color: "bg-gray-600" },
    Nya: { initials: "N", color: "bg-pink-500" },
    "Major Payne": { initials: "MP", color: "bg-red-800" },
    "Steel Core": { initials: "SC", color: "bg-gray-700" },
    "The Weaver": { initials: "W", color: "bg-teal-600" },
    "Tinker Hexbolt": { initials: "TH", color: "bg-orange-600" },
    "The Archivist": { initials: "A", color: "bg-amber-700" },
    "Aeon Indexwell": { initials: "AI", color: "bg-cyan-600" },
    "The Cartographer": { initials: "C", color: "bg-lime-600" },
    "Machine Spirit": { initials: "MS", color: "bg-stone-500" },
    Piney: { initials: "P", color: "bg-emerald-600" },
    Joyn: { initials: "JY", color: "bg-rose-600" },
    "The Technomancer": { initials: "T", color: "bg-fuchsia-600" },
  };
  const { initials, color } = agentStyles[agent];
  return <div className={`${baseClasses} ${color}`}>{initials}</div>;
};

const CouncilChamberApp: React.FC = () => {
  const [topic, setTopic] = useState("");
  const [messages, setMessages] = useState<CouncilMessage[]>([]);
  const [isDeliberating, setIsDeliberating] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleFormSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!topic.trim() || isDeliberating) return;

      setIsDeliberating(true);
      const initialMessages: CouncilMessage[] = [
        {
          agent: "System",
          text: `The council will now deliberate on: "${topic}"`,
        },
      ];
      setMessages(initialMessages);

      const deliberationGenerator = runDeliberation(topic);
      let currentMessages = [...initialMessages];

      for await (const message of deliberationGenerator) {
        if (message.agent === "System") {
          currentMessages = [...currentMessages, message];
        } else {
          currentMessages.pop(); // remove last (system) message
          currentMessages.push(message); // add new agent message
        }
        setMessages([...currentMessages]);
      }

      setTopic("");
      setIsDeliberating(false);
    },
    [topic, isDeliberating],
  );

  return (
    <div className="flex flex-col h-full bg-slate-900/80 text-slate-200 font-sans">
      <div className="flex-grow p-4 overflow-y-auto space-y-4">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex items-start gap-3 ${msg.agent === "System" ? "justify-center" : ""}`}
          >
            {msg.agent !== "System" && <AgentAvatar agent={msg.agent} />}
            <div
              className={`rounded-lg p-3 max-w-xl ${
                msg.agent === "System"
                  ? "bg-slate-700 text-slate-400 italic text-sm"
                  : "bg-slate-800 shadow-lg"
              }`}
            >
              {msg.agent !== "System" && (
                <p className="font-bold text-sm mb-1 text-cyan-400">
                  {msg.agent}
                </p>
              )}
              <p
                className="whitespace-pre-wrap text-sm leading-relaxed"
                dangerouslySetInnerHTML={{
                  __html: msg.text.replace(
                    /\*\*Verdict:(.*?)\*\*/g,
                    '<strong class="text-yellow-400 font-semibold">Verdict:$1</strong>',
                  ),
                }}
              />
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <div className="p-4 border-t border-slate-700/50 bg-slate-900">
        <form onSubmit={handleFormSubmit}>
          <div className="flex items-center space-x-2">
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder={
                isDeliberating
                  ? "Deliberation in progress..."
                  : "Enter a topic for deliberation..."
              }
              disabled={isDeliberating}
              className="flex-grow bg-slate-800 border border-slate-600 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
              aria-label="Topic for deliberation"
            />
            <button
              type="submit"
              disabled={!topic.trim() || isDeliberating}
              className="bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-600 disabled:cursor-not-allowed text-white font-bold py-2 px-4 rounded-md transition duration-200"
              aria-label="Begin Deliberation"
            >
              {isDeliberating ? "..." : "Begin"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CouncilChamberApp;
