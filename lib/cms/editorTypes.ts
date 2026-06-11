import type { HomeContent } from "@/lib/content/home";
import type { CmsRole } from "@/lib/cms/types";

export type EditorSaveStatus = "idle" | "dirty" | "saving" | "saved" | "error";
export type EditorPublishStatus =
  | "idle"
  | "publishing"
  | "published"
  | "error"
  | "mfa_required";

export interface CmsMfaState {
  active: boolean;
}

export interface CmsSessionState {
  user: {
    userId: string;
    email: string | null;
    role: CmsRole;
  };
  mfa: CmsMfaState;
}

export type HomePageEditorPayload = HomeContent;
