import { BaseEntity } from "./BaseEntity";
import { Doctor as DoctorType, UpdateDoctorRequest, UpdatePatientRequest } from "../types";
import { pool } from "../config/database";
import { UserEntity } from "./User";

export class DoctorEntity extends BaseEntity<DoctorType> {
  constructor() {
    super("Doctor", "Id_Doctor");
  }

  async getDoctorWithDetails(doctorId: number): Promise<any> {
    const query = `
      SELECT 
        d.*,
        u.*,
        md.name_medical_degree,
        mp.name_medical_profile,
        mp.descr_medical_profile,
        ARRAY_AGG(json_build_object(
          'id_reception', r.id_reception,
          'reception_date', r.reception_date,
          'reception_time', r.reception_time,
          'patient_info', json_build_object(
            'id_patient', p.id_patient,
            'patient_name', pu.second_name || ' ' || pu.first_name || ' ' || pu.middle_name
          )
        )) as receptions
      FROM Doctor d
      JOIN Users u ON d.login = u.login
      JOIN Medical_Degree md ON d.id_medical_degree = md.id_medical_degree
      JOIN Medical_Profile mp ON d.id_medical_profile = mp.id_medical_profile
      LEFT JOIN Reception r ON d.id_doctor = r.id_doctor
      LEFT JOIN Patient p ON r.id_patient = p.id_patient
      LEFT JOIN Users pu ON p.login = pu.login
      WHERE d.id_doctor = $1
      GROUP BY d.id_doctor, u.login, md.id_medical_degree, mp.id_medical_profile
    `;
    const result = await pool.query(query, [doctorId]);
    return result.rows[0];
  }

  async getAllWithDetails(): Promise<any[]> {
    const query = `
      SELECT 
        d.*,
        u.*,
        md.name_medical_degree,
        mp.name_medical_profile
      FROM Doctor d
      JOIN Users u ON d.login = u.login
      JOIN Medical_Degree md ON d.id_medical_degree = md.id_medical_degree
      JOIN Medical_Profile mp ON d.id_medical_profile = mp.id_medical_profile
    `;
    const result = await pool.query(query);
    return result.rows;
  }

  async getDoctorByLogin(login: string): Promise<DoctorType> {
    const query = "SELECT * FROM Doctor WHERE login = $1";
    const result = await pool.query(query, [login]);
    return result.rows[0];
  }

  async updateAll(id: number | string, data: UpdateDoctorRequest): Promise<UpdateDoctorRequest | null> {
      const client = await pool.connect();
      try {
        await client.query("BEGIN");
  
        const doctorData: DoctorType = {
          id_doctor: data.id_doctor,
          login: data.login as string,
          id_medical_profile: data.medical_profile?.id_medical_profile as number,
        };
        const updatedDoctor = await this.update(id, doctorData);
  
        if (data.user) {
          const userEntity = new UserEntity();
          const updatedUser = await userEntity.update(data.user.login as string, data.user);
          if (updatedUser) {
            data.user = updatedUser;
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
