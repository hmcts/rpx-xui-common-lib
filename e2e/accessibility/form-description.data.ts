import type { DescriptionContract } from './description-contract';

export const formDescriptionStates = ['initial', 'errors', 'cleared'] as const;

export function formDescriptions(state: typeof formDescriptionStates[number]): DescriptionContract[] {
  return [
    { selector: '#priority', id: 'priority', hint: 'Choose how soon to review.', error: 'Choose a priority' },
    { selector: '#case-notes', id: 'case-notes', hint: 'Include only synthetic notes.', error: 'Enter case notes' },
    { selector: '#review-notes', id: 'review-notes', hint: 'Add a synthetic review note.', error: 'Enter review notes' },
    { selector: '#supportingFile', id: 'supportingFile', hint: 'Choose a synthetic text file.', error: 'Choose a supporting file' }
  ].map(({ selector, id, hint, error }) => ({
    selector,
    describedBy: `${id}-hint${state === 'errors' ? ` ${id}-error` : ''}`,
    targets: [{ id: `${id}-hint`, text: hint }, ...(state === 'errors' ? [{ id: `${id}-error`, text: `Error:${error}` }] : [])],
    absentIds: state === 'errors' ? [] : [`${id}-error`]
  }));
}
