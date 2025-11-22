export interface Appointment {
  PK?: string;
  SK?: string;
  Type?: 'Appointment';
  GSI1PK?: string;
  GSI1SK?: string;
  GSI2PK?: string;
  GSI2SK?: string;
  appointmentId: string;
  therapyId: string;
  userId?: string;
  userEmail?: string;
  date: string;
  startTime: string;
  endTime: string;
  participants?: UserParticipant[];
  currentParticipants?: number;
  maxParticipants?: number;
  status: AppointmentStatus;
  notes?: string;
  adminNotes?: string;
  createdAt: string;
  requestedAt?: string;
}

export interface AppointmentInput {
  therapyId: string;
  date: string;
  startTime: string;
  endTime: string;
  maxParticipants?: number;
  notes?: string;
}

export interface UserParticipant {
  userId: string;
  userEmail: string;
  userName: string;
  joinedAt: string;
  status: 'CONFIRMED' | 'CANCELLED';
}

export enum AppointmentStatus {
  PENDING = 'PENDING',
  OCCUPIED = 'OCCUPIED',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
  AVAILABLE = 'AVAILABLE'
}

export interface CancellationDetails {
  notes: string;
}

export interface AppointmentDeletionInfo {
  therapyId: string;
  appointmentId: string;
}
