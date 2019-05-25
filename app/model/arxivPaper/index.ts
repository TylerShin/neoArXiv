import { Decorator, Query, Table } from 'dynamo-types';
import {
  AuthorItem,
  CategoryItem,
  LinkItem,
  ArxivPrimaryCategoryItem,
  RawArxivPaper,
  IArxivPaper,
  RawAuthorItem,
  RawLinkItem,
  RawCategoryItem,
  RawArxivPrimaryCategoryItem,
} from './types';

@Decorator.Table({ name: `neoarxiv-arxiv-paper` })
export class ArxivPaper extends Table {
  @Decorator.HashPrimaryKey('id')
  public static readonly primaryKey: Query.HashPrimaryKey<ArxivPaper, string>;

  @Decorator.Writer()
  public static readonly writer: Query.Writer<ArxivPaper>;

  @Decorator.Attribute({ name: 'id' })
  public id: string;

  @Decorator.Attribute({ name: 'updated' })
  public updated: string;

  @Decorator.Attribute({ name: 'published' })
  public published: string;

  @Decorator.Attribute({ name: 'title' })
  public title: string;

  @Decorator.Attribute({ name: 'summary' })
  public summary: string;

  @Decorator.Attribute({ name: 'author' })
  public author: AuthorItem[];

  @Decorator.Attribute({ name: 'category' })
  public category: CategoryItem[];

  @Decorator.Attribute({ name: 'link' })
  public link: LinkItem[];

  @Decorator.Attribute({ name: 'arxiv:primary_category' })
  public 'arxiv:primary_category': ArxivPrimaryCategoryItem[];

  @Decorator.Attribute({ name: 'arxiv:doi' })
  public 'arxiv:doi'?: string;

  @Decorator.Attribute({ name: 'arxiv:journal_ref' })
  public 'arxiv:journal_ref'?: string;

  @Decorator.Attribute({ name: 'arxiv:comment' })
  public 'arxiv:comment'?: string;

  public static formatPaper(rawPaper: RawArxivPaper): IArxivPaper {
    function mapAuthorList(authors: RawAuthorItem[]): AuthorItem[] {
      return authors.map(author => ({
        name: author.name[0],
        'arxiv:affiliation': author['arxiv:affiliation'] ? author['arxiv:affiliation'][0]._ : undefined,
      }));
    }

    function mapLinkList(links: RawLinkItem[]): LinkItem[] {
      return links.map(link => ({
        href: link.href[0],
        rel: link.rel[0],
        type: link.type ? link.type[0] : undefined,
        title: link.title ? link.title[0] : undefined,
      }));
    }

    function mapCategoryList(categories: RawCategoryItem[]): CategoryItem[] {
      return categories.map(c => ({
        term: c.term[0],
        scheme: c.scheme[0],
      }));
    }

    function mapArxivJournalRefList(items: RawArxivPrimaryCategoryItem[]): ArxivPrimaryCategoryItem[] {
      return items.map(item => ({
        'xmlns:arxiv': item['xmlns:arxiv'][0],
        term: item.term[0],
        scheme: item.scheme[0],
      }));
    }

    return {
      id: rawPaper.id[0],
      updated: rawPaper.updated[0],
      published: rawPaper.published[0],
      title: rawPaper.title[0],
      summary: rawPaper.summary[0],
      author: mapAuthorList(rawPaper.author),
      link: mapLinkList(rawPaper.link),
      category: mapCategoryList(rawPaper.category),
      'arxiv:comment': rawPaper['arxiv:comment'] ? rawPaper['arxiv:comment'][0]._ : undefined,
      'arxiv:doi': rawPaper['arxiv:doi'] ? rawPaper['arxiv:doi'][0]._ : undefined,
      'arxiv:journal_ref': rawPaper['arxiv:journal_ref'] ? rawPaper['arxiv:journal_ref'][0]._ : undefined,
      'arxiv:primary_category': mapArxivJournalRefList(rawPaper['arxiv:primary_category']),
    };
  }
}

export default ArxivPaper;
