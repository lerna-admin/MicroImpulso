import { ROLES } from "@/constants/roles";

import { paths } from "@/paths";

export const dashboardConfig = {
	layout: "vertical",
	navColor: "evident",
	navItems: [
		{
			key: ROLES.GERENTE,
			title: "Gerente",
			items: [
				// Si quitas un item de cualquiera de los roles, desaparece tanto del sidebar como tampoco deja acceder por el middleware
				{
					key: "overview",
					title: "Resumen",
					href: paths.dashboard.overview,
					icon: "house",
					matcher: { type: "startsWith", href: "/dashboard/overview" },
				},
				{
					key: "analytics",
					title: "Analiticas",
					href: paths.dashboard.analytics,
					icon: "chart-pie",
					matcher: { type: "startsWith", href: "/dashboard/analytics" },
				},
				{
					key: "reports",
					title: "Reportes",
					href: paths.dashboard.reports,
					icon: "article",
					matcher: { type: "startsWith", href: "/dashboard/reports" },
				},
				{
					key: "configuration",
					title: "Configuración",
					icon: "gear",
					href: paths.dashboard.configuration,
					matcher: { type: "startsWith", href: "/dashboard/configuration" },
				},
				{
					key: "requests",
					title: "Solicitudes",
					icon: "cards-three",
					href: paths.dashboard.requests.list,
					matcher: { type: "startsWith", href: "/dashboard/requests" },
				},
				{
					key: "cash_flow",
					title: "Movimientos de caja",
					icon: "cash-register",
					href: paths.dashboard.cash_flow,
					matcher: { type: "startsWith", href: "/dashboard/cash_flow" },
				},
				{
					key: "clients",
					title: "Clientes",
					icon: "users",
					href: paths.dashboard.customers.list,
					matcher: { type: "startsWith", href: "/dashboard/customers" },
				},
				{
					key: "agents",
					title: "Agentes",
					icon: "identification-badge",
					href: paths.dashboard.users,
					matcher: { type: "startsWith", href: "/dashboard/users" },
				},
			],
		},

		{
			key: ROLES.ADMIN,
			title: "Administrador",
			items: [
				{
					key: "clients",
					title: "Clientes",
					icon: "users",
					href: paths.dashboard.customers.list,
					matcher: { type: "startsWith", href: "/dashboard/customers" },
				},
				{
					key: "agents",
					title: "Agentes",
					icon: "identification-badge",
					href: paths.dashboard.users,
					matcher: { type: "startsWith", href: "/dashboard/users" },
				},
				{
					key: "requests",
					title: "Solicitudes",
					icon: "cards-three",
					href: paths.dashboard.requests.list,
					matcher: { type: "startsWith", href: "/dashboard/requests" },
				},
				{
					key: "cash_flow",
					title: "Movimientos de caja",
					icon: "cash-register",
					href: paths.dashboard.cash_flow,
					matcher: { type: "startsWith", href: "/dashboard/cash_flow" },
				},
			],
		},

		{
			key: ROLES.AGENTE,
			title: "Agentes",
			items: [
				{
					key: "chat",
					title: "Chat",
					href: paths.dashboard.chat.base,
					icon: "chats-circle",
					matcher: { type: "startsWith", href: "/dashboard/chat" },
				},
				{
					key: "simulator",
					title: "Simulador de credito",
					href: paths.dashboard.simulator,
					icon: "currency-circle-dollar",
					matcher: { type: "startsWith", href: "/dashboard/simulator-credit" },
				},
				{
					key: "clients",
					title: "Clientes",
					icon: "users",
					href: paths.dashboard.customers.list,
					matcher: { type: "startsWith", href: "/dashboard/customers" },
				},
				{
					key: "requests",
					title: "Solicitudes",
					icon: "cards-three",
					href: paths.dashboard.requests.list,
					matcher: { type: "startsWith", href: "/dashboard/requests" },
				},
			],
		},
	],
};
