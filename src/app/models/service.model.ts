export type Service = {
  id: string;
  title: string;
  description: string;
  content: string;
  image: string;
  createdAt: Date;
  updatedAt: Date;
};

export type ServiceStyle = {
  bgColor: string;
  tags: string[];
};
