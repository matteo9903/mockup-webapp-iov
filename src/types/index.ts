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
  birthDate: string;
  address: string;
  telephone: string;
  fiscalCode: string;
  healthCardNumber: string;
}

// Caregiver contacts
export interface CaregiverContacts {
  name: string;
  surname: string;
  telephone: string;
}

export interface EmergencyNumbers {
  publicSafety: string;
  healthEmergency: string;
  nue: string;
  guardiaMedica: string;
}

export interface SpecialistContacts {
  oncologyConsultation: string;
  oncologyUrgency: string;
  hospitalPharmacy: string;
}

export interface OncologyDiagnosis {
  pathology: string;
  currentTherapies: string;
  administration: {
    oral: boolean;
    endovenous: boolean;
    subcutaneous: boolean;
    other?: string;
  };
}

// Pharmacological ID Card
export interface PharmacologicalIDCard {
  id: string;
  patientId: string;
  sedeIOV: SedeIOV;
  patient: PatientAnagraphics;
  caregiver: CaregiverContacts;
  emergencyNumbers: EmergencyNumbers;
  specialistContacts: SpecialistContacts;
  diagnosis: OncologyDiagnosis;
  comorbidities: string[];
  allergies: string[];
  createdAt: Date;
  updatedAt: Date;
  approvalStatus: ApprovalStatus;
}

// Drug in therapy plan
export type DrugScheduleFrequency = 'DAILY' | 'EVERY_OTHER_DAY' | 'ODD_DAYS' | 'EVEN_DAYS' | 'NONE' | 'CUSTOM';

export type DosageUnit = 'MG' | 'MG_M2' | 'G' | 'MG_KG';

export interface DrugSchedule {
  frequency: DrugScheduleFrequency;
  times: string[];
  notes?: string;
  customCycle?: {
    daysOn: number;
    daysOff: number;
    administrationDates: string[];
  };
}

export interface DrugDosage {
  amount: number | null;
  unit?: DosageUnit;
}

export interface DrugPhase {
  name: string;
  startDate: string;
  endDate: string;
  scheduleByDrug: Record<string, DrugSchedule>;
  dosageByDrug: Record<string, DrugDosage>;
  notes?: string;
}

export interface Drug {
  id: string;
  activePrinciple: string;
  regimenType?: 'simple' | 'combination';
  cycleDays: number;
  drugs: string[];
  protocolNotes?: string;
  phases: DrugPhase[];
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

export interface TherapyPlanHistoryEntry {
  plan: TherapyPlan;
  deactivatedAt: Date;
  deactivationReason?: string;
}

export interface Clinician extends User {
  pdta: PDTA;
  sedeIOV: SedeIOV;
}

// Patient
export interface Patient {
  id: string;
  name: string;
  surname: string;
  unitaOperativa: string;
  idCard?: PharmacologicalIDCard;
  therapyPlan?: TherapyPlan;
  therapyHistory?: TherapyPlanHistoryEntry[];
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
