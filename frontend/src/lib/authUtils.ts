"use client";

/**
 * Utility functions to manage Guest Tour Mode
 */

export function isGuestUser(): boolean {
  if (typeof window === "undefined") return false;
  return localStorage.getItem("isGuestMode") === "true";
}

export function enableGuestMode(): void {
  if (typeof window === "undefined") return;
  localStorage.setItem("isGuestMode", "true");
  localStorage.setItem("displayName", "Guest Explorer");
}

export function clearGuestMode(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem("isGuestMode");
}
