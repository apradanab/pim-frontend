export type Advice = {
  adviceId: string;
  therapyId: string;
  title: string;
  description: string;
  content: string;
  image: {
    key: string;
    url: string;
    size?: number;
    contentType?: string;
  };
  createdAt: string;
}
