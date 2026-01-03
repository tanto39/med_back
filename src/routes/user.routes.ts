import { Router, Request, Response } from 'express';
import { UserEntity } from '../entities/User';
import { ApiResponseBuilder } from '../utils/apiResponse';
import { UserWithDetailsResponse } from '../types/response';
import { User } from '../types';

const router = Router();
const userEntity = new UserEntity();

// Получить всех пользователей
router.get('/', async (req: Request, res: Response) => {
  try {
    const users = await userEntity.getAll();
    
    const responseData: User[] = users.map(user => ({
      login: user.login,
      second_name: user.second_name,
      first_name: user.first_name,
      middle_name: user.middle_name,
      role_name: user.role_name,
    }));
    
    const response = ApiResponseBuilder.success(responseData);
    res.json(response);
  } catch (error: any) {
    const response = ApiResponseBuilder.error(error.message);
    res.status(500).json(response);
  }
});

// Получить пользователя по логину
router.get('/:login', async (req: Request, res: Response) => {
  try {
    const user = await userEntity.getById(req.params.login);
    
    if (!user) {
      const response = ApiResponseBuilder.notFound('Пользователь');
      return res.status(404).json(response);
    }
    
    const responseData: User = {
      login: user.login,
      second_name: user.second_name,
      first_name: user.first_name,
      middle_name: user.middle_name,
      role_name: user.role_name,
    };
    
    const response = ApiResponseBuilder.success(responseData);
    res.json(response);
  } catch (error: any) {
    const response = ApiResponseBuilder.error(error.message);
    res.status(500).json(response);
  }
});

// Обновить пользователя
router.put('/:login', async (req: Request, res: Response) => {
  try {
    const updatedUser = await userEntity.update(req.params.login, req.body);
    
    if (!updatedUser) {
      const response = ApiResponseBuilder.notFound('Пользователь');
      return res.status(404).json(response);
    }
    
    const responseData: User = {
      login: updatedUser.login,
      second_name: updatedUser.second_name,
      first_name: updatedUser.first_name,
      middle_name: updatedUser.middle_name,
      role_name: updatedUser.role_name,
    };
    
    const response = ApiResponseBuilder.success(responseData, 'Пользователь успешно обновлен');
    res.json(response);
  } catch (error: any) {
    const response = ApiResponseBuilder.error(error.message);
    res.status(500).json(response);
  }
});

export default router;