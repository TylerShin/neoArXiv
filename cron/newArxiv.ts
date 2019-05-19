import AWS from 'aws-sdk';
import axios from "axios";
import https from 'https';
import { getArxivDataFromId } from './api/arxiv';

AWS.config.update({
  region: 'us-east-1',
  httpOptions: {
    agent: new https.Agent({
      keepAlive: true,
    }),
  },
});

async function getFOSListLinksFromHome() {
  const homeRes = await axios.get('https://arxiv.org/');
  const homeHTML = homeRes.data;
  const $ = cheerio.load(homeHTML);
  const links = $('a[href*="/list"]')
    .map((_i, el) => $(el).attr('href'))
    .get();
  return links;
}

export async function getNewFeed() {
  const links = await getFOSListLinksFromHome();

  // TODO: Remove slice
  for (const link of links.slice(0, 2)) {
    const listRes = await axios.get(`https://arxiv.org${link}`);
    const listHTML = listRes.data;

    const $ = cheerio.load(listHTML);
    const ids = $('a[title*="Abstract"]')
      .map((_i, el) =>
        $(el)
          .text()
          .replace('arXiv:', '')
      )
      .get();

    // TODO: Remove slice
    const jsonRes = await getArxivDataFromId(ids.slice(0, 1));
    console.log(JSON.stringify(jsonRes, null, 2));
    return jsonRes;
  }
}


export const handler = async (event: any, _context: any) => {
  console.log(JSON.stringify(event, null, 2));

  await getNewFeed();
  
  return {
    statusCode: 200,
    body: JSON.stringify({ message: 'hello world' }),
  };
};
