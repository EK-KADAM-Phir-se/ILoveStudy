const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export type UserProfile = {
  id: string;
  email: string;
  fullName: string;
  targetExam: string;
  age: number | null;
  school: string;
  avatarUrl: string | null;
};

export async function syncUserProfile(data: {
  email: string;
  fullName: string;
  avatarUrl?: string | null;
}): Promise<{ token: string; profile: UserProfile }> {
  try {
    const response = await fetch(`${API_BASE}/api/profile/sync`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const result = await response.json();
    if (!response.ok) {
      throw new Error(result.error || "Failed to sync profile");
    }

    localStorage.setItem("backendToken", result.token);
    localStorage.setItem("displayName", result.profile.fullName);
    localStorage.setItem("userEmail", result.profile.email);

    return result;
  } catch (error) {
    console.error("Profile API sync error:", error);
    if (error instanceof TypeError) {
      throw new Error(
        `Could not reach the backend server at ${API_BASE}. Make sure the backend is running and accessible.`
      );
    }
    throw error instanceof Error ? error : new Error("Failed to sync profile");
  }
}

export async function fetchProfile(): Promise<UserProfile> {
  const token = localStorage.getItem("backendToken");
  if (!token) throw new Error("Not authenticated");

  const response = await fetch(`${API_BASE}/api/profile`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  const result = await response.json();
  if (!response.ok) {
    throw new Error(result.error || "Failed to fetch profile");
  }

  return result.profile;
}

export async function updateProfile(
  data: Partial<Pick<UserProfile, "fullName" | "targetExam" | "age" | "school">>
): Promise<UserProfile> {
  const token = localStorage.getItem("backendToken");
  if (!token) throw new Error("Not authenticated");

  const response = await fetch(`${API_BASE}/api/profile`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  const result = await response.json();
  if (!response.ok) {
    throw new Error(result.error || "Failed to update profile");
  }

  localStorage.setItem("displayName", result.profile.fullName);
  return result.profile;
}

export const EXAM_OPTIONS = [
  "JEE Mains",
  "JEE Advanced",
  "NEET",
  "SSC CGL",
  "SSC CHSL",
  "UPSC",
  "GATE",
  "Other",
];
