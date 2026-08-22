"use client";

import React, { useState, useEffect } from "react";
import { supabase } from "@/src/lib/supabase";

interface QuestionImageProps {
  imageUrl?: string | null;
  examName?: string;
  year?: number | string | null;
  alt?: string;
  className?: string;
}

export function getQuestionSupabaseUrl(
  imageUrl: string,
  examName: string = "Jee Mains",
  year?: number | string | null
): { supabaseUrl: string; localFallbackUrl: string } {
  // Extract filename cleanly from path (e.g. /neetimages/neet_2023_q8.svg -> neet_2023_q8.svg)
  let cleanFileName = imageUrl;
  if (cleanFileName.includes("/")) {
    const parts = cleanFileName.split("/");
    cleanFileName = parts[parts.length - 1];
  }

  const lowerExam = examName.toLowerCase();
  const isNeet = lowerExam.includes("neet") || imageUrl.includes("neet") || cleanFileName.startsWith("neet_");

  if (isNeet) {
    const storagePath = `NEET/${cleanFileName}`;
    const { data } = supabase.storage
      .from("QuestionBank")
      .getPublicUrl(storagePath);
    const publicUrl = data?.publicUrl || imageUrl;
    return { supabaseUrl: publicUrl, localFallbackUrl: publicUrl };
  }

  if (
    imageUrl.startsWith("/") ||
    imageUrl.startsWith("http://") ||
    imageUrl.startsWith("https://") ||
    imageUrl.startsWith("data:")
  ) {
    return { supabaseUrl: imageUrl, localFallbackUrl: imageUrl };
  }

  // Determine exact folder name matching Supabase bucket structure:
  // "Jee Mains", "Jee Advance", "SSC CGL", "SSC CHSL", "Gate"
  let folderExam = "Jee Mains";
  if (lowerExam.includes("advance")) {
    folderExam = "Jee Advance";
  } else if (lowerExam.includes("ssc cgl") || lowerExam.includes("cgl")) {
    folderExam = "SSC CGL";
  } else if (lowerExam.includes("ssc chsl") || lowerExam.includes("chsl")) {
    folderExam = "SSC CHSL";
  } else if (lowerExam.includes("gate")) {
    folderExam = "Gate";
  } else {
    folderExam = "Jee Mains";
  }

  const defaultYear = lowerExam.includes("ssc") ? "2024" : "2025";
  const folderYear = year ? String(year) : defaultYear;
  const storagePath = `${folderExam}/${folderYear}/${cleanFileName}`;

  const { data } = supabase.storage
    .from("QuestionBank")
    .getPublicUrl(storagePath);

  const supabaseUrl = data?.publicUrl || imageUrl;
  const localFallbackUrl = imageUrl;

  return { supabaseUrl, localFallbackUrl };
}

