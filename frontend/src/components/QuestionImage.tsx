"use client";

import React, { useState, useEffect } from "react";

interface QuestionImageProps {
  imageUrl?: string | null;
  examName?: string;
  year?: number | string | null;
  alt?: string;
  className?: string;
}

const UTHO_UPLOADS_BASE = (process.env.NEXT_PUBLIC_UPLOADS_URL || "https://ilovestudy.in/uploads").replace(/\/$/, "");

/**
 * Robust candidate generator for QuestionBank images on Utho server
 */
export function getQuestionImageUrls(
  imageUrl: string,
  examName: string = "Jee Mains",
  year?: number | string | null
): string[] {
  if (!imageUrl) return [];
  if (imageUrl.startsWith("data:")) return [imageUrl];

  // Instantly return local static assets under /ssc/
  if (imageUrl.startsWith("/ssc/") || imageUrl.startsWith("ssc/")) {
    return [imageUrl.startsWith("/") ? imageUrl : `/${imageUrl}`];
  }

  // Handle full HTTP / HTTPS URLs
  if (imageUrl.startsWith("http://") || imageUrl.startsWith("https://")) {
    const supabaseRegex = /https:\/\/[a-z0-9-]+\.supabase\.co\/storage\/v1\/object\/public\/(QuestionBank|test-pdfs)\/(.+)/i;
    const match = imageUrl.match(supabaseRegex);
    if (match) {
      const bucket = match[1];
      const filePath = match[2];
      return [encodeURI(`${UTHO_UPLOADS_BASE}/${bucket}/${filePath}`)];
    }
    return [imageUrl];
  }

  const cleanPath = imageUrl.replace(/^\/+/, '');
  let cleanFileName = cleanPath;
  if (cleanFileName.includes("/")) {
    const parts = cleanFileName.split("/");
    cleanFileName = parts[parts.length - 1];
  }

  const lowerExam = (examName || "").toLowerCase();
  const lowerUrl = imageUrl.toLowerCase();

  let folderExam = "Jee Mains";
  if (lowerExam.includes("advance")) folderExam = "Jee Advance";
  else if (lowerExam.includes("ssc cgl") || lowerExam.includes("cgl") || lowerUrl.includes("ssc")) folderExam = "SSC CGL";
  else if (lowerExam.includes("ssc chsl") || lowerExam.includes("chsl")) folderExam = "SSC CHSL";
  else if (lowerExam.includes("neet") || lowerUrl.includes("neet")) folderExam = "NEET";
  else if (lowerExam.includes("gate") || lowerUrl.includes("gate")) folderExam = "Gate";

  const defaultYear = (lowerExam.includes("ssc") ? "2024" : "2025");
  const folderYear = year ? String(year) : defaultYear;

  const candidates: string[] = [];
  const hasPathSlash = cleanPath.includes("/");

  if (hasPathSlash) {
    // If path already has subfolder (e.g. ssc-cgl/images/foo.png or Jee Mains/2025/foo.png or NEET/foo.png)
    candidates.push(`${UTHO_UPLOADS_BASE}/QuestionBank/${cleanPath}`);
    if (folderExam === "NEET") {
      candidates.push(`${UTHO_UPLOADS_BASE}/QuestionBank/NEET/${cleanFileName}`);
    } else {
      candidates.push(`${UTHO_UPLOADS_BASE}/QuestionBank/${folderExam}/${folderYear}/${cleanFileName}`);
    }
    candidates.push(`${UTHO_UPLOADS_BASE}/QuestionBank/${cleanFileName}`);
  } else {
    // Single filename (e.g. 28th_jan_q30_diagram.png) -> primary candidate is structured exam folder
    if (folderExam === "NEET") {
      candidates.push(`${UTHO_UPLOADS_BASE}/QuestionBank/NEET/${cleanFileName}`);
    } else {
      candidates.push(`${UTHO_UPLOADS_BASE}/QuestionBank/${folderExam}/${folderYear}/${cleanFileName}`);
    }
    candidates.push(`${UTHO_UPLOADS_BASE}/QuestionBank/${cleanPath}`);
  }

  // Fallback to local static asset if needed
  candidates.push(cleanPath.startsWith('/') ? cleanPath : `/${cleanPath}`);

  // Safely URL-encode candidates (converting spaces like "Jee Mains" to "Jee%20Mains")
  const safeCandidates = candidates.map((c) =>
    c.startsWith("http://") || c.startsWith("https://") ? encodeURI(c) : c
  );

  return Array.from(new Set(safeCandidates));
}

/**
 * Backward compatibility export
 */
export function getQuestionSupabaseUrl(
  imageUrl: string,
  examName: string = "Jee Mains",
  year?: number | string | null
): { supabaseUrl: string; localFallbackUrl: string } {
  const candidates = getQuestionImageUrls(imageUrl, examName, year);
  const supabaseUrl = candidates[0] || "";
  const localFallbackUrl = candidates[candidates.length - 1] || "";
  return { supabaseUrl, localFallbackUrl };
}

export const QuestionImage: React.FC<QuestionImageProps> = ({
  imageUrl,
  examName = "Jee Mains",
  year,
  alt = "Question Diagram",
  className = "max-h-72 object-contain",
}) => {
  if (!imageUrl) return null;

  const isDataUri = imageUrl.startsWith("data:");
  const candidates = getQuestionImageUrls(imageUrl, examName, year);

  const [candidateIndex, setCandidateIndex] = useState<number>(0);

  useEffect(() => {
    setCandidateIndex(0);
  }, [imageUrl, examName, year]);

  if (candidates.length === 0) return null;

  const currentSrc = isDataUri ? imageUrl : (candidates[candidateIndex] || candidates[0]);

  const handleError = () => {
    if (!isDataUri && candidateIndex < candidates.length - 1) {
      console.warn(
        `[QuestionImage] Failed to load image from (${currentSrc}). Trying next candidate (${candidates[candidateIndex + 1]}).`
      );
      setCandidateIndex((prev) => prev + 1);
    }
  };

  return (
    <img
      src={currentSrc}
      alt={alt}
      className={className}
      onError={handleError}
    />
  );
};

export async function preloadExamImages(
  questions: Array<{ imageUrl?: string | null }>,
  examName: string = "Jee Mains",
  year?: number | string | null,
  onProgress?: (loaded: number, total: number) => void
): Promise<{ loaded: number; total: number }> {
  const imagesToLoad = questions.filter((q) => Boolean(q.imageUrl));
  const total = imagesToLoad.length;
  if (total === 0) {
    if (onProgress) onProgress(0, 0);
    return { loaded: 0, total: 0 };
  }

  let loadedCount = 0;

  const loadPromises = imagesToLoad.map((q) => {
    return new Promise<void>((resolve) => {
      const url = q.imageUrl!;
      if (url.startsWith("data:")) {
        loadedCount++;
        if (onProgress) onProgress(loadedCount, total);
        resolve();
        return;
      }

      const candidates = getQuestionImageUrls(url, examName, year);
      const img = new Image();

      const handleComplete = () => {
        loadedCount++;
        if (onProgress) onProgress(loadedCount, total);
        resolve();
      };

      img.onload = handleComplete;
      img.onerror = () => {
        if (candidates.length > 1) {
          const fallbackImg = new Image();
          fallbackImg.onload = handleComplete;
          fallbackImg.onerror = handleComplete;
          fallbackImg.src = candidates[candidates.length - 1];
        } else {
          handleComplete();
        }
      };

      img.src = candidates[0] || url;
    });
  });

  await Promise.all(loadPromises);
  return { loaded: loadedCount, total };
}
