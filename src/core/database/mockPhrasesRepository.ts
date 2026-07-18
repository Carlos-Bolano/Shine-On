import { PhrasesRepository } from './phrasesRepository';
import { Category, Phrase } from './types';
import { MOCK_CATEGORIES, MOCK_PHRASES } from './mockData';

export class MockPhrasesRepository implements PhrasesRepository {
  private phrases: Phrase[] = [...MOCK_PHRASES];

  async getCategories(): Promise<Category[]> {
    return MOCK_CATEGORIES;
  }

  async getPhrases(categoryIds?: string[]): Promise<Phrase[]> {
    if (!categoryIds || categoryIds.length === 0) {
      return this.phrases;
    }
    return this.phrases.filter(phrase => categoryIds.includes(phrase.categoryId));
  }

  async toggleLike(phraseId: string): Promise<void> {
    const phraseIndex = this.phrases.findIndex(p => p.id === phraseId);
    if (phraseIndex !== -1) {
      this.phrases[phraseIndex] = {
        ...this.phrases[phraseIndex],
        likes: this.phrases[phraseIndex].likes + 1,
      };
    }
  }
}
