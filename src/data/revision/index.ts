import { RevisionConfig } from './types';
import { webdConcepts } from './webd';
import { damlConcepts } from './daml';
import { dsaConcepts } from './dsa';
import { goConcepts } from './go';
import { mlConcepts } from './ml';
import { reactNativeConcepts } from './reactnative';

export const revisionConfig: RevisionConfig = {
  webd: webdConcepts,
  daml: damlConcepts,
  ml: mlConcepts,
  dsa: dsaConcepts,
  go: goConcepts,
  reactnative: reactNativeConcepts,
};
