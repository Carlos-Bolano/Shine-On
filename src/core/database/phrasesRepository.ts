import { Category, Phrase } from './types';

export interface PhrasesRepository {
  getCategories(): Promise<Category[]>;
  getPhrases(categoryIds?: string[]): Promise<Phrase[]>;
  toggleLike(phraseId: string): Promise<void>;
}
