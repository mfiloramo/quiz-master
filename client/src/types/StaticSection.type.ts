export type StaticSectionType = {
  id: string;
  subtitle: string;
  paragraphs: string[];
  background?: string;
  photo?: {
    src: string;
    alt: string;
  };
};
