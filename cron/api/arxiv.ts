import axios from 'axios';
import { parseString } from 'xml2js';
import { ArxivPaperResponse } from '../../app/model/arxivPaper/types';

export async function getArxivDataFromId(arxivIds: string[]): Promise<ArxivPaperResponse> {
  const res = await axios.get(
    `http://export.arxiv.org/api/query?start=0&max_results=${arxivIds.length}&id_list=${arxivIds.join(',')}`
  );
  const xml = res.data;
  const json = await new Promise((resolve, reject) => {
    parseString(xml, { trim: true, normalize: true, normalizeTags: true, mergeAttrs: true }, (err, json) => {
      if (err) reject(err);
      resolve(json);
    });
  });
  return json as ArxivPaperResponse;
}
