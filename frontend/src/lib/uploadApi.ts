import axios from 'axios';
import { API_BASE_URL } from '@/src/lib/apiConfig';

const UPLOAD_API_BASE = `${API_BASE_URL}/api/upload`;

function getAuthHeaders() {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  return {
    headers: {
      Authorization: token ? `Bearer ${token}` : 'Bearer SIMULATED_TOKEN',
      'Content-Type': 'application/json',
    },
  };
}

export interface UploadResponse {
  success: boolean;
  message?: string;
  url: string;
  fileName: string;
  path: string;
}

/**
 * Native browser-compatible helper to convert File or Blob to base64 string
 */
function fileToBase64(file: File | Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      const base64Data = result.includes(',') ? result.split(',')[1] : result;
      resolve(base64Data);
    };
    reader.onerror = (error) => reject(error);
    reader.readAsDataURL(file);
  });
}

/**
 * Upload a PDF file to Utho backend storage (/var/www/ilovestudy/uploads/test-pdfs/)
 */
export async function uploadPdfFile(
  file: File | Blob,
  fileName?: string,
  subfolder?: string
): Promise<UploadResponse> {
  const finalFileName = fileName || (file as File).name || `document_${Date.now()}.pdf`;
  const base64Content = await fileToBase64(file);

  const payload = {
    fileName: finalFileName,
    fileData: base64Content,
    subfolder: subfolder || '',
  };

  const response = await axios.post<UploadResponse>(
    `${UPLOAD_API_BASE}/pdf`,
    payload,
    getAuthHeaders()
  );

  return response.data;
}

/**
 * Upload an Image file to Utho backend storage (/var/www/ilovestudy/uploads/QuestionBank/)
 */
export async function uploadImageFile(
  file: File | Blob,
  fileName?: string,
  subfolder?: string
): Promise<UploadResponse> {
  const finalFileName = fileName || (file as File).name || `image_${Date.now()}.png`;
  const base64Content = await fileToBase64(file);

  const payload = {
    fileName: finalFileName,
    fileData: base64Content,
    subfolder: subfolder || '',
  };

  const response = await axios.post<UploadResponse>(
    `${UPLOAD_API_BASE}/image`,
    payload,
    getAuthHeaders()
  );

  return response.data;
}
