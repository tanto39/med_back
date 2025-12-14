import { ApiResponse, PaginatedResponse } from '../types/response';

export class ApiResponseBuilder {
  static success<T = any>(data?: T, message?: string): ApiResponse<T> {
    return {
      success: true,
      data,
      message,
      timestamp: new Date(),
    };
  }

  static paginated<T = any>(
    data: T[],
    total: number,
    page: number,
    pageSize: number,
    message?: string
  ): PaginatedResponse<T> {
    const totalPages = Math.ceil(total / pageSize);
    
    return {
      success: true,
      data,
      message,
      timestamp: new Date(),
      pagination: {
        total,
        page,
        pageSize,
        totalPages,
      },
    };
  }

  static error(error: string, data?: any): ApiResponse {
    return {
      success: false,
      error,
      data,
      timestamp: new Date(),
    };
  }

  static notFound(entity: string): ApiResponse {
    return {
      success: false,
      error: `${entity} не найден`,
      timestamp: new Date(),
    };
  }

  static validationError(errors: string[]): ApiResponse {
    return {
      success: false,
      error: 'Ошибка валидации',
      data: { errors },
      timestamp: new Date(),
    };
  }

  static unauthorized(message = 'Требуется авторизация'): ApiResponse {
    return {
      success: false,
      error: message,
      timestamp: new Date(),
    };
  }

  static forbidden(message = 'Доступ запрещен'): ApiResponse {
    return {
      success: false,
      error: message,
      timestamp: new Date(),
    };
  }
}