import { BaseEntity } from "./BaseEntity";
import {
  User as UserType,
  Patient as PatientType,
  PatientWithDetailsResponse,
  UpdatePatientRequest,
  Passport,
} from "../types";
import { pool } from "../config/database";
import { UserEntity } from "./User";
import { PassportEntity } from "./Passport";
import { AmbulatoryCardEntity } from "./AmbulatoryCard";
import { formatDateForDB } from "../utils/helpers";

export class PatientEntity extends BaseEntity<PatientType> {
  constructor() {
    super("Patient", "Id_Patient");
  }

  async getAllWithDetails(): Promise<any[]> {
    const query = `
      SELECT 
        p.*,
        u.*,
        md.name_medical_degree,
        mp.name_medical_profile
      FROM Patient d
      JOIN Users u ON p.login = u.login
    `;
    const result = await pool.query(query);
    return result.rows;
  }

  async getPatientWithDetails(patientId: number): Promise<any> {
    const query = `
      SELECT 
        p.*,
        u.*,
        ac.*,
        ps.*,
        ARRAY_AGG(json_build_object(
          'id_reception', r.id_reception,
          'reception_date', r.reception_date,
          'reception_time', r.reception_time,
          'doctor_info', json_build_object(
            'id_doctor', d.id_doctor,
            'doctor_name', du.second_name || ' ' || du.first_name || ' ' || du.Middle_Name,
            'medical_profile', mp.name_medical_profile
          )
        )) as receptions
      FROM Patient p
      JOIN Users u ON p.login = u.login
      LEFT JOIN Ambulatory_Card ac ON p.id_patient = ac.id_patient
      LEFT JOIN Passport ps ON p.id_patient = ps.id_patient
      LEFT JOIN Reception r ON p.id_patient = r.id_patient
      LEFT JOIN Doctor d ON r.id_doctor = d.id_doctor
      LEFT JOIN Users du ON d.login = du.login
      LEFT JOIN Medical_Profile mp ON d.id_medical_profile = mp.id_medical_profile
      WHERE p.id_patient = $1
      GROUP BY p.id_patient, u.login, ac.id_ambulatory_card, ps.id_passport
    `;
    const result = await pool.query(query, [patientId]);
    return result.rows[0];
  }

  async getPatientByLogin(login: string): Promise<PatientType> {
    const query = "SELECT * FROM Patient WHERE login = $1";
    const result = await pool.query(query, [login]);
    return result.rows[0];
  }

  async updateAll(id: number | string, data: UpdatePatientRequest): Promise<UpdatePatientRequest | null> {
    const client = await pool.connect();
    try {
      await client.query("BEGIN");

      const patientData: PatientType = {
        snils: data.snils,
        policy_foms: data.policy_foms,
        phone_number: data.phone_number,
        e_mail: data.e_mail,
      };
      const updatedPatient = await this.update(id, patientData);

      if (data.user) {
        const userEntity = new UserEntity();
        const updatedUser = await userEntity.update(data.user.login as string, data.user);
        if (updatedUser) {
          data.user = updatedUser;
        }
      }

      if (data.passport) {
        const passportEntity = new PassportEntity();
        data.passport.given_date = formatDateForDB(data.passport.given_date);
        const updatedPassport = await passportEntity.update(data.passport.id_passport as number, data.passport);
        if (updatedPassport) {
          data.passport = updatedPassport;
        }
      }

      if (data.ambulatory_card) {
        data.ambulatory_card.registration_date = formatDateForDB(data.ambulatory_card.registration_date) as string;
        data.ambulatory_card.registration_date_end = formatDateForDB(data.ambulatory_card.registration_date_end);

        const ambulatoryCardEntity = new AmbulatoryCardEntity();
        const updatedCard = await ambulatoryCardEntity.update(
          data.ambulatory_card.id_ambulatory_card as number,
          data.ambulatory_card
        );
        if (updatedCard) {
          data.ambulatory_card = updatedCard;
        }
      }

      await client.query("COMMIT");
      return data;
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  }
}
