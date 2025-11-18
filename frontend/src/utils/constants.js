export const FILE_TYPES = {
  VIDEO: 'video',
  IMAGE: 'image',
  DOCUMENT: 'document',
  AUDIO: 'audio',
  OTHER: 'other',
};

export const USER_ROLES = {
  ADMIN: 'admin',
  PRODUCER: 'producer',
  EDITOR: 'editor',
  VIEWER: 'viewer',
};

export const FILE_STATUS = {
  UPLOADING: 'uploading',
  PROCESSING: 'processing',
  READY: 'ready',
  FAILED: 'failed',
  ARCHIVED: 'archived',
};

export const MAX_FILE_SIZE = 5368709120; // 5GB en bytes

export const ACCEPTED_FILE_TYPES = {
  video: 'video/*',
  image: 'image/*',
  document: '.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx',
  all: '*',
};