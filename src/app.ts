import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { testConnection } from './config/database';

import authRoutes from './routes/auth.routes';
import userRoutes from './routes/user.routes';
import doctorRoutes from './routes/doctor.routes';
import patientRoutes from './routes/patient.routes';
import medicalRoutes from './routes/medical.routes';
import receptionRoutes from './routes/reception.routes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Установка заголовков для корректной кодировки
app.use((req, res, next) => {
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  next();
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/doctors', doctorRoutes);
app.use('/api/patients', patientRoutes);
app.use('/api/medical', medicalRoutes);
app.use('/api/receptions', receptionRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    success: true,
    data: {
      status: 'OK', 
      timestamp: new Date(),
      service: 'Medical System API'
    }
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    error: 'Маршрут не найден',
    timestamp: new Date(),
  });
});

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Error:', err.stack);
  
  res.status(500).json({
    success: false,
    error: 'Внутренняя ошибка сервера',
    timestamp: new Date(),
  });
});

app.listen(PORT, async () => {
  console.log(`Server is running on port ${PORT}`);
  
  // Проверяем подключение к БД
  await testConnection();
});