export interface ParsedDamlPhaseId {
  phaseId: string;
  phaseLabel: string;
  phaseNumber: number;
}

export function parseDamlPhaseId(phaseId: string): ParsedDamlPhaseId | null {
  const match = phaseId.match(/^phase(\d+)([a-z])?$/i);
  if (!match) return null;

  const basePhaseNumber = Number.parseInt(match[1], 10);
  const suffix = match[2]?.toLowerCase();

  if (!suffix) {
    return {
      phaseId,
      phaseLabel: `${basePhaseNumber}`,
      phaseNumber: basePhaseNumber,
    };
  }

  if (suffix !== 'a') {
    return null;
  }

  return {
    phaseId,
    phaseLabel: `${basePhaseNumber}.5`,
    phaseNumber: basePhaseNumber + 0.5,
  };
}

export function parseDamlQuizFilename(fileName: string): ParsedDamlPhaseId | null {
  const match = fileName.match(/^(phase\d+[a-z]?)\.json$/i);
  if (!match) return null;

  return parseDamlPhaseId(match[1]);
}

export function isDamlRevisionFile(fileName: string): boolean {
  return /^phase\d+[a-z]?-revision\.md$/i.test(fileName);
}