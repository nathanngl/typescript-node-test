import { DataSource } from 'typeorm';
import { Appointment } from '../entities/Appointment';
import * as dotenv from 'dotenv'

dotenv.config();

export const AppDataSource = new DataSource({
    type: 'mysql',
    host: process.env.DB_HOST,
    port: +process.env.DB_PORT,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    entities: [Appointment],
});

AppDataSource.initialize()
    .then(() => {
        console.log('Database running');
    })
    .catch((err) => {
        console.error('Error:', err);
    });
