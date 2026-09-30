import { CreateArticleRequest } from '../types/article.types';

export function createArticleData(): CreateArticleRequest {
  const random = Date.now();
  return {
    article: {
      title: `Test title ${random}`,
      description: `Test description ${random}`,
      body: `Test body ${random}`,
      tagList: [`tag-${random}`]
    }
  };
}
