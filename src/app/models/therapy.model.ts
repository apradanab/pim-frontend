export type Therapy = {
  therapyId: string;
  title: string;
  description: string;
  content: string;
  image?: {
    key: string;
    url: string;
    size?: number;
    contentType?: string;
  };
  maxParticipants: number;
  createdAt: string;
};

export type TherapyStyle = {
  bgColor: string;
  tags: string[];
};
