export interface ArxivPaperResponse {
  feed: Feed;
}

interface Feed {
  xmlns: string[];
  link: LinkItem[];
  title: TitleItem[];
  id: string[];
  updated: string[];
  'opensearch:totalresults': OpensearchTotalresultsItem[];
  'opensearch:startindex': OpensearchStartindexItem[];
  'opensearch:itemsperpage': OpensearchItemsperpageItem[];
  entry: PaperItem[];
}
interface LinkItem {
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
interface PaperItem {
  id: string[];
  updated: string[];
  published: string[];
  title: string[];
  summary: string[];
  author: AuthorItem[];
  'arxiv:comment'?: ArxivCommentItem[];
  link: LinkItem[];
  'arxiv:primary_category': ArxivPrimaryCategoryItem[];
  category: CategoryItem[];
  'arxiv:doi'?: ArxivDoiItem[];
  'arxiv:journal_ref'?: ArxivJournalRefItem[];
}
interface AuthorItem {
  name: string[];
  'arxiv:affiliation'?: ArxivAffiliationItem[];
}
interface ArxivCommentItem {
  _: string;
  'xmlns:arxiv': string[];
}
interface ArxivPrimaryCategoryItem {
  'xmlns:arxiv': string[];
  term: string[];
  scheme: string[];
}
interface CategoryItem {
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
