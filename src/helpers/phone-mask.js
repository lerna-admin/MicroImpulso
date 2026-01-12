export const formatPhoneNumber = (number) => {
	// Elimina cualquier carácter que no sea número
	const digits = number.replaceAll(/\D/g, "");

	// Necesitamos exactamente 12 dígitos para este formato
	if (digits.length === 12) {
		if (digits.startsWith("593")) {
			const countryCode = digits.slice(0, 3);
			const areaCode = digits.slice(3, 6);
			const part1 = digits.slice(6, 9);
			const part2 = digits.slice(9, 12);
			return `+${countryCode} (${areaCode}) ${part1} ${part2}`;
		}

		const countryCode = digits.slice(0, 2);
		const areaCode = digits.slice(2, 5);
		const part1 = digits.slice(5, 8);
		const part2 = digits.slice(8, 12);

		return `+${countryCode} (${areaCode}) ${part1} ${part2}`;
	}

	// Si no tiene 12 dígitos, devolver sin formato
	return number;
};
