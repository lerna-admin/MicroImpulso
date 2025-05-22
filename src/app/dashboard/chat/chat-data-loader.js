"use client";
import { useEffect, useState } from "react";
import { ChatProvider } from "@/components/dashboard/chat/chat-context";

export function ChatDataLoader({ agentId, children }) {
  const [contacts, setContacts] = useState([]);
  const [messages, setMessages] = useState([]);
  const [threads, setThreads] = useState([]);

  useEffect(() => {
    let threadCounter = 1;

    const load = async () => {
      const res = await fetch(`/api/chat/agent/${agentId}/conversations`, {
        cache: "no-store",
      });

      const resp = await res.json();

      setContacts(resp.map(({ client }) => client));

      setMessages(
        resp.flatMap((entry) => {
          const threadId = `TRD-${String(threadCounter++).padStart(3, "0")}`;
          return entry.messages.map((msg) => ({
            id: msg.id,
            threadId: threadId,
            type: "text",
            content: msg.content,
            direction: msg.direction,
            author: {
              id: msg.direction === "INCOMING" ? `USR-${msg.client.id}` : agentId,
              name: msg.direction === "INCOMING" ? msg.client.name || "Sin nombre" : "Tú",
            },
            createdAt: new Date(msg.createdAt),
          }));
        })
      );

      setThreads(
        resp.map(({ client }, index) => ({
          id: `TRD-00${index + 1}`,
          type: "direct",
          participants: [
            { id: agentId, name: "Tú" },
            { id: client.id, name: client.name },
          ],
        }))
      );
    };

    load();
    const interval = setInterval(load, 10000); // cada 10s
    return () => clearInterval(interval);
  }, [agentId]);

  return (
    <ChatProvider contacts={contacts} messages={messages} threads={threads}>
      {children}
    </ChatProvider>
  );
}
