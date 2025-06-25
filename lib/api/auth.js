const API_BASE_URL = "https://cmms-back.vercel.app"

export const authAPI = {
  async login(email, password) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        // Handle different error types based on status code or error message
        if (response.status === 404 || data.message?.includes("user not found") || data.message?.includes("email")) {
          throw new Error("Email not found in our system")
        } else if (
          response.status === 401 ||
          data.message?.includes("password") ||
          data.message?.includes("invalid credentials")
        ) {
          throw new Error("Incorrect password")
        } else {
          throw new Error(data.message || "Login failed")
        }
      }

      return data
    } catch (error) {
      if (error.name === "TypeError" && error.message.includes("fetch")) {
        throw new Error("Unable to connect to server. Please try again later.")
      }
      throw error
    }
  },

  async logout() {
    try {
      const token = localStorage.getItem("authToken")
      if (token) {
        await fetch(`${API_BASE_URL}/api/auth/logout`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        })
      }
    } catch (error) {
      console.error("Logout error:", error)
    } finally {
      // Clear local storage regardless of API call success
      localStorage.removeItem("authToken")
      localStorage.removeItem("user")
    }
  },

  async verifyToken(token) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/verify`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        throw new Error("Token verification failed")
      }

      return await response.json()
    } catch (error) {
      throw error
    }
  },
}
