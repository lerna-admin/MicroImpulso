"use client";

import * as React from "react";
import { getAllConversationsByAgent, sendMessageToClient } from "@/app/dashboard/chat/hooks/use-conversations";

import { useAuth } from "@/components/auth/custom/auth-context";
import { useEnableAudio } from '@/app/dashboard/chat/hooks/useEnableAudio'; // ajusta el path si es distinto


function noop() {
	// No operation placeholder
}
 function playNotificationSound() {
  const audio = new Audio('/assets/newMessage.wav');
  audio.play().catch((e) => {
    console.warn('No se pudo reproducir el sonido:', e);
  });
}

function areMessagesEqual(mapA, mapB) {
	if (mapA.size !== mapB.size) {
		playNotificationSound(); // 🔔 Diferente número de hilos
		return false;
	}

	for (const [key, msgsA] of mapA.entries()) {
		const msgsB = mapB.get(key);

		if (!msgsB || msgsA.length !== msgsB.length) {
			playNotificationSound(); 
			return false;
		}

		for (let i = 0; i < msgsA.length; i++) {
			if (msgsA[i].id !== msgsB[i].id) {
				playNotificationSound(); 
				return false;
			}
		}
	}

	return true;
}

// Initial context shape
export const ChatContext = React.createContext({
	contacts: [],
	threads: [],
	messages: new Map(),
	createThread: noop,
	markAsRead: noop,
	createMessage: noop,
	updateContact: noop,
	openDesktopSidebar: true,
	setOpenDesktopSidebar: noop,
	openMobileSidebar: true,
	setOpenMobileSidebar: noop,
	openDesktopSidebarRight: true,
	setOpenDesktopSidebarRight: noop,
	openMobileSidebarRight: true,
	setOpenMobileSidebarRight: noop,
});

