import AWS from 'aws-sdk';
import axios from 'axios';
import https from 'https';
import Parser from 'rss-parser';
import fs from 'fs';
const parser = new Parser();

AWS.config.update({
  region: 'us-east-1',
  httpOptions: {
    agent: new https.Agent({
      keepAlive: true,
    }),
  },
});

async function getXMLFeed(category: BioRxiv.FEED_CATEGORY) {
  const res = await axios.get(`https://connect.biorxiv.org/biorxiv_xml.php?subject=${category}`);
  const xml = res.data;
  const json = (await parser.parseString(xml)) as BioRxiv.RSSResponse;
  fs.writeFileSync('./bioTest.json', JSON.stringify(json));
}

export const handler = async (event: any, _context: any) => {
  console.log(JSON.stringify(event, null, 2));

  await getXMLFeed('All');

  return {
    statusCode: 200,
    body: JSON.stringify({ success: true }),
  };
};
