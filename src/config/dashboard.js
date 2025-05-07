import { paths } from "@/paths";

export const dashboardConfig = {
	layout: "vertical",
	navColor: "evident",
	navItems: [
		{
			key: "MANAGER",
			title: "Gerente",
			items: [
				{ key: "overview", title: "Resumen", href: paths.dashboard.overview, icon: "house" },
				{ key: "analytics", title: "Analiticas", href: paths.dashboard.analytics, icon: "chart-pie" },
				{ key: "reports", title: "Reportes", href: paths.dashboard.reports, icon: "article" },
				{ key: "configuration", title: "Configuración", href: paths.dashboard.configuration, icon: "gear" },
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
					href: paths.dashboard.employees,
					matcher: { type: "startsWith", href: "/dashboard/employees" },
				},
			],
		},

		{
			key: "ADMIN",
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
					href: paths.dashboard.employees,
					matcher: { type: "startsWith", href: "/dashboard/employees" },
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
			key: "AGENT",
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
