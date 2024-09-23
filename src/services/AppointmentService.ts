import { Appointment } from "../entities/Appointment";
import { AppDataSource } from "../lib/database";
import { AppointmentRepository } from "../repositories/AppointmentRepository";
import { format } from 'date-fns';

class AppointmentService {
    
    protected startHour: number = +process.env.START_HOUR;
    protected endHour: number = +process.env.END_HOUR;
    protected duration: number = +process.env.DURATION;
    protected slotAvailable: number = +process.env.SLOT_NUMBER;

    protected repository = new AppointmentRepository();

    public async getSlotsByDate (date: string) {
        const times = [];
        const slots = [];

        // create array of time from start to end hour
        for (let hour = this.startHour; hour < this.endHour; hour++) {
            // slots duration
            for (let minutes = 0; minutes < 60; minutes += this.duration) {
                times.push(`${hour.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`);
            }
        }

        for (const time of times) {
            // check if exist
            const existingAppoinment = await this.repository.findOne(date, time);

            // prepare data
            const appointment = new Appointment();

            // on the fly data/slots if not exists
            if (!existingAppoinment) {
                appointment.date = date;
                appointment.time = time;
                appointment.availableSlots = this.slotAvailable;

                await slots.push(appointment);
            } else {
                // existing slots from db 
                appointment.date = format(existingAppoinment.date, 'yy-mm-dd');
                appointment.time = existingAppoinment.time.substring(0, 5);

                if (appointment.availableSlots > 0) {
                    await slots.push(appointment);
                }
            }
        }

        return slots;
    }

    public async bookSlot(date: string, time: string) {
        try {
            let result;
            
            await AppDataSource.transaction(async (manager) => {
                // check if slot exist, lock database transaction
                const slot = await this.repository.findSlotWithLock(manager, date, time);
                
                // add timeout for testing race condition
                await new Promise(resolve => setTimeout(resolve, 3000));

                // if slot don't exist, then record
                if (!slot) {
                    const appointment = new Appointment();
                    appointment.date = date;
                    appointment.time = time;
                    appointment.availableSlots = this.slotAvailable - 1;

                    result = await this.repository.bookSlot(manager, appointment);

                    return result;
                }

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