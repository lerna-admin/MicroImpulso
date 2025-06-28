export const formatCurrency = (value) => {
	const number = typeof value === "string" ? value.replaceAll(/\D/g, "") : value;
	const numberValue = Number.parseInt(number || "0", 10);

	return numberValue.toLocaleString("es-CO", {
		style: "currency",
		currency: "COP",
		minimumFractionDigits: 0,
	});
};

export const unformatCurrency = (formatted) => {
	return Number.parseInt(formatted.replaceAll(/\D/g, ""), 10) || 0;
};

export const deleteAlphabeticals = (value) => {
	// Elimina cualquier carácter que no sea número
	return Number(value.replaceAll(/[^0-9]/g, ""));
};