export function ChatProvider({
	children,
	contacts: initialContacts = [],
	threads: initialLabels = [],
	messages: initialMessages = [],
}) {
	useEnableAudio();

	const { user } = useAuth();

	const [contacts, setContacts] = React.useState([]);
	const [threads, setThreads] = React.useState([]);
	const [messages, setMessages] = React.useState(new Map());

	const [openDesktopSidebar, setOpenDesktopSidebar] = React.useState(true);
	const [openMobileSidebar, setOpenMobileSidebar] = React.useState(false);
	const [openDesktopSidebarRight, setOpenDesktopSidebarRight] = React.useState(false);
	const [openMobileSidebarRight, setOpenMobileSidebarRight] = React.useState(false);

	// Initialize from props
	React.useEffect(() => {
		setContacts(initialContacts);
	}, [initialContacts]);

	React.useEffect(() => {
		setThreads(initialLabels);
	}, [initialLabels]);

	React.useEffect(() => {
		// Convert flat message array to Map<threadId, Message[]>
		setMessages(
			initialMessages.reduce((acc, curr) => {
				const byThread = acc.get(curr.threadId) ?? [];
				byThread.unshift(curr);
				acc.set(curr.threadId, byThread);
				return acc;
			}, new Map())
		);
	}, [initialMessages]);

	const fetchMessages = React.useCallback(async () => {
		try {
			const data = await getAllConversationsByAgent(user.id);

			const newContacts = data.map(({ client }) => client);

			const newThreads = data.map(({ client }) => ({
				id: `TRD-${client.id}`,
				type: "direct",
				participants: [
					{ id: user.id, name: user.name },
					{ id: client.id, name: client.name },
				],
			}));

			const flatMessages = data.flatMap((entry) => {
				const client = entry.client;
				const threadId = `TRD-${client.id}`;
				return (entry.messages || []).map((msg) => {
					const safeClient = msg.client ?? client;
					return {
						id: msg.id,
						threadId,
						type: "text",
						content: msg.content ?? "[Empty message]",
						direction: msg.direction,
						author: {
							id: msg.direction === "INCOMING" ? `USR-${safeClient.id}` : user.id,
							name: msg.direction === "INCOMING" ? (safeClient.name ?? "Client") : user.name,
						},
						createdAt: new Date(msg.createdAt),
					};
				});
			});

			const newMessageMap = flatMessages.reduce((acc, curr) => {
				const byThread = acc.get(curr.threadId) ?? [];
				byThread.unshift(curr);
				acc.set(curr.threadId, byThread);
				return acc;
			}, new Map());

			// Apply updates only if data changed
			setContacts((prev) => (JSON.stringify(prev) === JSON.stringify(newContacts) ? prev : newContacts));
			setThreads((prev) => (JSON.stringify(prev) === JSON.stringify(newThreads) ? prev : newThreads));
			setMessages((prev) => (areMessagesEqual(prev, newMessageMap) ? prev : newMessageMap));
		} catch (err) {
			console.error("❌ Error fetching chat data:", err);
		}
	}, [user.id, user.name]);

	React.useEffect(() => {
		if (!user?.id) return;
		fetchMessages(); // First load
		const interval = setInterval(fetchMessages, 5000);
		return () => clearInterval(interval);
	}, [fetchMessages, user?.id]);

	// Create a new thread or return existing one
	const handleCreateThread = React.useCallback(
		(params) => {
			const userId = user.id;

			let thread = threads.find((thread) => {
				if (params.type === "direct") {
					if (thread.type !== "direct") return false;
					return thread.participants.filter((p) => p.id !== userId).some((p) => p.id === params.recipientId);
				}

				if (thread.type !== "group") return false;

				const recipientIds = thread.participants.filter((p) => p.id !== userId).map((p) => p.id);

				return (
					params.recipientIds.length === recipientIds.length &&
					params.recipientIds.every((id) => recipientIds.includes(id))
				);
			});

			if (thread) return thread.id;

			const participants = [{ id: user.id, name: user.name }];

			if (params.type === "direct") {
				const contact = contacts.find((c) => c.id === params.recipientId);
				if (!contact) throw new Error(`Contact not found: ${params.recipientId}`);
				participants.push({ id: contact.id, name: contact.name });
			} else {
				for (const id of params.recipientIds) {
					const contact = contacts.find((c) => c.id === id);
					if (!contact) throw new Error(`Contact not found: ${id}`);
					participants.push({ id: contact.id, name: contact.name });
				}
			}

			thread = {
				id: `TRD-${Date.now()}`,
				type: params.type,
				participants,
				unreadCount: 0,
			};

			setThreads((prev) => [thread, ...prev]);
			return thread.id;
		},
		[contacts, threads, user]
	);

	// Mark thread as read
	const handleMarkAsRead = React.useCallback(
		(threadId) => {
			const updatedThreads = threads.map((thread) => (thread.id === threadId ? { ...thread, unreadCount: 0 } : thread));
			setThreads(updatedThreads);
		},
		[threads]
	);

	// Send a message to backend and add it to UI
	const handleCreateMessage = React.useCallback(
		async (params) => {
			const { participants } = threads.find((thread) => thread.id === params.threadId);

			const resp = await sendMessageToClient(params.content, participants[1].id);

			const newMsg = {
				id: `MSG-${Date.now()}`,
				threadId: params.threadId,
				type: params.type,
				author: { id: user.id, name: user.name },
				content: params.content,
				direction: "OUTGOING",
				createdAt: new Date(),
			};

			setMessages((prev) => {
				const updated = new Map(prev);
				const threadMsgs = updated.get(params.threadId) ?? [];
				updated.set(params.threadId, [...threadMsgs, newMsg]);
				return updated;
			});
		},
		[threads, user]
	);

	const handleUpdateContact = React.useCallback((updatedContact) => {
		setContacts((prevContacts) =>
			prevContacts.map((c) => (c.id === updatedContact.id ? { ...c, ...updatedContact } : c))
		);
	}, []);

	return (
		<ChatContext.Provider
			value={{
				contacts,
				threads,
				messages,
				createThread: handleCreateThread,
				markAsRead: handleMarkAsRead,
				createMessage: handleCreateMessage,
				updateContact: handleUpdateContact,
				openDesktopSidebar,
				setOpenDesktopSidebar,
				openMobileSidebar,
				setOpenMobileSidebar,
				openDesktopSidebarRight,
				setOpenDesktopSidebarRight,
				openMobileSidebarRight,
				setOpenMobileSidebarRight,
			}}
		>
			{children}
		</ChatContext.Provider>
	);
}
