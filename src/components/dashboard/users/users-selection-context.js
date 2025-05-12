"use client";

import * as React from "react";

import { useSelection } from "@/hooks/use-selection";

function noop() {
	// No operation
}

export const UsersSelectionContext = React.createContext({
	deselectAll: noop,
	deselectOne: noop,
	selectAll: noop,
	selectOne: noop,
	selected: new Set(),
	selectedAny: false,
	selectedAll: false,
});

export function UsersSelectionProvider({ children, users = [] }) {
	const userIds = React.useMemo(() => users.map((user) => user.id), [users]);
	const selection = useSelection(userIds);

	return <UsersSelectionContext.Provider value={{ ...selection }}>{children}</UsersSelectionContext.Provider>;
}

export function useUsersSelection() {
	return React.useContext(UsersSelectionContext);
}