const neetFallbackMap: Record<string, string> = {
  "neet_2023_q8.svg": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 240" width="100%" height="220"><rect width="500" height="240" fill="#0f172a" rx="16"/><line x1="120" y1="80" x2="160" y2="80" stroke="#94a3b8" stroke-width="2.5"/><path d="M160 80 L168 68 L180 92 L192 68 L204 92 L216 68 L228 92 L236 80" fill="none" stroke="#38bdf8" stroke-width="3"/><text x="198" y="55" fill="#38bdf8" font-family="sans-serif" font-weight="bold" font-size="14" text-anchor="middle">400 Ω</text><line x1="236" y1="80" x2="280" y2="80" stroke="#94a3b8" stroke-width="2.5"/><circle cx="310" cy="80" r="18" fill="#1e293b" stroke="#f59e0b" stroke-width="2.5"/><text x="310" y="86" fill="#f59e0b" font-family="sans-serif" font-weight="bold" font-size="16" text-anchor="middle">G</text><line x1="328" y1="80" x2="380" y2="80" stroke="#94a3b8" stroke-width="2.5"/><line x1="120" y1="80" x2="120" y2="105" stroke="#94a3b8" stroke-width="2.5"/><line x1="105" y1="105" x2="135" y2="105" stroke="#10b981" stroke-width="3"/><line x1="112" y1="117" x2="128" y2="117" stroke="#94a3b8" stroke-width="2.5"/><text x="75" y="115" fill="#10b981" font-family="sans-serif" font-weight="bold" font-size="14">+ 10 V -</text><line x1="120" y1="117" x2="120" y2="180" stroke="#94a3b8" stroke-width="2.5"/><line x1="260" y1="80" x2="260" y2="105" stroke="#94a3b8" stroke-width="2.5"/><path d="M260 105 L248 113 L272 125 L248 137 L272 149 L260 157" fill="none" stroke="#a855f7" stroke-width="3"/><text x="235" y="135" fill="#a855f7" font-family="sans-serif" font-weight="bold" font-size="15">R</text><line x1="260" y1="157" x2="260" y2="180" stroke="#94a3b8" stroke-width="2.5"/><line x1="380" y1="80" x2="380" y2="105" stroke="#94a3b8" stroke-width="2.5"/><line x1="365" y1="105" x2="395" y2="105" stroke="#38bdf8" stroke-width="3"/><line x1="372" y1="117" x2="388" y2="117" stroke="#94a3b8" stroke-width="2.5"/><text x="410" y="115" fill="#38bdf8" font-family="sans-serif" font-weight="bold" font-size="14">+ 2 V -</text><line x1="380" y1="117" x2="380" y2="180" stroke="#94a3b8" stroke-width="2.5"/><line x1="120" y1="180" x2="380" y2="180" stroke="#94a3b8" stroke-width="2.5"/><path d="M210 180 L200 174 L200 186 Z" fill="#94a3b8"/></svg>`,
  "neet_2024_q3.svg": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 240" width="100%" height="200"><rect width="400" height="240" fill="#0f172a" rx="16"/><line x1="70" y1="20" x2="70" y2="200" stroke="#94a3b8" stroke-width="2.5"/><line x1="70" y1="200" x2="360" y2="200" stroke="#94a3b8" stroke-width="2.5"/><text x="45" y="30" fill="#f8fafc" font-family="sans-serif" font-weight="bold" font-size="14">P</text><text x="370" y="205" fill="#f8fafc" font-family="sans-serif" font-weight="bold" font-size="14">V</text><path d="M120 70 L300 70 L300 160 L120 160 Z" fill="#1e293b" stroke="#38bdf8" stroke-width="3"/><text x="110" y="60" fill="#38bdf8" font-family="sans-serif" font-weight="bold" font-size="14">a</text><text x="310" y="60" fill="#38bdf8" font-family="sans-serif" font-weight="bold" font-size="14">b</text><text x="310" y="175" fill="#38bdf8" font-family="sans-serif" font-weight="bold" font-size="14">c</text><text x="110" y="175" fill="#38bdf8" font-family="sans-serif" font-weight="bold" font-size="14">d</text><text x="300" y="220" fill="#a855f7" font-family="sans-serif" font-size="12" text-anchor="middle">V = 400 cm³</text></svg>`,
  "neet_2022_q5.svg": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 220" width="100%" height="190"><rect width="400" height="220" fill="#0f172a" rx="16"/><polygon points="200,30 320,110 200,190 80,110" fill="none" stroke="#38bdf8" stroke-width="3"/><circle cx="200" cy="110" r="14" fill="#1e293b" stroke="#f59e0b" stroke-width="2.5"/><text x="200" y="115" fill="#f59e0b" font-family="sans-serif" font-weight="bold" font-size="14" text-anchor="middle">G</text><text x="130" y="60" fill="#10b981" font-family="sans-serif" font-weight="bold" font-size="14">P = 10 Ω</text><text x="270" y="60" fill="#10b981" font-family="sans-serif" font-weight="bold" font-size="14">Q = 20 Ω</text><text x="130" y="170" fill="#a855f7" font-family="sans-serif" font-weight="bold" font-size="14">R = 5 Ω</text><text x="270" y="170" fill="#a855f7" font-family="sans-serif" font-weight="bold" font-size="14">S = 10 Ω</text></svg>`
};

function getNeetFallbackDataUri(filename: string): string | null {
  const clean = filename.replace('/neetimages/', '').replace('/', '');
  const rawSvg = neetFallbackMap[clean];
  if (rawSvg) {
    return `data:image/svg+xml;utf8,${encodeURIComponent(rawSvg)}`;
  }
  return null;
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
  const { supabaseUrl, localFallbackUrl } = getQuestionSupabaseUrl(imageUrl, examName, year);

  const [currentSrc, setCurrentSrc] = useState<string>(isDataUri ? imageUrl : supabaseUrl);

  useEffect(() => {
    if (!isDataUri) {
      const { supabaseUrl: newUrl } = getQuestionSupabaseUrl(imageUrl, examName, year);
      setCurrentSrc(newUrl);
    } else {
      setCurrentSrc(imageUrl);
    }
  }, [imageUrl, examName, year, isDataUri]);

  const handleError = () => {
    let clean = imageUrl;
    if (clean.includes("/")) {
      const parts = clean.split("/");
      clean = parts[parts.length - 1];
    }
    const fallbackDataUri = getNeetFallbackDataUri(clean);
    if (fallbackDataUri && currentSrc !== fallbackDataUri) {
      console.log(`[QuestionImage] Supabase image fetch failed for ${clean}. Using vector fallback Data URI.`);
      setCurrentSrc(fallbackDataUri);
    } else if (!isDataUri && currentSrc !== localFallbackUrl) {
      setCurrentSrc(localFallbackUrl);
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

      const { supabaseUrl, localFallbackUrl } = getQuestionSupabaseUrl(url, examName, year);
      const img = new Image();

      const handleComplete = () => {
        loadedCount++;
        if (onProgress) onProgress(loadedCount, total);
        resolve();
      };

      img.onload = handleComplete;
      img.onerror = () => {
        const fallbackImg = new Image();
        fallbackImg.onload = handleComplete;
        fallbackImg.onerror = handleComplete;
        fallbackImg.src = localFallbackUrl;
      };

      img.src = supabaseUrl;
    });
  });

  await Promise.all(loadPromises);
  return { loaded: loadedCount, total };
}
