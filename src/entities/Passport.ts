import { BaseEntity } from './BaseEntity';
import { Passport } from '../types';

export class PassportEntity extends BaseEntity<Passport> {
  constructor() {
    super('Passport', 'Id_Passport');
  }
}