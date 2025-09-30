export enum GrantType {
  FEDERAL = 'Federal',
  STATE = 'State',
  CORPORATE = 'Corporate',
  OTHER = 'Other',
}

export interface Grant {
  name: string;
  description: string;
  type: GrantType;
  awardAmount?: string;
  eligibility?: string;
  deadline?: string;
  website: string;
}

// FIX: Renamed NewsArticle to Article to resolve an import error in components/ArticleList.tsx and improve type consistency.
export interface Article {
  title: string;
  url: string;
}
