export const formatCurrency = (value) => {
	const number = typeof value === "string" ? value.replaceAll(/\D/g, "") : value;
	const numberValue = Number.parseInt(number || "0", 10);

	return numberValue.toLocaleString("es-CO", {
		style: "currency",
		currency: "COP",
		minimumFractionDigits: 0,
	});
};
