export type StaticSectionType = {
  section: {
    id: string;
    subtitle: string;
    paragraphs: string[];
    background?: string;
    photo?: {
      src: string;
      alt: string;
    };
  };
};
