import { Appointment } from "../entities/Appointment";
import { AppDataSource } from "../lib/database";
import { AppointmentRepository } from "../repositories/AppointmentRepository";

class AppointmentService {
    
    protected startHour: number = +process.env.START_HOUR;
    protected endHour: number = +process.env.END_HOUR;
    protected duration: number = +process.env.DURATION;
    protected slotAvailable: number = +process.env.SLOT_NUMBER;

    protected repository = new AppointmentRepository();

    public async getSlotsByDate (date: string) {
        const times = [];
        const slots = [];

        for (let hour = this.startHour; hour < this.endHour; hour++) {
            times.push(`${hour.toString().padStart(2, '0')}:00`);
            times.push(`${hour.toString().padStart(2, '0')}:30`);
        }

        for (const time of times) {
            let existingSlot = await this.repository.findOne(date, time);

            if (!existingSlot) {
                const appointment = new Appointment();
                appointment.date = date;
                appointment.time = time;
                appointment.availableSlots = this.slotAvailable;

                existingSlot = await this.repository.save(appointment);
            }

            await slots.push(existingSlot);
        }

        return slots;
    }

    public async bookSlot(date: string, time: string) {
        try {
            let result;
            
            await AppDataSource.transaction(async (manager) => {
                const slot = await this.repository.findSlotWithLock(manager, date, time);

                if (!slot) throw new Error('Slot not found');
                if (slot.availableSlots === 0) throw new Error('Slot is already booked');

                slot.availableSlots -= 1;

                result = await this.repository.bookSlot(manager, slot);
            });

            return result;
        } catch (error) {
            if (error.message.includes('ConcurrencyError')) {
                throw new Error('Slot no longer available');
            }

            throw new Error(error);
        }
    }
}

export { AppointmentService };