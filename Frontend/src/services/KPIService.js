const DJANGO_URL = import.meta.env.VITE_DJANGO_BACKEND_URL || "https://defensasw2.jorgechoquecalle.engineer";

const getAuthHeaders = () => {
  const userStr = localStorage.getItem("user");
  if (!userStr) return {};
  try {
    const user = JSON.parse(userStr);
    if (user && user.token) {
      return {
        "Authorization": `Bearer ${user.token}`,
        "Content-Type": "application/json"
      };
    }
  } catch (e) {
    console.error("Error parsing user token:", e);
  }
  return { "Content-Type": "application/json" };
};

const KPIService = {
  getDashboardKPIs: async () => {
    try {
      const response = await fetch(`${DJANGO_URL}/api/users/admin/kpis/`, {
        method: "GET",
        headers: getAuthHeaders(),
      });
      if (!response.ok) {
        throw new Error("No se pudieron obtener los KPIs del Dashboard");
      }
      const data = await response.json();
      return data;
    } catch (error) {
      throw error.message || "Error al obtener KPIs";
    }
  }
};

export default KPIService;
