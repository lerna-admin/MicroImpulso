"use client";

import * as React from "react";

import { useSelection } from "@/hooks/use-selection";

function noop() {
	// No operation
}

export const RequestsSelectionContext = React.createContext({
	deselectAll: noop,
	deselectOne: noop,
	selectAll: noop,
	selectOne: noop,
	selected: new Set(),
	selectedAny: false,
	selectedAll: false,
});

export function RequestsSelectionProvider({ children, requests = [] }) {
	const requestIds = React.useMemo(() => requests.map((request) => request.id), [requests]);
	const selection = useSelection(requestIds);

	return <RequestsSelectionContext.Provider value={{ ...selection }}>{children}</RequestsSelectionContext.Provider>;
}

export function useRequestsSelection() {
	return React.useContext(RequestsSelectionContext);
}
