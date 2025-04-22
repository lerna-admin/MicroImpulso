import { paths } from "@/paths";

export const dashboardConfig = {
	layout: "vertical",
	navColor: "evident",
	navItems: [
		{
			key: "admin",
			title: "Administrador",
			items: [
				{ key: "overview", title: "Resumen", href: paths.dashboard.overview, icon: "house" },
				{ key: "analytics", title: "Analiticas", href: paths.dashboard.analytics, icon: "chart-pie" },
				{ key: "reports", title: "Reportes", href: paths.dashboard.reports, icon: "article" },
				{ key: "configuration", title: "Configuración", href: paths.dashboard.configuration, icon: "gear" },
				{
					key: "applications",
					title: "Solicitudes",
					icon: "cards-three",
					href: paths.dashboard.applications,
					matcher: { type: "startsWith", href: "/dashboard/applications" },
				},
			],
		},

		{
			key: "general",
			title: "Gerente",
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
					key: "applications",
					title: "Solicitudes",
					icon: "cards-three",
					href: paths.dashboard.applications,
					matcher: { type: "startsWith", href: "/dashboard/applications" },
				},
			],
		},

		{
			key: "agents",
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
					key: "pqr",
					title: "Pqr",
					href: paths.dashboard.pqr,
					icon: "envelope-simple-open",
					matcher: { type: "startsWith", href: "/dashboard/pqr" },
				},
			],
		},
	],
};
