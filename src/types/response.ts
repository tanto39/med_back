// Базовые типы ответов
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  timestamp: Date;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
  };
}

// Типы для эндпоинтов авторизации
export interface AuthResponse {
  user: {
    login: string;
    second_name: string;
    first_name: string;
    middle_name?: string;
    role_name: 'patient' | 'doctor' | 'admin';
  };
  token?: string;
  patient?: PatientResponse;
  doctor?: DoctorResponse;
}

export interface RegisterResponse {
  user: UserResponse;
  patient?: PatientResponse;
}

// Типы для пользователей
export interface UserResponse {
  login: string;
  second_name: string;
  first_name: string;
  middle_name?: string;
  role_name: 'patient' | 'doctor' | 'admin';
}

export interface UserWithDetailsResponse extends UserResponse {
  patient?: PatientResponse;
  doctor?: DoctorResponse;
}

// Типы для пациентов
export interface PatientResponse {
  id_patient: number;
  login: string;
  snils: string;
  policy_foms: number;
  phone_number: string;
  e_mail: string;
  passport?: PassportResponse;
  user?: UserResponse;
}

export interface PatientWithDetailsResponse extends PatientResponse {
  user: UserResponse;
  ambulatory_card?: AmbulatoryCardResponse;
  receptions: ReceptionShortResponse[];
}

// Типы для паспорта
export interface PassportResponse {
  id_passport: number;
  passport_series: number;
  passport_number: number;
  given_by: string;
  given_date: string;
  id_patient: number;
}

// Типы для амбулаторной карты
export interface AmbulatoryCardResponse {
  id_ambulatory_card: number;
  ambulatory_card_num: number;
  registration_date: string;
  registration_date_end?: string;
  id_patient: number;
  patient?: PatientResponse;
}

// Типы для докторов
export interface DoctorResponse {
  id_doctor: number;
  login: string;
  id_medical_degree: number;
  id_medical_profile: number;
  medical_degree?: MedicalDegreeResponse;
  medical_profile?: MedicalProfileResponse;
  user?: UserResponse;
}

export interface DoctorWithDetailsResponse extends DoctorResponse {
  user: UserResponse;
  medical_degree: MedicalDegreeResponse;
  medical_profile: MedicalProfileResponse;
  receptions: ReceptionForDoctorResponse[];
}

export interface ReceptionForDoctorResponse {
  id_reception: number;
  reception_date: string;
  reception_time: string;
  patient_info: {
    id_patient: number;
    patient_name: string;
    ambulatory_card_num: number;
  };
}

// Типы для приемов
export interface ReceptionResponse {
  id_reception: number;
  reception_date: string;
  reception_time: string;
  id_ambulatory_card: number;
  id_doctor: number;
  patient?: PatientResponse;
  doctor?: DoctorResponse;
}

export interface ReceptionShortResponse {
  id_reception: number;
  reception_date: string;
  reception_time: string;
  doctor_info: {
    id_doctor: number;
    doctor_name: string;
    medical_profile: string;
  };
}

export interface ReceptionWithDetailsResponse extends ReceptionResponse {
  patient_info: {
    id_patient: number;
    patient_name: string;
    snils: string;
  };
  doctor_info: {
    id_doctor: number;
    doctor_name: string;
    medical_profile: string;
  };
  diagnos_name: string;
  complaint?: string;
  medication_text?: string;
  sick_sheet?: SickSheetResponse;
  medicaments: MedicamentResponse[];
}

// Типы для болезней (sickness)
export interface SicknessResponse {
  id_sickness: number;
  id_diagnos: number;
  id_reception: number;
  complaint?: string;
  medication_text?: string;
  diagnos?: DiagnosResponse;
  medicaments?: MedicamentResponse[];
}

// Типы для больничных листов
export interface SickSheetResponse {
  id_sick_sheet: number;
  sick_sheet_num: number;
  sick_sheet_date: string;
  next_date?: string;
  id_sickness: number;
  sickness?: SicknessResponse;
}

// Типы для диагнозов
export interface DiagnosResponse {
  id_diagnos: number;
  diagnos_name: string;
}

// Типы для медикаментов
export interface MedicamentResponse {
  id_medicament: number;
  medicament_name: string;
  medicament_descr?: string;
}

// Типы для назначений лекарств
export interface MedicationResponse {
  id_medication: number;
  id_medicament: number;
  id_sickness: number;
  medicament?: MedicamentResponse;
}

// Типы для лечебных профилей
export interface MedicalProfileResponse {
  id_medical_profile: number;
  name_medical_profile: string;
  descr_medical_profile?: string;
}

// Типы для ученых степеней
export interface MedicalDegreeResponse {
  id_medical_degree: number;
  name_medical_degree: string;
}

// Типы для запросов с фильтрацией
export interface FilterOptions {
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  search?: string;
  role_name?: 'patient' | 'doctor' | 'admin';
}

// Типы для статистики
export interface StatisticsResponse {
  total_patients: number;
  total_doctors: number;
  total_receptions: number;
  recent_receptions: ReceptionResponse[];
  popular_medical_profiles: Array<{
    medical_profile: string;
    count: number;
  }>;
}