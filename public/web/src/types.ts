// Common interfaces for the Haiku application

export interface HaikuType {
  _id: string;
  line1: string;
  line2: string;
  line3: string;
  username: string;
  font: string;
  created_at: string;
  upvotes: number;
  downvotes: number;
  top?: number;
  left?: number;
  myvote?: {
    _id?: string;
    direction: 'up' | 'down';
  };
}

export interface VoteType {
  _id: string;
  direction: 'up' | 'down';
}

export interface UserType {
  _id: string;
  username: string;
  summary?: string;
  area?: any;
  unread_message_count?: number;
  unseen_notifications_count?: number;
  conv_block_users?: string[];
  avatar?: string;
}

export interface HaikuFormProps {
  addHaiku: (haiku: HaikuType) => void;
}

export interface HaikuProps {
  data: HaikuType;
}

export interface VoteBoxProps {
  haiku: HaikuType;
  vote: (direction: 'up' | 'down') => Promise<void>;
}

export interface HaikuResponse {
  haiku: HaikuType;
}

export interface HaikuListResponse {
  haiku: HaikuType[];
}

export interface UserResponse {
  users: UserType;
}