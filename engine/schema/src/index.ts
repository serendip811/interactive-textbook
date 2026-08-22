export const schemaVersion = '0.1.0' as const;

export type ContentId = string;

export interface EngineDocument {
  id: ContentId;
  schemaVersion: typeof schemaVersion;
  engineVersion: string;
}
