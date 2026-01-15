import { BaseEntity } from './BaseEntity';
import { Reception as ReceptionType } from '../types';
import { pool } from '../config/database';

export class ReceptionEntity extends BaseEntity<ReceptionType> {
  constructor() {
    super('Reception', 'Id_Reception');
  }

  async getReceptionWithDetails(receptionId: number): Promise<any> {
    const query = `
      SELECT 
        r.*,
        p.id_patient,
        d.id_medical_profile,
        ARRAY_AGG(json_build_object(
          'id_sickness', s.id_sickness,
          'id_diagnos', s.id_diagnos,
          'complaint', s.complaint,
          'medication_text', s.medication_text,
          'sick_sheet', json_build_object(
            'id_sick_sheet', ss.id_sick_sheet,
            'sick_sheet_date', ss.sick_sheet_date,
            'next_date', ss.next_date,
          )
        )) as sicknesses,
      FROM Reception r
      JOIN Sickness s ON r.id_reception = s.id_reception
      LEFT JOIN Sick_Sheet ss ON s.id_sickness = ss.id_sickness
      LEFT JOIN Medication med ON s.id_sickness = med.id_sickness
      LEFT JOIN Medicament m ON med.id_medicament = m.id_medicament
      JOIN Ambulatory_Card ac ON r.id_patient = ac.id_patient
      JOIN Patient p ON ac.id_patient = p.id_patient
      JOIN Doctor d ON r.id_doctor = d.id_doctor
      WHERE r.id_reception = $1
      GROUP BY r.id_reception, s.id_sickness, s.id_diagnos, ss.id_sick_sheet, p.id_patient, d.id_doctor
    `;
    const result = await pool.query(query, [receptionId]);
    return result.rows[0];
  }
}