import type { ComponentType } from 'react';
import type { SubjectActivityBlockData } from '@interactive-textbook/common-blocks';
import { MathActivity } from './MathActivity';
import { MusicActivity } from './MusicActivity';
import { ProgressionActivity } from './ProgressionActivity';
import { VoiceLeadingActivity } from './VoiceLeadingActivity';

export interface SubjectActivityProps {
  data: SubjectActivityBlockData;
  referencedData?: unknown[];
  onComplete?: (result: unknown) => void;
}

const renderers = new Map<string, ComponentType<SubjectActivityProps>>();
export function registerSubjectActivity(subject: string, tool: string, renderer: ComponentType<SubjectActivityProps>): void {
  const key = `${subject}:${tool}`;
  if (renderers.has(key)) throw new Error(`Subject activity already registered: ${key}`);
  renderers.set(key, renderer);
}
export function resolveSubjectActivity(subject: string, tool: string): ComponentType<SubjectActivityProps> | undefined {
  return renderers.get(`${subject}:${tool}`);
}

const MathRenderer = ({ data, onComplete }: SubjectActivityProps) => <MathActivity tool={data.tool} title={data.title} input={data.input as never} onComplete={onComplete} />;
const MusicRenderer = ({ data, onComplete }: SubjectActivityProps) => <MusicActivity tool={data.tool} title={data.title} input={data.input as never} onComplete={onComplete as never} />;
const ProgressionRenderer = ({ data, referencedData, onComplete }: SubjectActivityProps) => {
  const input = data.input as { progressions?: unknown[] };
  return <ProgressionActivity tool={data.tool} title={data.title} input={{ ...input, progressions: input.progressions?.length ? input.progressions : referencedData?.[0] } as never} onComplete={onComplete} />;
};
const VoiceLeadingRenderer = ({ data, onComplete }: SubjectActivityProps) => <VoiceLeadingActivity title={data.title} input={data.input as never} onComplete={onComplete} />;

['point-plotter', 'function-machine', 'line-builder', 'intersection-finder'].forEach((tool) => registerSubjectActivity('math', tool, MathRenderer));
['pitch-pair-viewer', 'semitone-explorer', 'interval-builder', 'chord-builder'].forEach((tool) => registerSubjectActivity('music', tool, MusicRenderer));
['progression-player', 'cadence-listener'].forEach((tool) => registerSubjectActivity('music', tool, ProgressionRenderer));
registerSubjectActivity('music', 'voice-leading-editor', VoiceLeadingRenderer);
