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
					icon: "chart-pie",
					matcher: { type: "startsWith", href: "/dashboard/overview" },
				},
				{
					key: "reports",
					title: "Reportes",
					href: paths.dashboard.reports,
					icon: "article",
					matcher: { type: "startsWith", href: "/dashboard/reports" },
				},
				{
					key: "requests",
					title: "Solicitudes",
					icon: "cards-three",
					matcher: { type: "startsWith", href: "/dashboard/requests" },
					items: [
						{ key: "requests", title: "Lista de solicitudes", href: paths.dashboard.requests.list },
						{ key: "requests:create", title: "Crear solicitud", href: paths.dashboard.requests.create },
					],
				},
				{
					key: "clients",
					title: "Clientes",
					icon: "users",
					matcher: { type: "startsWith", href: "/dashboard/customers" },
					items: [
						{ key: "clients", title: "Lista de clientes", href: paths.dashboard.customers.list },
						{ key: "clients:create", title: "Crear cliente", href: paths.dashboard.customers.create },
					],
				},
				{
					key: "users",
					title: "Usuarios",
					icon: "identification-badge",
					matcher: { type: "startsWith", href: "/dashboard/users" },
					items: [
						{ key: "users", title: "Lista de Usuarios", href: paths.dashboard.users.list },
						{ key: "users:create", title: "Crear usuario", href: paths.dashboard.users.create },
					],
				},
				{
					key: "configuration",
					title: "Configuración",
					icon: "gear",
					matcher: { type: "startsWith", href: "/dashboard/permissions" },
					items: [
						{ key: "permissions", title: "Permisos", href: paths.dashboard.configuration.permissions },
						{ key: "amountManagment", title: "Gestion de montos", href: paths.dashboard.configuration.amountManagment },
						{
							key: "paymentInformation",
							title: "Información de pago",
							href: paths.dashboard.configuration.paymentInformation,
						},
					],
				},
			],
		},

		{
			key: ROLES.ADMIN,
			title: "Administrador",
			items: [
				{
					key: "requests",
					title: "Solicitudes",
					icon: "cards-three",
					matcher: { type: "startsWith", href: "/dashboard/requests" },
					items: [
						{ key: "requests", title: "Lista de solicitudes", href: paths.dashboard.requests.list },
						{ key: "requests:create", title: "Crear solicitud", href: paths.dashboard.requests.create },
					],
				},
				{
					key: "clients",
					title: "Clientes",
					icon: "users",
					matcher: { type: "startsWith", href: "/dashboard/customers" },
					items: [
						{ key: "clients", title: "Lista de clientes", href: paths.dashboard.customers.list },
						{ key: "clients:create", title: "Crear cliente", href: paths.dashboard.customers.create },
					],
				},
				{
					key: "users",
					title: "Usuarios",
					icon: "identification-badge",
					matcher: { type: "startsWith", href: "/dashboard/users" },
					items: [
						{ key: "users", title: "Lista de Usuarios", href: paths.dashboard.users.list },
						{ key: "users:create", title: "Crear usuario", href: paths.dashboard.users.create },
					],
				},
				{
					key: "cash_flow",
					title: "Movimientos de caja",
					icon: "cash-register",
					href: paths.dashboard.cash_flow,
					matcher: { type: "startsWith", href: "/dashboard/cash_flow" },
				},
				{
					key: "configuration",
					title: "Configuración",
					icon: "gear",
					matcher: { type: "startsWith", href: "/dashboard/permissions" },
					items: [{ key: "permissions", title: "Permisos", href: paths.dashboard.configuration.permissions }],
				},
			],
		},

		{
			key: ROLES.AGENTE,
			title: "Agentes",
			items: [
				// {
				// 	key: "chat",
				// 	title: "Chat",
				// 	href: paths.dashboard.chat.base,
				// 	icon: "chats-circle",
				// 	matcher: { type: "startsWith", href: "/dashboard/chat" },
				// },
				{
					key: "clients",
					title: "Clientes",
					icon: "users",
					matcher: { type: "startsWith", href: "/dashboard/customers" },
					items: [
						{ key: "clients", title: "Lista de clientes", href: paths.dashboard.customers.list },
						{ key: "clients:create", title: "Crear cliente", href: paths.dashboard.customers.create },
					],

				},
				{
					key: "requests",
					title: "Solicitudes",
					icon: "cards-three",
					matcher: { type: "startsWith", href: "/dashboard/requests" },
					items: [
						{ key: "requests", title: "Lista de solicitudes", href: paths.dashboard.requests.list },
						{ key: "requests:create", title: "Crear solicitud", href: paths.dashboard.requests.create },
					],

				},
				{
					key: "balance",
					title: "Balance de la ruta",
					icon: "seal-percent",
					href: paths.dashboard.balance,
					matcher: { type: "startsWith", href: "/dashboard/balance" },
				},
			],
		},
	],
};
