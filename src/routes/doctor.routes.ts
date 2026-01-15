import { Router, Request, Response } from 'express';
import { UserEntity } from '../entities/User';
import { DoctorEntity } from '../entities/Doctor';
import { CreateDoctorRequest, Doctor, UpdateDoctorRequest } from '../types';
import { ApiResponseBuilder } from '../utils/apiResponse';
import { DoctorWithDetailsResponse, DoctorResponse } from '../types/response';

const router = Router();
const userEntity = new UserEntity();
const doctorEntity = new DoctorEntity();

// Создать доктора
router.post('/', async (req: Request, res: Response) => {
  try {
    const createDoctorData: CreateDoctorRequest = req.body;
    
    if (!createDoctorData.login || !createDoctorData.password) {
      const response = ApiResponseBuilder.validationError(['Логин и пароль обязательны']);
      return res.status(400).json(response);
    }

    const { id_medical_degree, id_medical_profile, ...userData } = createDoctorData;
    
    const result = await userEntity.createDoctor(
      { ...userData, role_name: 'doctor' },
      { id_medical_degree, id_medical_profile }
    );
    
    const responseData = {
      user: {
        login: result.user.login,
        second_name: result.user.second_name,
        first_name: result.user.first_name,
        middle_name: result.user.middle_name,
        role_name: result.user.role_name,
      },
      doctor: {
        id_doctor: result.doctor.id_doctor,
        login: result.doctor.login,
        id_medical_degree: result.doctor.id_medical_degree,
        id_medical_profile: result.doctor.id_medical_profile,
      },
    };
    
    const response = ApiResponseBuilder.success(responseData, 'Доктор успешно создан');
    res.status(201).json(response);
  } catch (error: any) {
    const response = ApiResponseBuilder.error(error.message);
    res.status(500).json(response);
  }
});

// Получить всех докторов с деталями
router.get('/', async (req: Request, res: Response) => {
  try {
    const doctors = await doctorEntity.getAllWithDetails();
    
    const responseData: DoctorResponse[] = doctors.map(doctor => ({
      id_doctor: doctor.id_doctor,
      id_medical_degree: doctor.id_medical_degree,
      id_medical_profile: doctor.id_medical_profile,
      medical_degree: {
        id_medical_degree: doctor.id_medical_degree,
        name_medical_degree: doctor.name_medical_degree,
      },
      medical_profile: {
        id_medical_profile: doctor.id_medical_profile,
        name_medical_profile: doctor.name_medical_profile,
        descr_medical_profile: doctor.descr_medical_profile,
      },
      user: {
        second_name: doctor.second_name,
        first_name: doctor.first_name,
        middle_name: doctor.middle_name,
        role_name: doctor.role_name,
      },
    }));
    
    const response = ApiResponseBuilder.success(responseData);
    res.json(response);
  } catch (error: any) {
    const response = ApiResponseBuilder.error(error.message);
    res.status(500).json(response);
  }
});

// Получить доктора по ID с деталями
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const doctor = await doctorEntity.getDoctorWithDetails(parseInt(req.params.id));
    
    if (!doctor) {
      const response = ApiResponseBuilder.notFound('Доктор');
      return res.status(404).json(response);
    }
    
    const responseData: DoctorWithDetailsResponse = {
      id_doctor: doctor.id_doctor,
      login: doctor.login,
      id_medical_degree: doctor.id_medical_degree,
      id_medical_profile: doctor.id_medical_profile,
      user: {
        login: doctor.login,
        second_name: doctor.second_name,
        first_name: doctor.first_name,
        middle_name: doctor.middle_name,
        role_name: doctor.role_name,
      },
      medical_degree: {
        id_medical_degree: doctor.id_medical_degree,
        name_medical_degree: doctor.name_medical_degree,
      },
      medical_profile: {
        id_medical_profile: doctor.id_medical_profile,
        name_medical_profile: doctor.name_medical_profile,
        descr_medical_profile: doctor.descr_medical_profile,
      },
      receptions: doctor.receptions || [],
    };
    
    const response = ApiResponseBuilder.success(responseData);
    res.json(response);
  } catch (error: any) {
    const response = ApiResponseBuilder.error(error.message);
    res.status(500).json(response);
  }
});

// Обновить доктора
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const updatedDoctor: UpdateDoctorRequest | null = await doctorEntity.updateAll(parseInt(req.params.id), req.body);
    
    if (!updatedDoctor) {
      const response = ApiResponseBuilder.notFound('Доктор');
      return res.status(404).json(response);
    }
    
    const response = ApiResponseBuilder.success(updatedDoctor, 'Данные доктора обновлены');
    res.json(response);
  } catch (error: any) {
    const response = ApiResponseBuilder.error(error.message);
    res.status(500).json(response);
  }
});

export default router;