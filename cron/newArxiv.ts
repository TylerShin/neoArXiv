import AWS from 'aws-sdk';
import axios from 'axios';
import https from 'https';
import cheerio from 'cheerio';
import { getArxivDataFromId } from './api/arxiv';
import { ArxivPaperResponse } from '../app/model/arxivPaper/types';
import ArxivPaper from '../app/model/arxivPaper';

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

export async function getNewFeed(): Promise<ArxivPaperResponse | undefined> {
  const links = await getFOSListLinksFromHome();

  /*
    PLEASE don't change below code to a parallel request.
    It is following the https://arxiv.org/help/robots policy.
    Let's save the research world together.
  */
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

    const jsonRes = await getArxivDataFromId(ids);
    console.log(JSON.stringify(jsonRes, null, 2));
    return jsonRes;
  }
}

export const handler = async (event: any, _context: any) => {
  console.log(JSON.stringify(event, null, 2));
  const response = await getNewFeed();

  if (response && response.feed.entry && response.feed.entry.length > 0) {
    const rawPaperList = response.feed.entry;

    const papers = rawPaperList.map(paper => ArxivPaper.formatPaper(paper));
    console.log(JSON.stringify(papers, null, 2));
    const paperModelList = papers.map(p => {
      const paper = new ArxivPaper();
      paper.setAttributes(p);
      return paper;
    });

    await ArxivPaper.writer.batchPut(paperModelList);
  }

  return {
    statusCode: 200,
    body: JSON.stringify({ success: true }),
  };
};
