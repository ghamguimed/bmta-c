import { AdminParameters } from "../types";
import { defaultParameters } from "./seed";

const STORAGE_KEY = "bmta-admin-params";

export function loadAdminParameters(): AdminParameters {
  if (typeof window === "undefined") {
    return defaultParameters;
  }
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    return defaultParameters;
  }

  try {
    return JSON.parse(raw) as AdminParameters;
  } catch {
    return defaultParameters;
  }
}

export function saveAdminParameters(params: AdminParameters) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(params));
}
