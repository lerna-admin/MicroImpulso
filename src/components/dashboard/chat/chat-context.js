"use client";

import * as React from "react";

import { useAuth } from "@/components/auth/custom/auth-context";
import { useAutoRefresh } from "@/app/dashboard/chat/hooks/use-auto-refresh"

function noop() {
	// No operation
}

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
	const { user } = useAuth();
	const [contacts, setContacts] = React.useState([]);
	const [threads, setThreads] = React.useState([]);
	const [messages, setMessages] = React.useState(new Map());
	const [openDesktopSidebar, setOpenDesktopSidebar] = React.useState(true);
	const [openMobileSidebar, setOpenMobileSidebar] = React.useState(false);
	const [openDesktopSidebarRight, setOpenDesktopSidebarRight] = React.useState(false);
	const [openMobileSidebarRight, setOpenMobileSidebarRight] = React.useState(false);

	React.useEffect(() => {
		setContacts(initialContacts);
	}, [initialContacts]);

	React.useEffect(() => {
		setThreads(initialLabels);
	}, [initialLabels]);

	React.useEffect(() => {
		setMessages(
			initialMessages.reduce((acc, curr) => {
				const byThread = acc.get(curr.threadId) ?? [];
				// We unshift the message to ensure the messages are sorted by date
				byThread.unshift(curr);
				acc.set(curr.threadId, byThread);
				return acc;
			}, new Map())
		);
	}, [initialMessages]);

	const handleCreateThread = React.useCallback(
		(params) => {
			// Authenticated user
			const userId = "USR-001";

			// Check if the thread already exists
			let thread = threads.find((thread) => {
				if (params.type === "direct") {
					if (thread.type !== "direct") {
						return false;
					}

					return thread.participants
						.filter((participant) => participant.id !== userId)
						.find((participant) => participant.id === params.recipientId);
				}

				if (thread.type !== "group") {
					return false;
				}

				const recipientIds = thread.participants
					.filter((participant) => participant.id !== userId)
					.map((participant) => participant.id);

				if (params.recipientIds.length !== recipientIds.length) {
					return false;
				}

				return params.recipientIds.every((recipientId) => recipientIds.includes(recipientId));
			});

			if (thread) {
				return thread.id;
			}

			// Create a new thread

			const participants = [{ id: "USR-000", name: "Sofia Rivers", avatar: "/assets/avatar.png" }];

			if (params.type === "direct") {
				const contact = contacts.find((contact) => contact.id === params.recipientId);

				if (!contact) {
					throw new Error(`Contact with id "${params.recipientId}" not found`);
				}

				participants.push({ id: contact.id, name: contact.name, avatar: contact.avatar });
			} else {
				for (const recipientId of params.recipientIds) {
					const contact = contacts.find((contact) => contact.id === recipientId);

					if (!contact) {
						throw new Error(`Contact with id "${recipientId}" not found`);
					}

					participants.push({ id: contact.id, name: contact.name, avatar: contact.avatar });
				}
			}

			thread = { id: `TRD-${Date.now()}`, type: params.type, participants, unreadCount: 0 };

			// Add it to the threads
			const updatedThreads = [thread, ...threads];

			// Dispatch threads update
			setThreads(updatedThreads);

			return thread.id;
		},
		[contacts, threads]
	);

	const handleMarkAsRead = React.useCallback(
		(threadId) => {
			const thread = threads.find((thread) => thread.id === threadId);

			if (!thread) {
				// Thread might no longer exist
				return;
			}

			const updatedThreads = threads.map((threadToUpdate) => {
				if (threadToUpdate.id !== threadId) {
					return threadToUpdate;
				}

				return { ...threadToUpdate, unreadCount: 0 };
			});

			// Dispatch threads update
			setThreads(updatedThreads);
		},
		[threads]
	);

	const handleCreateMessage = React.useCallback(
		async (params) => {
			const { participants } = threads.find((thread) => thread.id === params.threadId);

			const resp = await fetch("/dashboard/chat/send", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					clientId: participants[1].id,
					message: params.content,
				}),
			});

			if (resp.sucess === false) {
				console.error("Ocurrio un error");
			} else {
				const message = {
					id: `MSG-${Date.now()}`,
					threadId: params.threadId,
					type: params.type,
					author: { id: user.id, name: user.name },
					content: params.content,
					direction: "OUTGOING",
					createdAt: new Date(),
				};

				const updatedMessages = new Map(messages);

				// Add it to the messages
				if (updatedMessages.has(params.threadId)) {
					updatedMessages.set(params.threadId, [...updatedMessages.get(params.threadId), message]);
				} else {
					updatedMessages.set(params.threadId, [message]);
				}

				// Dispatch messages update
				setMessages(updatedMessages);
			}
		},
		[messages]
	);

	const handleUpdateContact = React.useCallback((updatedContact) => {
		setContacts((prevContacts) =>
			prevContacts.map((contact) => (contact.id === updatedContact.id ? { ...contact, ...updatedContact } : contact))
		);
	}, []);
	useAutoRefresh(10000)

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
