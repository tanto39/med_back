import { Router, Request, Response } from 'express';
import { UserEntity } from '../entities/User';
import { PatientEntity } from '../entities/Patient';
import { LoginRequest, RegisterRequest } from '../types';
import { ApiResponseBuilder } from '../utils/apiResponse';
import { AuthResponse, RegisterResponse } from '../types/response';

const router = Router();
const userEntity = new UserEntity();
const patientEntity = new PatientEntity();

// Регистрация пользователя
router.post('/register', async (req: Request, res: Response) => {
  try {
    const registerData: RegisterRequest = req.body;
    
    if (!registerData.login || !registerData.password) {
      const response = ApiResponseBuilder.validationError(['Логин и пароль обязательны']);
      return res.status(400).json(response);
    }

    // Валидация пароля
    const passwordErrors = validatePassword(registerData.password);
    if (passwordErrors.length > 0) {
      const response = ApiResponseBuilder.validationError(passwordErrors);
      return res.status(400).json(response);
    }

    const { patientData, ...userData } = registerData;
    
    const result = await userEntity.register(userData, patientData);
    
    const responseData: RegisterResponse = {
      user: {
        login: result.user.login,
        second_name: result.user.second_name,
        first_name: result.user.first_name,
        middle_name: result.user.middle_name,
        role_name: result.user.role_name,
      },
    };

    if (result.patient) {
      responseData.patient = {
        id_patient: result.patient.id_patient,
        login: result.patient.login,
        snils: result.patient.snils,
        policy_foms: result.patient.policy_foms,
        phone_number: result.patient.phone_number,
        e_mail: result.patient.e_mail,
      };
    }

    const response = ApiResponseBuilder.success(responseData, 'Пользователь успешно зарегистрирован');
    res.status(201).json(response);
  } catch (error: any) {
    const response = ApiResponseBuilder.error(error.message);
    res.status(500).json(response);
  }
});

// Авторизация
router.post('/login', async (req: Request, res: Response) => {
  try {
    const { login, password }: LoginRequest = req.body;
    
    if (!login || !password) {
      const response = ApiResponseBuilder.validationError(['Логин и пароль обязательны']);
      return res.status(400).json(response);
    }

    const user = await userEntity.authenticate(login, password);
    
    if (!user) {
      const response = ApiResponseBuilder.error('Неверный логин или пароль');
      return res.status(401).json(response);
    }

    // Получаем дополнительную информацию в зависимости от роли
    const authResponse: AuthResponse = {
      user: {
        login: user.login,
        second_name: user.second_name,
        first_name: user.first_name,
        middle_name: user.middle_name,
        role_name: user.role_name,
      },
    };

    if (user.role_name === 'patient') {
      const patients = await patientEntity.getPatientsByLogin(user.login);
      if (patients.length > 0) {
        authResponse.patient = {
          id_patient: patients[0].id_patient,
          login: patients[0].login,
          snils: patients[0].snils,
          policy_foms: patients[0].policy_foms,
          phone_number: patients[0].phone_number,
          e_mail: patients[0].e_mail,
        };
      }
    }

    const response = ApiResponseBuilder.success(authResponse, 'Авторизация успешна');
    res.json(response);
  } catch (error: any) {
    const response = ApiResponseBuilder.error(error.message);
    res.status(500).json(response);
  }
});

// Вспомогательная функция для валидации пароля
function validatePassword(password: string): string[] {
  const errors: string[] = [];
  
  if (password.length < 8) {
    errors.push('Пароль должен содержать не менее 8 символов');
  }
  
  if (!/[A-Z]/.test(password)) {
    errors.push('Пароль должен содержать хотя бы одну заглавную букву');
  }
  
  if (!/[a-z]/.test(password)) {
    errors.push('Пароль должен содержать хотя бы одну строчную букву');
  }
  
  if (!/[!@#$%^&*]/.test(password)) {
    errors.push('Пароль должен содержать хотя бы один специальный символ (!@#$%^&*)');
  }
  
  return errors;
}

export default router;