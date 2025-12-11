// Core type definitions for Gestione Terapia Oncologica

export type UserRole = 'farmacista' | 'clinico' | 'admin';

export type ApprovalStatus = 'pending' | 'approved' | 'rejected';

export type PDTA = 'mammella' | 'urologico' | 'gastroenterico';

export type SedeIOV = 'Padova' | 'Castelfranco Veneto';

export type NotificationUrgency = 'high' | 'medium' | 'low';

// Patient anagraphics
export interface PatientAnagraphics {
  name: string;
  surname: string;
  address: string;
  telephone: string;
  fiscalCode: string;
}

// Caregiver contacts
export interface CaregiverContacts {
  name: string;
  surname: string;
  telephone: string;
}

// Pharmacological ID Card
export interface PharmacologicalIDCard {
  id: string;
  patientId: string;
  sedeIOV: SedeIOV;
  patient: PatientAnagraphics;
  caregiver: CaregiverContacts;
  createdAt: Date;
  updatedAt: Date;
  approvalStatus: ApprovalStatus;
}

// Drug in therapy plan
export interface Drug {
  id: string;
  activePrinciple: string;
  hourOfAssumption: string;
  dosage: string;
}

// Therapy Plan
export interface TherapyPlan {
  id: string;
  patientId: string;
  drugs: Drug[];
  startDate: Date;
  endDate: Date;
  createdAt: Date;
  updatedAt: Date;
  approvalStatus: ApprovalStatus;
}

// Patient
export interface Patient {
  id: string;
  name: string;
  surname: string;
  pdta: PDTA;
  sedeIOV: SedeIOV;
  idCard?: PharmacologicalIDCard;
  therapyPlan?: TherapyPlan;
  createdAt: Date;
}

// Pending Approval (ID Card + Therapy Plan together)
export interface PendingApproval {
  id: string;
  patientId: string;
  patientName: string;
  patientSurname: string;
  pdta: PDTA;
  sedeIOV: SedeIOV;
  idCard: PharmacologicalIDCard;
  therapyPlan: TherapyPlan;
  submittedAt: Date;
  submittedBy: string; // farmacista name
  notes?: string;
}

// Questionnaire
export interface Questionnaire {
  id: string;
  title: string;
  description: string;
  frequency: string; // e.g., "daily", "weekly", "monthly"
  isActive: boolean;
  templateUrl?: string; // PDF placeholder
  patientId?: string; // if assigned to specific patient
}

// Notification
export interface Notification {
  id: string;
  patientId?: string;
  patientName?: string;
  message: string;
  urgency: NotificationUrgency;
  date: Date;
  isRead: boolean;
}

// User
export interface User {
  id: string;
  username: string;
  role: UserRole;
  name: string;
  surname: string;
}

// Auth Context State
export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (role: UserRole, username: string, password: string) => Promise<boolean>;
  logout: () => void;
}
