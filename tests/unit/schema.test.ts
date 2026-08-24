import { describe, expect, it } from 'vitest';
import { blockVersion, isContentId, migrateBookFrom010, type Book, validateBook, validateBookIdentity } from '../../engine/schema/src';
const book: Book = { id: 'harmony', schemaVersion: '0.2.0', contentVersion: '0.1.0', engineVersion: '0.1.0', subject: 'music', title: '화성학', language: 'ko-KR', parts: [{ id: 'part.01', title: '음', lessons: [{ id: 'lesson.01-01', title: '음의 성질', objectives: [{ id: 'objective.01-01.a', title: '음을 설명한다' }], blocks: [{ id: 'block.01-01.intro', blockVersion, type: 'content.markdown', objectiveRefs: ['objective.01-01.a'], data: { markdown: '본문' } }], completion: { type: 'all-objectives' } }] }] };
describe('content schema', () => {
  it('accepts stable IDs', () => { expect(isContentId('lesson.01-02')).toBe(true); expect(isContentId('Lesson 1')).toBe(false); });
  it('detects duplicate identities', () => { expect(validateBookIdentity(book)).toEqual([]); const copy = structuredClone(book); copy.parts[0].lessons[0].blocks[0].id = copy.parts[0].id; expect(validateBookIdentity(copy)).toContain('duplicate:part.01'); });
  it('validates versions, references, block kinds and assessment answers', () => {
    expect(validateBook(book, { supportedBlockTypes: ['content.markdown'] })).toEqual([]);
    const copy = structuredClone(book);
    copy.parts[0].lessons[0].blocks[0].objectiveRefs = ['objective.missing'];
    expect(validateBook(copy).map((issue) => issue.code)).toContain('broken-reference');
  });
  it('migrates 0.1 blocks without mutating the source', () => {
    const legacy = structuredClone(book) as unknown as { schemaVersion: string; parts: Array<{ lessons: Array<{ blocks: Array<{ blockVersion?: string }> }> }> };
    legacy.schemaVersion = '0.1.0';
    delete legacy.parts[0].lessons[0].blocks[0].blockVersion;
    const migrated = migrateBookFrom010(legacy);
    expect(migrated.schemaVersion).toBe('0.2.0');
    expect(migrated.parts[0].lessons[0].blocks[0].blockVersion).toBe('1.0.0');
    expect(legacy.parts[0].lessons[0].blocks[0].blockVersion).toBeUndefined();
  });
});
