import axios from "axios";

const API_BASE = "http://localhost:5000/api/org";

function getAuthHeaders() {
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
  return {
    headers: {
      Authorization: token ? `Bearer ${token}` : "Bearer SIMULATED_TOKEN",
    },
  };
}

export interface Organization {
  id: string;
  name: string;
  code: string;
  contactEmail?: string | null;
  contactPhone?: string | null;
  address?: string | null;
  logoUrl?: string | null;
  createdAt: string;
  _count?: {
    tests: number;
  };
}

export interface OrgQuestion {
  id?: string;
  subject?: string;
  questionText: string;
  imageUrl?: string | null;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  correctOption?: string;
  explanation?: string | null;
  positiveMarks?: number;
  negativeMarks?: number;
  orderIndex?: number;
  userAnswer?: string | null;
  status?: "Correct" | "Wrong" | "Unattempted";
}

export interface OrgTest {
  id: string;
  organizationId: string;
  organization?: Organization;
  title: string;
  accessCode: string;
  description?: string | null;
  subject: string;
  durationMinutes: number;
  positiveMarks: number;
  negativeMarks: number;
  startTime?: string | null;
  endTime?: string | null;
  status: "ACTIVE" | "DRAFT" | "CLOSED";
  createdAt: string;
  questions?: OrgQuestion[];
  _count?: {
    questions: number;
    attempts: number;
  };
}

export interface StudentAttemptItem {
  rank: number;
  attemptId: string;
  studentName: string;
  studentEmail: string;
  studentRollNumber: string;
  score: number;
  maxScore: number;
  percentage: number;
  correctCount: number;
  incorrectCount: number;
  unattemptedCount: number;
  submittedAt: string;
}

export interface OrgTestResultsResponse {
  test: {
    id: string;
    title: string;
    accessCode: string;
    subject: string;
    organizationName: string;
    organizationCode: string;
    durationMinutes: number;
    totalQuestions: number;
    maxPossibleMarks: number;
    status: string;
  };
  analytics: {
    totalSubmissions: number;
    averageScore: number;
    highestScore: number;
    lowestScore: number;
  };
  results: StudentAttemptItem[];
}

export interface StudentVerifyResponse {
  valid: boolean;
  test: {
    id: string;
    accessCode: string;
    title: string;
    description?: string;
    subject: string;
    organizationName: string;
    organizationCode: string;
    durationMinutes: number;
    positiveMarks: number;
    negativeMarks: number;
    totalQuestions: number;
  };
}

export interface StudentAttemptResultResponse {
  attempt: {
    id: string;
    studentName: string;
    studentRollNumber?: string;
    studentEmail?: string;
    score: number;
    maxScore: number;
    percentage: number;
    correctCount: number;
    incorrectCount: number;
    unattemptedCount: number;
    submittedAt: string;
    testTitle: string;
    accessCode: string;
    organizationName: string;
    durationMinutes: number;
  };
  questions: OrgQuestion[];
}

// -------------------------------------------------------------
// Admin API Functions
// -------------------------------------------------------------

export async function fetchOrganizations(): Promise<Organization[]> {
  const res = await axios.get(`${API_BASE}/admin/organizations`, getAuthHeaders());
  return res.data.organizations || [];
}

export async function createOrganization(data: {
  name: string;
  code?: string;
  contactEmail?: string;
  contactPhone?: string;
  address?: string;
}): Promise<Organization> {
  const res = await axios.post(`${API_BASE}/admin/organizations`, data, getAuthHeaders());
  return res.data.organization;
}

export async function createOrgTest(data: {
  organizationId: string;
  title: string;
  customCode?: string;
  description?: string;
  subject?: string;
  durationMinutes?: number;
  positiveMarks?: number;
  negativeMarks?: number;
  startTime?: string;
  endTime?: string;
  questions: OrgQuestion[];
}): Promise<any> {
  const res = await axios.post(`${API_BASE}/admin/tests`, data, getAuthHeaders());
  return res.data;
}

export async function fetchOrgTests(organizationId?: string): Promise<OrgTest[]> {
  const url = organizationId
    ? `${API_BASE}/admin/tests?organizationId=${encodeURIComponent(organizationId)}`
    : `${API_BASE}/admin/tests`;
  const res = await axios.get(url, getAuthHeaders());
  return res.data.tests || [];
}

export async function fetchOrgTestDetails(testId: string): Promise<OrgTest> {
  const res = await axios.get(`${API_BASE}/admin/tests/${testId}`, getAuthHeaders());
  return res.data.test;
}

export async function fetchOrgTestResults(testId: string): Promise<OrgTestResultsResponse> {
  const res = await axios.get(`${API_BASE}/admin/tests/${testId}/results`, getAuthHeaders());
  return res.data;
}

export function getExportCSVUrl(testId: string): string {
  return `${API_BASE}/admin/tests/${testId}/export-csv`;
}

// -------------------------------------------------------------
// Student API Functions
// -------------------------------------------------------------

export async function verifyStudentAccessCode(accessCode: string): Promise<StudentVerifyResponse> {
  const res = await axios.post(`${API_BASE}/student/verify-code`, { accessCode }, getAuthHeaders());
  return res.data;
}

export async function fetchStudentTestQuestions(accessCode: string): Promise<{
  test: {
    id: string;
    title: string;
    accessCode: string;
    subject: string;
    organizationName: string;
    durationMinutes: number;
    positiveMarks: number;
    negativeMarks: number;
    questions: OrgQuestion[];
  };
}> {
  const res = await axios.get(`${API_BASE}/student/test/${encodeURIComponent(accessCode)}`, getAuthHeaders());
  return res.data;
}

export async function submitStudentTest(payload: {
  accessCode: string;
  studentName: string;
  studentEmail?: string;
  studentRollNumber?: string;
  answers: Record<string, string>;
  timeSpentMap?: Record<string, number>;
}): Promise<{
  message: string;
  attemptId: string;
  result: {
    score: number;
    maxScore: number;
    percentage: number;
    correctCount: number;
    incorrectCount: number;
    unattemptedCount: number;
    testTitle: string;
    organizationName: string;
  };
}> {
  const res = await axios.post(`${API_BASE}/student/submit`, payload, getAuthHeaders());
  return res.data;
}

export async function fetchStudentAttemptResult(attemptId: string): Promise<StudentAttemptResultResponse> {
  const res = await axios.get(`${API_BASE}/student/attempt/${attemptId}`, getAuthHeaders());
  return res.data;
}

// -------------------------------------------------------------
// Admin Whitelist API Functions
// -------------------------------------------------------------

export interface AdminEmailRecord {
  id: string;
  email: string;
  role: string;
  addedBy?: string;
  createdAt: string;
}

export async function checkAdminAccess(email?: string): Promise<{ isAdmin: boolean; email: string }> {
  const url = email
    ? `${API_BASE}/admin/check-access?email=${encodeURIComponent(email)}`
    : `${API_BASE}/admin/check-access`;
  const res = await axios.get(url, getAuthHeaders());
  return res.data;
}

export async function fetchAdminEmails(): Promise<{ admins: AdminEmailRecord[]; envAdmins: string[] }> {
  const res = await axios.get(`${API_BASE}/admin/admins`, getAuthHeaders());
  return res.data;
}

export async function addAdminEmail(email: string, role: string = "ADMIN"): Promise<AdminEmailRecord> {
  const res = await axios.post(`${API_BASE}/admin/admins`, { email, role }, getAuthHeaders());
  return res.data.admin;
}

export async function removeAdminEmail(id: string): Promise<void> {
  await axios.delete(`${API_BASE}/admin/admins/${id}`, getAuthHeaders());
}
