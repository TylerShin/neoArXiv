import { Decorator, Query, Table } from 'dynamo-types';

@Decorator.Table({ name: `neoarxiv-biorxiv-paper` })
export class BioRxivPaper extends Table {
  @Decorator.HashPrimaryKey('id')
  public static readonly primaryKey: Query.HashPrimaryKey<BioRxivPaper, string>;

  @Decorator.Writer()
  public static readonly writer: Query.Writer<BioRxivPaper>;

  // category + id
  @Decorator.Attribute({ name: 'id' })
  public id: string;

  @Decorator.Attribute({ name: 'rawId' })
  public rawId: string;

  @Decorator.Attribute({ name: 'creator' })
  public creator: string;

  @Decorator.Attribute({ name: 'date' })
  public date: string;

  @Decorator.Attribute({ name: 'title' })
  public title: string;

  @Decorator.Attribute({ name: 'link' })
  public link: string;

  @Decorator.Attribute({ name: 'content' })
  public content: string;

  @Decorator.Attribute({ name: 'contentSnippet' })
  public contentSnippet: string;

  @Decorator.Attribute({ name: 'isoDate' })
  public isoDate: string;

  @Decorator.Attribute({ name: 'category' })
  public category: BioRxiv.FEED_CATEGORY;

  public static getRawItem(item: BioRxiv.BioRxivPaper): BioRxiv.RawFeedItem {
    const { category, ...rawItem } = item;
    return rawItem;
  }
}

export default BioRxivPaper;
