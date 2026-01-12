const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export async function getSuperadminOverview({ userId, startDate = "", endDate = "" }) {
	const params = new URLSearchParams();
	if (userId) params.append("userId", String(userId));
	if (startDate) params.append("startDate", startDate);
	if (endDate) params.append("endDate", endDate);

	const res = await fetch(`${BASE_URL}/stats/superadmin/overview?${params.toString()}`);
	if (!res.ok) throw new Error("Error al obtener overview de superadmin");
	return res.json();
}

