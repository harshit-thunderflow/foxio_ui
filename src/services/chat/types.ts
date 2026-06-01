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
  is_pinned: boolean;
  is_archived: boolean;
  created_at: string;
  updated_at: string;
}

export interface ConversationDetail extends Conversation {
  message_count: number;
  last_message_at: string;
}

export interface UpdateConversationRequest {
  title?: string;
  is_pinned?: boolean;
  is_archived?: boolean;
}

export interface GetConversationsParams {
  q?: string;
  page?: number;
  page_size?: number;
  archived?: boolean;
}

export interface PaginatedConversationsResponse {
  items: Conversation[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
}

// --- Messages ---
export interface Message {
  message_id: string;
  role: string;
  content: string;
  created_at: string;
}

export interface GetMessagesParams {
  page?: number;
  page_size?: number;
}

export interface PaginatedMessagesResponse {
  items: Message[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
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
