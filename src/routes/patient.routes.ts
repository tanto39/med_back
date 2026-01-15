import { Router, Request, Response } from "express";
import { PatientEntity } from "../entities/Patient";
import { ApiResponseBuilder } from "../utils/apiResponse";
import { PatientResponse, PatientWithDetailsResponse } from "../types/response";

const router = Router();
const patientEntity = new PatientEntity();

router.get('/', async (req: Request, res: Response) => {
  try {
    const patients = await patientEntity.getAllWithDetails();
    
    const responseData: PatientResponse[] = patients.map(patient => ({
      id_patient: patient.id_patient,
      e_mail: patient.email,
      phone_number: patient.phone_number,
      policy_foms: patient.policy_foms,
      snils: patient.snils,
      user: {
        second_name: patient.second_name,
        first_name: patient.first_name,
        middle_name: patient.middle_name,
        role_name: patient.role_name,
      },
    }));
    
    const response = ApiResponseBuilder.success(responseData);
    res.json(response);
  } catch (error: any) {
    const response = ApiResponseBuilder.error(error.message);
    res.status(500).json(response);
  }
});

// Получить пациента по ID с деталями
router.get("/:id", async (req: Request, res: Response) => {
  try {
    const patient = await patientEntity.getPatientWithDetails(parseInt(req.params.id));

    if (!patient) {
      const response = ApiResponseBuilder.notFound("Пациент");
      return res.status(404).json(response);
    }

    const responseData: PatientWithDetailsResponse = {
      id_patient: patient.id_patient,
      login: patient.login,
      snils: patient.snils,
      policy_foms: patient.policy_foms,
      phone_number: patient.phone_number,
      e_mail: patient.e_mail,
      passport: {
        id_passport: patient.id_passport,
        passport_series: patient.passport_series,
        passport_number: patient.passport_number,
        given_by: patient.given_by,
        given_date: patient.given_date,
        id_patient: patient.id_patient,
      },
      user: {
        login: patient.login,
        second_name: patient.second_name,
        first_name: patient.first_name,
        middle_name: patient.middle_name,
        role_name: patient.role_name,
      },
      ambulatory_card: patient.id_ambulatory_card
        ? {
            id_ambulatory_card: patient.id_ambulatory_card,
            registration_date: patient.registration_date,
            registration_date_end: patient.registration_date_end,
            id_patient: patient.id_patient,
          }
        : undefined,
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
router.put("/:id", async (req: Request, res: Response) => {
  try {
    const updatedPatient = await patientEntity.updateAll(parseInt(req.params.id), req.body);

    if (!updatedPatient) {
      const response = ApiResponseBuilder.notFound("Пациент");
      return res.status(404).json(response);
    }

    const response = ApiResponseBuilder.success(updatedPatient, "Данные пациента обновлены");
    res.json(response);
  } catch (error: any) {
    const response = ApiResponseBuilder.error(error.message);
    res.status(500).json(response);
  }
});

export default router;
