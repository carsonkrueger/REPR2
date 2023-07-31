export const CreatePostSelectionType = {
  gallery: "gallery",
  camera: "camera",
} as const;

export type CreatePostSelectionType = keyof typeof CreatePostSelectionType;
