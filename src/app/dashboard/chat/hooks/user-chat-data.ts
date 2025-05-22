"use client";

import { useEffect, useState } from "react";

export function useChatData(agentId: number, refreshMs = 10000) {
  const [contacts, setContacts] = useState([]);
  const [threads, setThreads] = useState([]);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let threadCounter = 1;

    const fetchData = async () => {
      try {
        const res = await fetch(`/api/chat/agent/${agentId}/conversations`, {
          cache: "no-store",
        });
        const data = await res.json();

        setContacts(data.map(({ client }) => client));

        const newMessages = data.flatMap((entry) => {
          const threadId = `TRD-${String(threadCounter++).padStart(3, "0")}`;
          return entry.messages.map((msg) => ({
            id: msg.id,
            threadId,
            type: "text",
            content: msg.content,
            direction: msg.direction,
            author: {
              id: msg.direction === "INCOMING" ? `USR-${entry.client.id}` : agentId,
              name: msg.direction === "INCOMING" ? entry.client.name : "Tú",
            },
            createdAt: new Date(msg.createdAt),
          }));
        });

        setMessages(newMessages);

        const newThreads = data.map(({ client }, index) => ({
          id: `TRD-00${index + 1}`,
          type: "direct",
          participants: [
            { id: agentId, name: "Tú" },
            { id: client.id, name: client.name },
          ],
        }));

        setThreads(newThreads);
        setLoading(false);
      } catch (err) {
        console.error("Error loading chat data:", err);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, refreshMs);
    return () => clearInterval(interval);
  }, [agentId, refreshMs]);

  return { contacts, threads, messages, loading };
}
