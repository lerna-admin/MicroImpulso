import * as React from "react";

import { dayjs } from "@/lib/dayjs";
import { ChatProvider } from "@/components/dashboard/chat/chat-context";
import { ChatView } from "@/components/dashboard/chat/chat-view";

const contacts = [
	{
		id: "USR-010",
		name: "Alcides Antonio",
		avatar: "/assets/avatar-10.png",
		isActive: false,
		lastActivity: dayjs().subtract(1, "hour").toDate(),
	},
	{
		id: "USR-003",
		name: "Carson Darrin",
		avatar: "/assets/avatar-3.png",
		isActive: false,
		lastActivity: dayjs().subtract(15, "minute").toDate(),
	},
	{ id: "USR-005", name: "Fran Perez", avatar: "/assets/avatar-5.png", isActive: true, lastActivity: dayjs().toDate() },
	{ id: "USR-006", name: "Iulia Albu", avatar: "/assets/avatar-6.png", isActive: true, lastActivity: dayjs().toDate() },
	{ id: "USR-008", name: "Jie Yan", avatar: "/assets/avatar-8.png", isActive: true, lastActivity: dayjs().toDate() },
	{
		id: "USR-009",
		name: "Marcus Finn",
		avatar: "/assets/avatar-9.png",
		isActive: false,
		lastActivity: dayjs().subtract(2, "hour").toDate(),
	},
	{
		id: "USR-001",
		name: "Miron Vitold",
		avatar: "/assets/avatar-1.png",
		isActive: true,
		lastActivity: dayjs().toDate(),
	},
	{
		id: "USR-007",
		name: "Nasimiyu Danai",
		avatar: "/assets/avatar-7.png",
		isActive: true,
		lastActivity: dayjs().toDate(),
	},
	{
		id: "USR-011",
		name: "Omar Darobe",
		avatar: "/assets/avatar-11.png",
		isActive: true,
		lastActivity: dayjs().toDate(),
	},
	{
		id: "USR-004",
		name: "Penjani Inyene",
		avatar: "/assets/avatar-4.png",
		isActive: false,
		lastActivity: dayjs().subtract(6, "hour").toDate(),
	},
	{
		id: "USR-002",
		name: "Siegbert Gottfried",
		avatar: "/assets/avatar-2.png",
		isActive: true,
		lastActivity: dayjs().toDate(),
	},
];

const threads = [
	{
		id: "TRD-004",
		type: "direct",
		participants: [
			{ id: "USR-000", name: "Sofia Rivers", avatar: "/assets/avatar.png" },
			{ id: "USR-003", name: "Carson Darrin", avatar: "/assets/avatar-3.png" },
		],
		unreadCount: 0,
	},
	{
		id: "TRD-003",
		type: "direct",
		participants: [
			{ id: "USR-000", name: "Sofia Rivers", avatar: "/assets/avatar.png" },
			{ id: "USR-005", name: "Fran Perez", avatar: "/assets/avatar-5.png" },
		],
		unreadCount: 1,
	},
	{
		id: "TRD-002",
		type: "group",
		participants: [
			{ id: "USR-000", name: "Sofia Rivers", avatar: "/assets/avatar.png" },
			{ id: "USR-007", name: "Nasimiyu Danai", avatar: "/assets/avatar-7.png" },
			{ id: "USR-001", name: "Miron Vitold", avatar: "/assets/avatar-1.png" },
		],
		unreadCount: 0,
	},
	{
		id: "TRD-001",
		type: "direct",
		participants: [
			{ id: "USR-000", name: "Sofia Rivers", avatar: "/assets/avatar.png" },
			{ id: "USR-010", name: "Alcides Antonio", avatar: "/assets/avatar-10.png" },
		],
		unreadCount: 2,
	},
];

