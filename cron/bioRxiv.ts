import AWS from 'aws-sdk';
import axios from 'axios';
import https from 'https';
import Parser from 'rss-parser';
import _ from 'lodash';
import BioRxivPaper from '../app/model/bioRxivPaper';
const parser = new Parser({
  defaultRSS: 1.0,
  customFields: {
    item: [['dc:identifier', 'id'], ['dc:creator', 'creator'], ['dc:date', 'date']],
  },
});

AWS.config.update({
  region: 'us-east-1',
  httpOptions: {
    agent: new https.Agent({
      keepAlive: true,
    }),
  },
});

const ALL_POSSIBLE_CATEGORIES: BioRxiv.FEED_CATEGORY[] = [
  'All',
  'Animal Behavior and Cognition',
  'Biochemistry',
  'Bioengineering',
  'Bioinformatics',
  'Biophysics',
  'Cancer Biology',
  'Cell Biology',
  'Clinical Trials',
  'Developmental Biology',
  'Ecology',
  'Epidemiology',
  'Evolutionary Biology',
  'Genetics',
  'Genomics',
  'Immunology',
  'Microbiology',
  'Molecular Biology',
  'Neuroscience',
  'Paleontology',
  'Pathology',
  'Pharmacology and Toxicology',
  'Physiology',
  'Plant Biology',
  'Scientific Communication and Education',
  'Synthetic Biology',
  'Systems Biology',
  'Zoology',
];

async function getXMLFeed(category: BioRxiv.FEED_CATEGORY): Promise<BioRxiv.RSSResponse> {
  const res = await axios.get(`https://connect.biorxiv.org/biorxiv_xml.php?subject=${category}`);
  const xml = res.data;
  const json = (await parser.parseString(xml)) as BioRxiv.RSSResponse;
  return json;
}

function uniqueAddToArray<T>(arr: T[], item: T) {
  const set = new Set(arr);
  set.add(item);
  return Array.from(set);
}

function updateCategory(paper: BioRxiv.BioRxivPaper, newCategory: BioRxiv.FEED_CATEGORY) {
  return { ...paper, category: uniqueAddToArray<BioRxiv.FEED_CATEGORY>(paper.category, newCategory) };
}

async function divideNewOldItems(feed: BioRxiv.RawFeedItem[], category: BioRxiv.FEED_CATEGORY) {
  const newItems: BioRxiv.BioRxivPaper[] = [];
  const itemsToUpdate: BioRxiv.BioRxivPaper[] = [];

  for (const item of feed) {
    if (item.id) {
      const res = await BioRxivPaper.primaryKey.get(item.id);
      if (res) {
        const oldPaper = res.serialize() as BioRxiv.BioRxivPaper;
        const oldRawPaper = BioRxivPaper.getRawItem(oldPaper);
        const isEqual = _.isEqual(item.id, oldRawPaper.id);
        if (!isEqual) {
          const paper = updateCategory(oldPaper, category);
          itemsToUpdate.push(paper);
        }
      } else {
        const paper = { ...item, category: [category] } as BioRxiv.BioRxivPaper;
        newItems.push(paper);
      }
    }
  }

  console.log(`Found ${newItems.length} new papers`);
  console.log(`Found ${itemsToUpdate.length} papers need to be updated`);

  return [newItems, itemsToUpdate];
}

function mapFeedToBioRxivPaperInstance(feed: BioRxiv.RawFeedItem[]) {
  return feed.map(item => {
    const paperModel = new BioRxivPaper();
    paperModel.setAttributes(item);
    return paperModel;
  });
}

async function saveNewItems(feed: BioRxiv.RawFeedItem[]) {
  await BioRxivPaper.writer.batchPut(mapFeedToBioRxivPaperInstance(feed));
}

async function updateOldItems(feed: BioRxiv.RawFeedItem[]) {
  await BioRxivPaper.writer.batchPut(mapFeedToBioRxivPaperInstance(feed));
}

async function saveAndUpdateItems(category: BioRxiv.FEED_CATEGORY) {
  const res = await getXMLFeed(category);
  const feed = res.items;
  const [newItems, itemsToUpdate] = await divideNewOldItems(feed, category);
  await Promise.all([saveNewItems(newItems), updateOldItems(itemsToUpdate)]);
}

export const handler = async (event: any, _context: any) => {
  console.log(JSON.stringify(event, null, 2));
  await Promise.all(ALL_POSSIBLE_CATEGORIES.map(category => saveAndUpdateItems(category)));
  return {
    statusCode: 200,
    body: JSON.stringify({ success: true }),
  };
};
