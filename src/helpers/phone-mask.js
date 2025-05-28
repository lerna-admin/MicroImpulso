export const formatPhoneNumber = (number) => {
	// Elimina cualquier carácter que no sea número
	const digits = number.replaceAll(/\D/g, "");

	// Necesitamos exactamente 12 dígitos para este formato
	if (digits.length === 12) {
		const countryCode = digits.slice(0, 2); // +CC
		const areaCode = digits.slice(2, 5); // (XXX)
		const part1 = digits.slice(5, 8); // XXX
		const part2 = digits.slice(8, 12); // XXXX

		return `+${countryCode} (${areaCode}) ${part1} ${part2}`;
	}

	// Si no tiene 12 dígitos, devolver sin formato
	return number;
};
