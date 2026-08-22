export const engineAreas = ['content', 'rendering', 'navigation', 'events'] as const;

export type EngineArea = (typeof engineAreas)[number];
