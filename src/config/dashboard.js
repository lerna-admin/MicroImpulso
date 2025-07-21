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
					icon: "article",
					matcher: { type: "startsWith", href: "/dashboard/reports" },
					items: [
						{
							key: "reports:daily-cash-count-by-agent  ",
							title: "Arqueo Diario por Agente",
							href: paths.dashboard.reports.dailyCashCountByAgent,
						},
						{
							key: "reports:active-loans-by-status  ",
							title: "Préstamos Activos por Estado",
							href: paths.dashboard.reports.activeLoansByStatus,
						},
						{
							key: "reports:upcoming-due-dates  ",
							title: "Vencimientos Próximos",
							href: paths.dashboard.reports.upcomingDueDates,
						},
						{ key: "reports:overdue-loans  ", title: "Préstamos Vencidos", href: paths.dashboard.reports.overdueLoans },
						{
							key: "reports:loan-history-by-client  ",
							title: "Histórico de Préstamos por Cliente",
							href: paths.dashboard.reports.loanHistoryByClient,
						},
						{
							key: "reports:new-clients-by-date-range  ",
							title: "Clientes Nuevos por Rango de Fechas",
							href: paths.dashboard.reports.newClientsByDateRange,
						},
						{
							key: "reports:active-vs-inactive-clients  ",
							title: "Clientes Activos vs Inactivos",
							href: paths.dashboard.reports.activeVsInactiveClients,
						},
						{
							key: "reports:total-loan-amount  ",
							title: "Monto Prestado Total (Acumulado)",
							href: paths.dashboard.reports.totalLoanAmount,
						},
						{
							key: "reports:total-collection-received  ",
							title: "Recaudo Total (Pagos Recibidos)",
							href: paths.dashboard.reports.totalCollectionReceived,
						},
						{
							key: "reports:documents-uploaded-by-client  ",
							title: "Documentos Subidos por Cliente",
							href: paths.dashboard.reports.documentsUploadedByClient,
						},
						{
							key: "reports:agent-activity  ",
							title: "Actividad de los Agentes",
							href: paths.dashboard.reports.agentActivity,
						},
						{
							key: "reports:average-approval-time  ",
							title: "Tiempo Promedio de Aprobación",
							href: paths.dashboard.reports.averageApprovalTime,
						},
						{
							key: "reports:general-cash-flow  ",
							title: "Flujo de Caja General",
							href: paths.dashboard.reports.generalCashFlow,
						},
						{
							key: "reports:transaction-details  ",
							title: "Detalle de Transacciones",
							href: paths.dashboard.reports.transactionDetails,
						},
						{
							key: "reports:client-or-agent-conversations  ",
							title: "Conversaciones por Cliente o Agente",
							href: paths.dashboard.reports.clientOrAgentConversations,
						},
						{
							key: "reports:generated-and-sent-contracts  ",
							title: "Contratos Generados y Enviados",
							href: paths.dashboard.reports.generatedAndSentContracts,
						},
						{
							key: "reports:document-upload-and-classification  ",
							title: "Carga y Clasificación de Documentos",
							href: paths.dashboard.reports.documentUploadAndClassification,
						},
						{
							key: "reports:general-statistics-by-branch",
							title: "Estadísticas Generales por Sede",
							href: paths.dashboard.reports.generalStatisticsByBranch,
						},
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
						{ key: "amountManagment", title: "Gestión de montos", href: paths.dashboard.configuration.amountManagment },
						{
							key: "paymentInformation",
							title: "Información de pago",
							href: paths.dashboard.configuration.paymentInformation,
						},
						{
							key: "branchManagment",
							title: "Gestión de sedes",
							items: [
								{
									key: "branchManagment",
									title: "Lista de sedes",
									href: paths.dashboard.configuration.branchManagment.list,
								},
								{
									key: "branchManagment:create",
									title: "Crear sede",
									href: paths.dashboard.configuration.branchManagment.create,
								},
							],
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
					key: "reports",
					title: "Reportes",
					icon: "article",
					matcher: { type: "startsWith", href: "/dashboard/reports" },
					items: [
						{
							key: "reports:daily-cash-summary  ",
							title: "Resumen Diario de Caja",
							href: paths.dashboard.reports.dailyCashSummary,
						},
						{
							key: "reports:daily-cash-count-by-agent  ",
							title: "Arqueo Diario por Agente",
							href: paths.dashboard.reports.dailyCashCountByAgent,
						},
						{
							key: "reports:active-loans-by-status  ",
							title: "Préstamos Activos por Estado",
							href: paths.dashboard.reports.activeLoansByStatus,
						},
						{
							key: "reports:upcoming-due-dates  ",
							title: "Vencimientos Próximos",
							href: paths.dashboard.reports.upcomingDueDates,
						},
						{ key: "reports:overdue-loans  ", title: "Préstamos Vencidos", href: paths.dashboard.reports.overdueLoans },
						{
							key: "reports:loan-history-by-client  ",
							title: "Histórico de Préstamos por Cliente",
							href: paths.dashboard.reports.loanHistoryByClient,
						},
						{
							key: "reports:new-clients-by-date-range  ",
							title: "Clientes Nuevos por Rango de Fechas",
							href: paths.dashboard.reports.newClientsByDateRange,
						},
						{
							key: "reports:active-vs-inactive-clients  ",
							title: "Clientes Activos vs Inactivos",
							href: paths.dashboard.reports.activeVsInactiveClients,
						},
						{
							key: "reports:documents-uploaded-by-client  ",
							title: "Documentos Subidos por Cliente",
							href: paths.dashboard.reports.documentsUploadedByClient,
						},
						{
							key: "reports:agent-activity  ",
							title: "Actividad de los Agentes",
							href: paths.dashboard.reports.agentActivity,
						},
						{
							key: "reports:transaction-details  ",
							title: "Detalle de Transacciones",
							href: paths.dashboard.reports.transactionDetails,
						},
						{
							key: "reports:client-or-agent-conversations  ",
							title: "Conversaciones por Cliente o Agente",
							href: paths.dashboard.reports.clientOrAgentConversations,
						},
						{
							key: "reports:generated-and-sent-contracts  ",
							title: "Contratos Generados y Enviados",
							href: paths.dashboard.reports.generatedAndSentContracts,
						},
						{
							key: "reports:document-upload-and-classification  ",
							title: "Carga y Clasificación de Documentos",
							href: paths.dashboard.reports.documentUploadAndClassification,
						},
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
					items: [
						{ key: "permissions", title: "Permisos", href: paths.dashboard.configuration.permissions },
						{ key: "templates", title: "Plantillas", href: paths.dashboard.configuration.templates },
					],
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
					key: "cash_flow",
					title: "Movimientos de caja",
					icon: "cash-register",
					href: paths.dashboard.cash_flow,
					matcher: { type: "startsWith", href: "/dashboard/cash_flow" },
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
