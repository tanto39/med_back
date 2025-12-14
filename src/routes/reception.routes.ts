import { Router, Request, Response } from 'express';
import { ReceptionEntity } from '../entities/Reception';
import { ApiResponseBuilder } from '../utils/apiResponse';
import { ReceptionWithDetailsResponse, ReceptionResponse } from '../types/response';
import { Reception } from '../types';

const router = Router();
const receptionEntity = new ReceptionEntity();

// Создать прием
router.post('/', async (req: Request, res: Response) => {
  try {
    const reception = await receptionEntity.create(req.body);
    
    const responseData: ReceptionResponse = {
      id_reception: reception.id_reception,
      reception_date: reception.reception_date,
      reception_time: reception.reception_time,
      id_ambulatory_card: reception.id_ambulatory_card,
      id_doctor: reception.id_doctor,
    };
    
    const response = ApiResponseBuilder.success(responseData, 'Прием успешно создан');
    res.status(201).json(response);
  } catch (error: any) {
    const response = ApiResponseBuilder.error(error.message);
    res.status(500).json(response);
  }
});

// Получить прием по ID с деталями
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const reception = await receptionEntity.getReceptionWithDetails(parseInt(req.params.id));
    
    if (!reception) {
      const response = ApiResponseBuilder.notFound('Прием');
      return res.status(404).json(response);
    }
    
    const responseData: ReceptionWithDetailsResponse = {
      id_reception: reception.id_reception,
      reception_date: reception.reception_date,
      reception_time: reception.reception_time,
      id_ambulatory_card: reception.id_ambulatory_card,
      id_doctor: reception.id_doctor,
      patient_info: {
        id_patient: reception.id_patient,
        patient_name: reception.patient_name,
        snils: reception.snils,
      },
      doctor_info: {
        id_doctor: reception.id_doctor,
        doctor_name: reception.doctor_name,
        medical_profile: reception.medical_profile,
      },
      diagnos_name: reception.diagnos_name,
      complaint: reception.complaint,
      medication_text: reception.medication_text,
      sick_sheet: reception.sick_sheet_num ? {
        id_sick_sheet: reception.id_sick_sheet,
        sick_sheet_num: reception.sick_sheet_num,
        sick_sheet_date: reception.sick_sheet_date,
        next_date: reception.next_date,
        id_sickness: reception.id_sickness,
      } : undefined,
      medicaments: reception.medicaments || [],
    };
    
    const response = ApiResponseBuilder.success(responseData);
    res.json(response);
  } catch (error: any) {
    const response = ApiResponseBuilder.error(error.message);
    res.status(500).json(response);
  }
});

// Обновить прием
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const updatedReception: Reception | null = await receptionEntity.update(parseInt(req.params.id), req.body);
    
    if (!updatedReception) {
      const response = ApiResponseBuilder.notFound('Прием');
      return res.status(404).json(response);
    }
    
    const responseData: ReceptionResponse = {
      id_reception: updatedReception.id_reception,
      reception_date: updatedReception.reception_date,
      reception_time: updatedReception.reception_time,
      id_ambulatory_card: updatedReception.id_ambulatory_card,
      id_doctor: updatedReception.id_doctor,
    };
    
    const response = ApiResponseBuilder.success(responseData, 'Прием обновлен');
    res.json(response);
  } catch (error: any) {
    const response = ApiResponseBuilder.error(error.message);
    res.status(500).json(response);
  }
});

export default router;