export const Roles = {
  USER: "user",
  ASSISTANT: "assistant",
} as const;

export type Role = typeof Roles[keyof typeof Roles];

export type ChatMessage = {
  role: Role;
  content: string;
};