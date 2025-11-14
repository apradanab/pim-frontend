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
  bgColor?: string;
  createdAt: string;
};

export interface TherapyFormValue {
  title: string;
  description: string;
  content: string;
  maxParticipants: number;
  bgColor: string;
}
