
const BASE_URL = process.env.NEXT_PUBLIC_API_URL;


export async function getRequestsStatsBranchesCurrentMonth() {
    const res = await fetch(`${BASE_URL}/stats/branches/current-month`);
    if (!res.ok) throw new Error("Error al obtener solicitudes por sede");
    return res.json();
}

export async function getRequestsStatsBranchesMonthlyHistory() {
    const res = await fetch(`${BASE_URL}/stats/branches/monthly-history`);
    if (!res.ok) throw new Error("Error al obtener solicitudes por sede");
    return res.json();
}