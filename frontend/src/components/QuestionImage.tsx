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
  // Clean filename: extract just the file name (e.g. 9sep_shift2_q1_question.png)
  let cleanFileName = imageUrl;
  if (cleanFileName.includes("/")) {
    const parts = cleanFileName.split("/");
    cleanFileName = parts[parts.length - 1];
  }

  // Determine exact folder name matching Supabase bucket structure:
  // "Jee Mains", "Jee Advance", "SSC CGL", "SSC CHSL", "Gate"
  let folderExam = "Jee Mains";
  const lowerExam = examName.toLowerCase();
  if (lowerExam.includes("advance")) {
    folderExam = "Jee Advance";
  } else if (lowerExam.includes("ssc cgl") || lowerExam.includes("cgl")) {
    folderExam = "SSC CGL";
  } else if (lowerExam.includes("ssc chsl") || lowerExam.includes("chsl")) {
    folderExam = "SSC CHSL";
  } else if (lowerExam.includes("neet")) {
    const storagePath = `NEET/${cleanFileName}`;
    const { data } = supabase.storage
      .from("QuestionBank")
      .getPublicUrl(storagePath);
    return { supabaseUrl: data?.publicUrl || imageUrl, localFallbackUrl: imageUrl };
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

export const QuestionImage: React.FC<QuestionImageProps> = ({
  imageUrl,
  examName = "Jee Mains",
  year,
  alt = "Question Diagram",
  className = "max-h-72 object-contain",
}) => {
  if (!imageUrl) return null;

  // If imageUrl is already a data URI or external non-Supabase full URL, use as is
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
    if (!isDataUri && currentSrc !== localFallbackUrl) {
      console.warn(
        `[QuestionImage] Failed to load image from Supabase (${currentSrc}). Falling back to local public image (${localFallbackUrl}).`
      );
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
