"use client";

import { useChatData } from "@/app/dashboard/chat/hooks/user-chat-data";
import { ChatProvider } from "@/components/dashboard/chat/chat-context";
import { ChatView } from "@/components/dashboard/chat/chat-view";

export function ChatLoader({ agentId, children }) {
  const { contacts, messages, threads, loading } = useChatData(agentId);

  if (loading) {
    return <div style={{ padding: 16 }}>Loading chat...</div>;
  }

  return (
    <ChatProvider contacts={contacts} messages={messages} threads={threads}>
      <ChatView>{children}</ChatView>
    </ChatProvider>
  );
}
