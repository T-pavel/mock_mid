const KEY = "idCardForm";
export type UserRole = "provider" | "functionalAdmin" | "project" | "other";

export function saveIdCardForm<T>(data: T) {
  try {
    localStorage.setItem(KEY, JSON.stringify(data));
  } catch {
    console.error("Failed to save id card form");
  }
}

export function loadIdCardForm<T>(): T | null {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

export function clearIdCardForm() {
  try {
    localStorage.removeItem(KEY);
  } catch {
    console.error("Failed to clear id card form");
  }
}

export function getUserRole(): UserRole {
  try {
    const role = localStorage.getItem("userRole");
    if (
      role === "provider" ||
      role === "functionalAdmin" ||
      role === "project" ||
      role === "other"
    ) {
      return role;
    }
    return "other";
  } catch {
    return "other";
  }
}

// Attachments
export type Attachment = {
  name: string;
  type: string;
  size: number;
  dataUrl: string;
};
const ATTACH_KEY = "attachments";
const ATTACH_META_KEY = "attachmentsMeta";

export function loadAttachments(): Attachment[] {
  try {
    const raw = localStorage.getItem(ATTACH_KEY);
    return raw ? (JSON.parse(raw) as Attachment[]) : [];
  } catch {
    return [];
  }
}

export function saveAttachments(list: Attachment[]) {
  try {
    localStorage.setItem(ATTACH_KEY, JSON.stringify(list));
  } catch {
    console.error("Failed to save attachments");
  }
}

export type AttachmentsMeta = {
  termDays?: number;
  planDate?: string;
  factDate?: string;
};

export function loadAttachmentsMeta(): AttachmentsMeta {
  try {
    const raw = localStorage.getItem(ATTACH_META_KEY);
    return raw ? (JSON.parse(raw) as AttachmentsMeta) : {};
  } catch {
    return {};
  }
}

export function saveAttachmentsMeta(meta: AttachmentsMeta) {
  try {
    localStorage.setItem(ATTACH_META_KEY, JSON.stringify(meta));
  } catch {
    console.error("Failed to save attachments meta");
  }
}

// Scoped by parameter (equipmentType:paramKey)
function keyFor(base: string, scope: string) {
  return `${base}:${scope}`;
}

export function loadAttachmentsScoped(scope: string): Attachment[] {
  try {
    const raw = localStorage.getItem(keyFor(ATTACH_KEY, scope));
    return raw ? (JSON.parse(raw) as Attachment[]) : [];
  } catch {
    return [];
  }
}

export function saveAttachmentsScoped(scope: string, list: Attachment[]) {
  try {
    localStorage.setItem(keyFor(ATTACH_KEY, scope), JSON.stringify(list));
  } catch {
    console.error("Failed to save scoped attachments");
  }
}

export function loadAttachmentsMetaScoped(scope: string): AttachmentsMeta {
  try {
    const raw = localStorage.getItem(keyFor(ATTACH_META_KEY, scope));
    return raw ? (JSON.parse(raw) as AttachmentsMeta) : {};
  } catch {
    return {};
  }
}

export function saveAttachmentsMetaScoped(
  scope: string,
  meta: AttachmentsMeta
) {
  try {
    localStorage.setItem(keyFor(ATTACH_META_KEY, scope), JSON.stringify(meta));
  } catch {
    console.error("Failed to save scoped attachments meta");
  }
}

// Review (PI consideration)
export type ReviewData = {
  planDate?: string;
  factDate?: string;
  status?: "approved" | "rejected" | "none";
  rejectionReason?: string;
};

const REVIEW_KEY = "reviewMeta";

export function loadReviewScoped(scope: string): ReviewData {
  try {
    const raw = localStorage.getItem(keyFor(REVIEW_KEY, scope));
    return raw ? (JSON.parse(raw) as ReviewData) : { status: "none" };
  } catch {
    return { status: "none" };
  }
}

export function saveReviewScoped(scope: string, data: ReviewData) {
  try {
    localStorage.setItem(keyFor(REVIEW_KEY, scope), JSON.stringify(data));
  } catch {
    console.error("Failed to save review data");
  }
}

export function clearReviewScoped(scope: string) {
  try {
    localStorage.removeItem(keyFor(REVIEW_KEY, scope));
  } catch {
    console.error("Failed to clear review data");
  }
}

// Global attachments for project role
const GLOBAL_ATTACH_KEY = "globalAttachments";

export function loadGlobalAttachments(): Attachment[] {
  try {
    const raw = localStorage.getItem(GLOBAL_ATTACH_KEY);
    return raw ? (JSON.parse(raw) as Attachment[]) : [];
  } catch {
    return [];
  }
}

export function saveGlobalAttachments(list: Attachment[]) {
  try {
    localStorage.setItem(GLOBAL_ATTACH_KEY, JSON.stringify(list));
  } catch {
    console.error("Failed to save global attachments");
  }
}

// History log
type HistoryEntry = {
  id: string;
  timestamp: string; // ISO
  action: string;
  scope?: string;
  details?: string;
};

const HISTORY_KEY = "historyLog";

export function loadHistory(): HistoryEntry[] {
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    return raw ? (JSON.parse(raw) as HistoryEntry[]) : [];
  } catch {
    return [];
  }
}

export function addHistory(action: string, scope?: string, details?: string) {
  const list = loadHistory();
  const entry: HistoryEntry = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
    timestamp: new Date().toISOString(),
    action,
    scope,
    details,
  };
  try {
    localStorage.setItem(HISTORY_KEY, JSON.stringify([entry, ...list]));
    window.dispatchEvent(new CustomEvent("history:updated"));
  } catch {
    console.error("Failed to append history");
  }
}
