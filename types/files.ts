import matter from "gray-matter";
type DataType = {
  title: string;
  date: string;
  excerpt: string;
  categories: string;
};

export type MdMatter = Omit<matter.GrayMatterFile<string>, "data"> & {
  data: DataType;
};

export type mdFile = {
  id: string;
  mdMatter: MdMatter;
  mdHtml: string;
  mdEnHtml?: string;
  other?: {
    picPath: string;
  };
};
