import { dashboardConfig } from "@/config/dashboard";

export function getProtectedRoutes() {
	const routePermissions = {};

	for (const roleSection of dashboardConfig.navItems) {
		const role = roleSection.key;

		for (const item of roleSection.items) {
			if (item.matcher?.type === "startsWith" && item.matcher.href) {
				const path = item.matcher.href;

				if (!routePermissions[path]) {
					routePermissions[path] = [];
				}

				routePermissions[path].push(role.toLowerCase());
			}
		}
	}

	return routePermissions;
}
