export interface Article {
  slug: string;
  title: string;
  description: string;
  body: string;
  tagList: string[];
  createdAt: string;
  updatedAt: string;
  favorited: boolean;
  favoritesCount: number;
  author: Author;
}
export interface Author {
  username: string;
  bio: string | null;
  image: string;
  following: boolean;
}

export interface CreateArticleResponse {
  article: Article;
}

export interface ArticlesResponse {
  articles: Article[];
  articlesCount: number;
}

export interface CreateArticleRequest {
  article: {
    title: string;
    description: string;
    body: string;
    tagList?: string[];
  };
}

export type ArticleData = {
  title: string;
  description: string;
  body: string;
  tags: string[];
};

export interface ArticlesFilters {
  tag?: string;
  author?: string;
  favorited?: string;
  limit?: number;
  offset?: number;
}

export interface Comment {
  id: number;
  createdAt: string;
  updatedAt: string;
  body: string;
  author: Author;
}

export interface CreatedCommentResponse {
  comment: Comment;
}

export interface CommentsResponse {
  comments: Comment[];
}
