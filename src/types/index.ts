export type Tone = 'normal' | 'urgent' | 'flexible';
export interface Shift {
  id: string;
  clientId: string;
  district: string;
  start: number;
  end: number;
  maxDelay: number;
  skills: string[];
  femaleRequired: boolean;
  critical: boolean;
  familiarIds: string[];
  caregiverId: string;
  status: 'scheduled' | 'pending' | 'assigned' | 'cancelled';
}
export interface Caregiver {
  id: string;
  name: string;
  female: boolean;
  skills: string[];
  available: boolean;
  workMinutes: number;
  maxMinutes: number;
  recentRescues: number;
}
export interface EventRecord {
  id: string;
  type: 'leave' | 'delay' | 'stop' | 'hospital' | 'change';
  caregiverId?: string;
  shiftId?: string;
  delayMinutes: number;
  reason: string;
  createdAt: string;
  affectedIds: string[];
}
export interface Plan {
  id: string;
  shiftId: string;
  caregiverId: string;
  title: string;
  start: number;
  end: number;
  travel: number;
  familiar: boolean;
  risk: 'low' | 'medium' | 'high';
  tradeOff: string;
  summary: string;
  score: number;
}
export interface Decision {
  id: string;
  plan: Plan;
  action: 'accept' | 'modify' | 'reject';
  reason: string;
  operator: string;
  createdAt: string;
  originalCaregiverId: string;
  originalStart: number;
}
export interface Notification {
  id: string;
  decisionId: string;
  recipient: string;
  status: 'pending' | 'sent' | 'replied' | 'failed';
}
export interface AppData {
  version: 1;
  shifts: Shift[];
  caregivers: Caregiver[];
  events: EventRecord[];
  decisions: Decision[];
  notifications: Notification[];
}
