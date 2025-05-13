export function stringAvatar(name = "") {
	const initials = name
		.split(" ")
		.filter(Boolean)
		.map((n) => n[0])
		.slice(0, 2)
		.join("");

	return {
		sx: {
			bgcolor: stringToColor(name),
		},
		children: initials || "U",
	};
}

function stringToColor(string) {
	let hash = 0;
	let i;

	for (i = 0; i < string.length; i += 1) {
		hash = string.codePointAt(i) + ((hash << 5) - hash);
	}

	let color = "#";

	for (i = 0; i < 3; i += 1) {
		// eslint-disable-next-line unicorn/number-literal-case
		const value = (hash >> (i * 8)) & 0xff;
		color += `00${value.toString(16)}`.slice(-2);
	}

	if (string === "Usuario") {
		color = "#999999";
	}

	return color;
}
