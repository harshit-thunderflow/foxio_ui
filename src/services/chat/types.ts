// --- Conversations ---
export interface CreateConversationRequest {
  platform: string;
  source_url: string;
  page_title: string;
}

export interface Conversation {
  conversation_id: string;
  title: string;
  platform: string;
  source_url: string;
  created_at: string;
  updated_at: string;
}

// --- Messages ---
export interface Message {
  message_id: string;
  role: string;
  content: string;
  created_at: string;
}

// --- Context Snapshot ---
export interface PageContextPayload {
  url: string;
  title: string;
  visible_text: string;
  headings: string[];
  selected_text: string;
  interactive_elements: { type: string; text: string; selector: string }[];
  metadata: { site: string; language: string };
}

export interface CreateContextSnapshotRequest {
  conversation_id: string;
  platform: string;
  page_context: PageContextPayload;
}

export interface ContextSnapshot {
  context_id: string;
  conversation_id: string;
  content_hash: string;
  status: string;
  created_at: string;
  deduplicated: boolean;
}

// --- Chat ---
export interface SendMessageRequest {
  conversation_id: string;
  context_id: string;
  message: string;
}

export interface ChatResponse {
  conversation_id: string;
  message_id: string;
  answer: string;
  citations: string[];
  suggested_actions: string[];
}

// --- Feedback ---
export interface SendFeedbackRequest {
  rating: "thumbs_up" | "thumbs_down";
  comment?: string;
}

export interface FeedbackResponse {
  status: string;
  message: string;
}

// --- Error ---
export interface ValidationError {
  detail: { loc: (string | number)[]; msg: string; type: string }[];
}
