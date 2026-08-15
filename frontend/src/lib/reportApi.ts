const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export type ErrorReportStatus = "pending" | "reviewing" | "resolved" | "rejected";

export type ErrorTypeOption =
  | "Wrong Question"
  | "Wrong Answer"
  | "Wrong Explanation"
  | "Typo / Formatting"
  | "Wrong Exam / Year"
  | "Duplicate Question"
  | "Image / Diagram Problem"
  | "Other";

export interface UserErrorReport {
  id: string;
  questionId: string;
  questionText: string;
  subject: string;
  examName: string;
  shiftName: string;
  errorType: ErrorTypeOption;
  description: string;
  adminComment: string | null;
  status: ErrorReportStatus;
  createdAt: string;
  resolvedAt: string | null;
}

export interface AdminErrorReport {
  id: string;
  status: ErrorReportStatus;
  errorType: ErrorTypeOption;
  description: string;
  adminComment: string | null;
  createdAt: string;
  resolvedAt: string | null;
  user: {
    id: string;
    email: string;
    fullName: string;
  };
  question: {
    id: string;
    questionText: string;
    subject: string;
    optionA: string;
    optionB: string;
    optionC: string;
    optionD: string;
    correctOption: string;
    imageUrl: string | null;
    examName: string;
    shiftName: string;
    shiftDate: string;
  };
}

function getAuthToken(): string {
  const token = typeof window !== "undefined" ? (localStorage.getItem("backendToken") || localStorage.getItem("token")) : null;
  if (!token) {
    throw new Error("You must be logged in to perform this action.");
  }
  return token;
}

async function handleResponse(res: Response, fallbackError: string) {
  const contentType = res.headers.get("content-type");
  let data: any = {};
  let rawText = "";
  if (contentType && contentType.includes("application/json")) {
    data = await res.json();
  } else {
    rawText = await res.text();
    console.error("Non-JSON response from backend:", rawText);
  }

  if (!res.ok) {
    const errorMsg = data.error || data.message || (rawText ? `Server Error (${res.status}): Please restart the backend server.` : fallbackError);
    throw new Error(errorMsg);
  }
  return data;
}

// 1. Submit Question Error Report
export async function submitErrorReport(params: {
  questionId: string;
  errorType: ErrorTypeOption;
  description: string;
}): Promise<{ message: string; report: UserErrorReport }> {
  const token = getAuthToken();

  const response = await fetch(`${API_BASE}/api/reports`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(params),
  });

  return handleResponse(response, "Failed to submit error report");
}

// 2. Fetch User's Submitted Error Reports
export async function fetchUserErrorReports(): Promise<UserErrorReport[]> {
  const token = getAuthToken();

  const response = await fetch(`${API_BASE}/api/reports/my-reports`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const result = await handleResponse(response, "Failed to fetch error reports");
  return result.reports || [];
}

// 3. Fetch Admin Error Reports (Admin only)
export async function fetchAdminErrorReports(filters?: {
  status?: string;
  exam?: string;
}): Promise<AdminErrorReport[]> {
  const token = getAuthToken();

  const queryParams = new URLSearchParams();
  if (filters?.status) queryParams.set("status", filters.status);
  if (filters?.exam) queryParams.set("exam", filters.exam);

  const url = `${API_BASE}/api/reports/admin${queryParams.toString() ? `?${queryParams.toString()}` : ""}`;

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const result = await handleResponse(response, "Failed to fetch admin reports");
  return result.reports || [];
}

// 4. Update Report Status / Comment (Admin only)
export async function updateAdminReportStatus(
  reportId: string,
  params: {
    status?: ErrorReportStatus;
    adminComment?: string;
  }
): Promise<{ message: string; report: any }> {
  const token = getAuthToken();

  const response = await fetch(`${API_BASE}/api/reports/admin/${reportId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(params),
  });

  return handleResponse(response, "Failed to update report status");
}
