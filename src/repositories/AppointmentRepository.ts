import { AppDataSource } from '../lib/database';
import { Appointment } from '../entities/Appointment';
import { EntityManager } from 'typeorm';

class AppointmentRepository {

    protected AppointmentEntity = AppDataSource.getRepository(Appointment);

    public async findOne (date: string, time: string) {
        return await this.AppointmentEntity.findOne({
            where: {
                date,
                time
            }
        })
    }

    public async getSlots (date: string) {
        return await this.AppointmentEntity.find({
            where: {
                date
            }
        })
    }

    public async findSlotWithLock(manager: EntityManager, date: string, time: string) {
        return manager.findOne(Appointment, {
            where: {
                date,
                time
            },
            lock: {
                mode: 'pessimistic_write',
            }
        })
    }

    // this one for booking a slot
    public async bookSlot (manager: EntityManager, slot: Appointment) {
        return manager.save(Appointment, slot);
    }

    // this one for data initialize
    public async save (slot: Appointment) {
        return this.AppointmentEntity.save(slot);
    }
}

export { AppointmentRepository };