export interface ISessionStorageService {
  getItem(key: string, removeAfterRead?: boolean): string;
  setItem(key: string, value: string): void;
}
