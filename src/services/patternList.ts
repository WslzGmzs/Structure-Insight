export function parsePatternList(value: string): string[] {
  return value
    .split(',')
    .map((pattern) => pattern.trim())
    .filter(Boolean);
}
