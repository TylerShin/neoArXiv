export interface ArxivPaperResponse {
  feed: Feed;
}

interface Feed {
  xmlns: string[];
  link: RawLinkItem[];
  title: TitleItem[];
  id: string[];
  updated: string[];
  'opensearch:totalresults': OpensearchTotalresultsItem[];
  'opensearch:startindex': OpensearchStartindexItem[];
  'opensearch:itemsperpage': OpensearchItemsperpageItem[];
  entry: RawArxivPaper[];
}

export interface LinkItem {
  href: string;
  rel: string;
  type?: string;
  title?: string;
}

export interface RawLinkItem {
  href: string[];
  rel: string[];
  type?: string[];
  title?: string[];
}

interface TitleItem {
  _: string;
  type: string[];
}
interface OpensearchTotalresultsItem {
  _: string;
  'xmlns:opensearch': string[];
}
interface OpensearchStartindexItem {
  _: string;
  'xmlns:opensearch': string[];
}
interface OpensearchItemsperpageItem {
  _: string;
  'xmlns:opensearch': string[];
}

export interface RawArxivPaper {
  id: string[];
  updated: string[];
  published: string[];
  title: string[];
  summary: string[];
  author: RawAuthorItem[];
  'arxiv:comment'?: RawArxivCommentItem[];
  link: RawLinkItem[];
  'arxiv:primary_category': RawArxivPrimaryCategoryItem[];
  category: RawCategoryItem[];
  'arxiv:doi'?: ArxivDoiItem[];
  'arxiv:journal_ref'?: ArxivJournalRefItem[];
}

export interface IArxivPaper {
  id: string;
  updated: string;
  published: string;
  title: string;
  summary: string;
  author: AuthorItem[];
  category: CategoryItem[];
  'arxiv:comment'?: string;
  'arxiv:doi'?: string;
  link: LinkItem[];
  'arxiv:journal_ref'?: string;
  'arxiv:primary_category': ArxivPrimaryCategoryItem[];
}

export interface AuthorItem {
  name: string;
  'arxiv:affiliation'?: string;
}

export interface RawAuthorItem {
  name: string[];
  'arxiv:affiliation'?: ArxivAffiliationItem[];
}

interface RawArxivCommentItem {
  _: string;
  'xmlns:arxiv': string[];
}

export interface RawArxivPrimaryCategoryItem {
  'xmlns:arxiv': string[];
  term: string[];
  scheme: string[];
}

export interface ArxivPrimaryCategoryItem {
  'xmlns:arxiv': string;
  term: string;
  scheme: string;
}

export interface CategoryItem {
  term: string;
  scheme: string;
}

export interface RawCategoryItem {
  term: string[];
  scheme: string[];
}

interface ArxivAffiliationItem {
  _: string;
  'xmlns:arxiv': string[];
}

interface ArxivDoiItem {
  _: string;
  'xmlns:arxiv': string[];
}

interface ArxivJournalRefItem {
  _: string;
  'xmlns:arxiv': string[];
}
