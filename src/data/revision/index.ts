import { RevisionConfig } from './types';
import { webdConcepts } from './webd';
import { damlConcepts } from './daml';

// The Revision feature currently covers WebD and DAML. `ml` is a supported
// revision roadmap id but has no curated concepts yet, so it stays empty.
export const revisionConfig: RevisionConfig = {
  webd: webdConcepts,
  daml: damlConcepts,
  ml: [],
};
