export interface SearchOptions {
  caseSensitive: boolean;
  useRegex: boolean;
  wholeWord: boolean;
}

export interface SearchResultItem {
    filePath: string;
    startIndex: number;
    length: number;
    content: string;
    line: number;
    indexInFile: number;
}

