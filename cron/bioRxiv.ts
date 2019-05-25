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

async function divideNewOldItems(feed: BioRxiv.FeedItem[]) {
  const newItems: BioRxiv.FeedItem[] = [];
  const itemsToUpdate: BioRxiv.FeedItem[] = [];
  for (const item of feed) {
    if (item.id) {
      const res = await BioRxivPaper.primaryKey.get(item.id);
      if (res) {
        const isEqual = _.isEqual(item, res.serialize());
        if (!isEqual) {
          itemsToUpdate.push(item);
        }
      } else {
        newItems.push(item);
      }
    }
  }
  return [newItems, itemsToUpdate];
}

function mapFeedToBioRxivPaperInstance(feed: BioRxiv.FeedItem[], category: BioRxiv.FEED_CATEGORY) {
  return feed.map(item => {
    const paperModel = new BioRxivPaper();
    paperModel.setAttributes(item);
    paperModel.setAttribute('id', item.id + category);
    paperModel.setAttribute('rawId', item.id);
    paperModel.setAttribute('category', category);
    return paperModel;
  });
}

async function saveNewItems(feed: BioRxiv.FeedItem[], category: BioRxiv.FEED_CATEGORY) {
  await BioRxivPaper.writer.batchPut(mapFeedToBioRxivPaperInstance(feed, category));
}

async function updateOldItems(feed: BioRxiv.FeedItem[], category: BioRxiv.FEED_CATEGORY) {
  await BioRxivPaper.writer.batchPut(mapFeedToBioRxivPaperInstance(feed, category));
}

async function saveAndUpdateItems(category: BioRxiv.FEED_CATEGORY) {
  const res = await getXMLFeed(category);
  const feed = res.items;
  const [newItems, itemsToUpdate] = await divideNewOldItems(feed);
  await Promise.all([saveNewItems(newItems, category), updateOldItems(itemsToUpdate, category)]);
}

export const handler = async (event: any, _context: any) => {
  console.log(JSON.stringify(event, null, 2));
  await Promise.all(ALL_POSSIBLE_CATEGORIES.map(category => saveAndUpdateItems(category)));

  return {
    statusCode: 200,
    body: JSON.stringify({ success: true }),
  };
};
