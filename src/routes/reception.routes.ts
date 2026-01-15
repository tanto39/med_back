import { Router, Request, Response } from 'express';
import { ReceptionEntity } from '../entities/Reception';
import { ApiResponseBuilder } from '../utils/apiResponse';
import { ReceptionResponse, ReceptionWithSick } from '../types/response';
import { Reception } from '../types';

const router = Router();
const receptionEntity = new ReceptionEntity();

// Создать прием
router.post('/', async (req: Request, res: Response) => {
  try {
    const reception = await receptionEntity.create(req.body);

    req.body.id_reception = reception.id_reception;
    
    const response = ApiResponseBuilder.success(req.body, 'Прием успешно создан');
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
    
    const responseData: ReceptionWithSick = {
      reception: {
        id_reception: reception.id_reception,
        reception_date: reception.reception_date,
        reception_time: reception.reception_time,
        id_doctor: reception.id_doctor,
        id_patient: reception.id_patient,
        id_medical_profile: reception.id_medical_profile,
      },
      sicknesses: reception.sicknesses
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
    
    const response = ApiResponseBuilder.success(req.body, 'Прием обновлен');
    res.json(response);
  } catch (error: any) {
    const response = ApiResponseBuilder.error(error.message);
    res.status(500).json(response);
  }
});

export default router;