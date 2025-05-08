import { paths } from "@/paths";

export const ROLES = {
	GERENTE: "MANAGER",
	ADMIN: "ADMIN",
	AGENTE: "AGENT",
};

export const rolePages = {
	[ROLES.GERENTE]: [
		paths.dashboard,
		paths.dashboard.overview,
		paths.dashboard.analytics,
		paths.dashboard.reports,
		paths.dashboard.configuration,
		paths.dashboard.requests.list,
		paths.dashboard.customers.list,
		paths.dashboard.employees,
	],
	[ROLES.ADMIN]: [
		paths.dashboard,
		paths.dashboard.customers.list,
		paths.dashboard.employees,
		paths.dashboard.requests.list,
	],
	[ROLES.AGENTE]: [paths.dashboard, paths.dashboard.chat.base],
};