const messages = [
	{
		id: "MSG-011",
		threadId: "TRD-004",
		type: "text",
		content: "Hola, como estas?",
		author: { id: "USR-000", name: "Sofia Rivers", avatar: "/assets/avatar.png" },
		createdAt: dayjs().subtract(10, "minute").toDate(),
	},
	{
		id: "MSG-010",
		threadId: "TRD-003",
		type: "text",
		content: "Estas disponible para una llamada?",
		author: { id: "USR-005", name: "Fran Perez", avatar: "/assets/avatar-5.png" },
		createdAt: dayjs().subtract(5, "minute").subtract(1, "hour").toDate(),
	},
	{
		id: "MSG-009",
		threadId: "TRD-002",
		type: "text",
		content: "Hola a todos 😀",
		author: { id: "USR-001", name: "Miron Vitold", avatar: "/assets/avatar-1.png" },
		createdAt: dayjs().subtract(56, "minute").subtract(2, "hour").toDate(),
	},
	{
		id: "MSG-008",
		threadId: "TRD-002",
		type: "text",
		content: "Hola!",
		author: { id: "USR-000", name: "Sofia Rivers", avatar: "/assets/avatar.png" },
		createdAt: dayjs().subtract(51, "minute").subtract(3, "hour").toDate(),
	},
	{
		id: "MSG-007",
		threadId: "TRD-002",
		type: "text",
		content: "Ey, les gustaria colaborar?",
		author: { id: "USR-007", name: "Nasimiyu Danai", avatar: "/assets/avatar-7.png" },
		createdAt: dayjs().subtract(46, "minute").subtract(5, "hour").toDate(),
	},
	{
		id: "MSG-006",
		threadId: "TRD-001",
		type: "image",
		content: "/assets/image-abstract-1.png",
		author: { id: "USR-010", name: "Alcides Antonio", avatar: "/assets/avatar-10.png" },
		createdAt: dayjs().subtract(1, "hour").subtract(2, "day").toDate(),
	},
	{
		id: "MSG-005",
		threadId: "TRD-001",
		type: "text",
		content: "Ok, voy a pensar en eso, gracias!",
		author: { id: "USR-010", name: "Alcides Antonio", avatar: "/assets/avatar-10.png" },
		createdAt: dayjs().subtract(2, "hour").subtract(2, "day").toDate(),
	},
	{
		id: "MSG-004",
		threadId: "TRD-001",
		type: "text",
		content: "Lo siento, no puedo bajarle de $45",
		author: { id: "USR-000", name: "Sofia Rivers", avatar: "/assets/avatar.png" },
		createdAt: dayjs().subtract(3, "hour").subtract(3, "day").toDate(),
	},
	{
		id: "MSG-003",
		threadId: "TRD-001",
		type: "text",
		content: "Puedes dejarmelo en $40? Tengo un presupuesto ajustado",
		author: { id: "USR-010", name: "Alcides Antonio", avatar: "/assets/avatar-10.png" },
		createdAt: dayjs().subtract(5, "hour").subtract(3, "day").toDate(),
	},
	{
		id: "MSG-002",
		threadId: "TRD-001",
		type: "text",
		content: "Seguro, son $50 por hora",
		author: { id: "USR-000", name: "Sofia Rivers", avatar: "/assets/avatar.png" },
		createdAt: dayjs().subtract(2, "hour").subtract(4, "day").toDate(),
	},
	{
		id: "MSG-001",
		threadId: "TRD-001",
		type: "text",
		content: "Estoy interesado en tus servicios, puedes decirme mas sobre tu tarifa por horas",
		author: { id: "USR-010", name: "Alcides Antonio", avatar: "/assets/avatar-10.png" },
		createdAt: dayjs().subtract(5, "hour").subtract(4, "day").toDate(),
	},
];

export default function Layout({ children }) {
	return (
		<ChatProvider contacts={contacts} messages={messages} threads={threads}>
			<ChatView>{children}</ChatView>
		</ChatProvider>
	);
}
