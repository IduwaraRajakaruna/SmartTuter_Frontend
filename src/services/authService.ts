import { API_BASE_URL } from "../config";

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  role: "student" | "teacher";
  subject?: string;
  qualification?: string;
  experience?: string;
}

export interface LoginData {
  email: string;
  password: string;
}

// ✅ Register user
export const registerUser = async (data: RegisterData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    return await response.json();
  } catch (err: any) {
    return { error: "Network error" };
  }
};

// ✅ Login user
export const loginUser = async (data: LoginData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    return await response.json();
  } catch (err: any) {
    return { error: "Network error" };
  }
};
