export type SecurityFindingSeverity = 'high' | 'medium';

export interface SecurityFinding {
  filePath: string;
  ruleId: string;
  severity: SecurityFindingSeverity;
  message: string;
  preview: string;
  line: number;
  column: number;
}
