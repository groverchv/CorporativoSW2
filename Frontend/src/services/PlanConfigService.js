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
    return {};
  }
  return {};
};

class PlanConfigService {
  async getPrecios() {
    try {
      const response = await fetch(`${DJANGO_URL}/api/users/admin/planes-config/`, {
        method: "GET",
        headers: getAuthHeaders(),
      });
      if (!response.ok) throw new Error("Error fetching planes config");
      return await response.json();
    } catch (error) {
      console.error("Error fetching planes config", error);
      throw error;
    }
  }

  async updatePrecios(precios) {
    try {
      const response = await fetch(`${DJANGO_URL}/api/users/admin/planes-config/`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(precios),
      });
      if (!response.ok) throw new Error("Error updating planes config");
      return await response.json();
    } catch (error) {
      console.error("Error updating planes config", error);
      throw error;
    }
  }
}

export default new PlanConfigService();
