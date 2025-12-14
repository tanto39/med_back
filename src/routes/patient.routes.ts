import { Router, Request, Response } from 'express';
import { PatientEntity } from '../entities/Patient';
import { ApiResponseBuilder } from '../utils/apiResponse';
import { PatientWithDetailsResponse } from '../types/response';

const router = Router();
const patientEntity = new PatientEntity();

// Получить пациента по ID с деталями
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const patient = await patientEntity.getPatientWithDetails(parseInt(req.params.id));
    
    if (!patient) {
      const response = ApiResponseBuilder.notFound('Пациент');
      return res.status(404).json(response);
    }
    
    const responseData: PatientWithDetailsResponse = {
      id_patient: patient.id_patient,
      login: patient.login,
      snils: patient.snils,
      policy_foms: patient.policy_foms,
      phone_number: patient.phone_number,
      e_mail: patient.e_mail,
      user: {
        login: patient.login,
        second_name: patient.second_name,
        first_name: patient.first_name,
        middle_name: patient.middle_name,
        role_name: patient.role_name,
      },
      ambulatory_card: patient.id_ambulatory_card ? {
        id_ambulatory_card: patient.id_ambulatory_card,
        ambulatory_card_num: patient.ambulatory_card_num,
        registration_date: patient.registration_date,
        registration_date_end: patient.registration_date_end,
        id_patient: patient.id_patient,
      } : undefined,
      receptions: patient.receptions || [],
    };
    
    const response = ApiResponseBuilder.success(responseData);
    res.json(response);
  } catch (error: any) {
    const response = ApiResponseBuilder.error(error.message);
    res.status(500).json(response);
  }
});

// Обновить пациента
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const updatedPatient = await patientEntity.update(parseInt(req.params.id), req.body);
    
    if (!updatedPatient) {
      const response = ApiResponseBuilder.notFound('Пациент');
      return res.status(404).json(response);
    }
    
    const responseData = {
      id_patient: updatedPatient.id_patient,
      login: updatedPatient.login,
      snils: updatedPatient.snils,
      policy_foms: updatedPatient.policy_foms,
      phone_number: updatedPatient.phone_number,
      e_mail: updatedPatient.e_mail,
    };
    
    const response = ApiResponseBuilder.success(responseData, 'Данные пациента обновлены');
    res.json(response);
  } catch (error: any) {
    const response = ApiResponseBuilder.error(error.message);
    res.status(500).json(response);
  }
});

export default router;