import { DoctorWithDetailsResponse, PatientWithDetailsResponse } from './response';
// Экспортируем все типы ответов
export * from './response';
export interface User {
  login?: string;
  password?: string;
  second_name?: string;
  first_name?: string;
  middle_name?: string;
  role_name: UserRole;
}

export type UserRole = "patient" | "doctor" | "admin";

export interface Patient {
  id_patient?: number;
  login?: string;
  snils?: string;
  policy_foms?: number;
  phone_number?: string;
  e_mail?: string;
}

export interface Doctor {
  id_doctor?: number;
  login: string;
  id_medical_degree?: number;
  id_medical_profile: number;
}

export interface MedicalProfile {
  id_medical_profile?: number;
  name_medical_profile: string;
  descr_medical_profile?: string;
}

export interface Reception {
  id_reception: number;
  reception_date: string;
  reception_time: string;
  id_ambulatory_card: number;
  id_doctor: number;
}

export interface Sickness {
  id_sickness?: number;
  id_diagnos: number;
  id_reception: number;
  complaint?: string;
  medication_text?: string;
}

export interface AmbulatoryCard {
  id_ambulatory_card?: number;
  registration_date: string;
  registration_date_end?: string;
  id_patient: number;
}

export interface SickSheet {
  id_sick_sheet?: number;
  sick_sheet_date: string;
  next_date?: string;
  id_sickness: number;
}

export interface Diagnos {
  id_diagnos?: number;
  diagnos_name: string;
}

export interface Medicament {
  id_medicament?: number;
  medicament_name: string;
  medicament_descr?: string;
}

export interface Medication {
  id_medication?: number;
  id_medicament: number;
  id_sickness: number;
}

export interface MedicalDegree {
  id_medical_degree?: number;
  name_medical_degree: string;
}

export interface Passport {
  id_passport?: number;
  passport_series?: number;
  passport_number?: number;
  given_by?: string;
  given_date?: string;
  id_patient?: number;
}

export interface LoginRequest {
  login: string;
  password: string;
}

export interface RegisterRequest {
  login: string;
  password: string;
  // second_name: string;
  // first_name: string;
  // middle_name?: string;
  // role_name: UserRole;
  // patientData?: Omit<Patient, 'login'>;
}

export interface CreateDoctorRequest {
  login: string;
  password: string;
  second_name: string;
  first_name: string;
  middle_name?: string;
  id_medical_degree: number;
  id_medical_profile: number;
}

export interface UpdateUserRequest {
  second_name?: string;
  first_name?: string;
  middle_name?: string;
  password?: string;
}

export interface UpdatePatientRequest extends PatientWithDetailsResponse {}
export interface UpdateDoctorRequest extends DoctorWithDetailsResponse {}

export interface CreateReceptionRequest {
  reception_date: string;
  reception_time: string;
  id_ambulatory_card: number;
  id_doctor: number;
}

export interface CreateSicknessRequest {
  id_diagnos: number;
  id_reception: number;
  complaint?: string;
  medication_text?: string;
}

export interface CreateSickSheetRequest {
  sick_sheet_num: number;
  sick_sheet_date: string;
  next_date?: string;
  id_sickness: number;
}

export interface SearchRequest {
  query: string;
  filters?: {
    role_name?: string;
    medical_profile?: number;
    date_from?: string;
    date_to?: string;
  };
}

// Типы для валидации
export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

// Типы для ролей и разрешений
export interface Role {
  name: UserRole;
  description: string;
  permissions: string[];
}