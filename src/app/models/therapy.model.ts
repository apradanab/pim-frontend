export type Therapy = {
  id: string;
  title: string;
  description: string;
  content: string;
  image: string;
  createdAt: Date;
  updatedAt: Date;
};

export type TherapyStyle = {
  bgColor: string;
  tags: string[];
};
