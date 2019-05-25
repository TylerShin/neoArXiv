declare namespace BioRxiv {
  type FEED_CATEGORY =
    | 'All'
    | 'Animal Behavior and Cognition'
    | 'Biochemistry'
    | 'Bioengineering'
    | 'Bioinformatics'
    | 'Biophysics'
    | 'Cancer Biology'
    | 'Cell Biology'
    | 'Clinical Trials'
    | 'Developmental Biology'
    | 'Ecology'
    | 'Epidemiology'
    | 'Evolutionary Biology'
    | 'Genetics'
    | 'Genomics'
    | 'Immunology'
    | 'Microbiology'
    | 'Molecular Biology'
    | 'Neuroscience'
    | 'Paleontology'
    | 'Pathology'
    | 'Pharmacology and Toxicology'
    | 'Physiology'
    | 'Plant Biology'
    | 'Scientific Communication and Education'
    | 'Synthetic Biology'
    | 'Systems Biology'
    | 'Zoology';

  interface RSSResponse {
    items: FeedItem[];
    title: string;
    description: string;
    link: string;
  }

  interface FeedItem {
    id?: string;
    creator?: string;
    date?: string;
    title?: string;
    link?: string;
    content?: string;
    contentSnippet?: string;
    isoDate?: string;
  }
}
