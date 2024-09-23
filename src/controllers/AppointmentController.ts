import { Request, Response } from "express";
import { AppointmentService } from "../services/AppointmentService";
import { checkWorkingDaysAndTimes } from "../lib/dateConfig";

class AppointmentController {

    protected service = new AppointmentService();

    public async getSlots (req: Request, res: Response) {
        const date = req.query?.date.toString();

        try {
            const slots = await this.service.getSlotsByDate(date);

            if (!slots) {
                throw new Error('Slot not found');
            }

            return res.status(200).json({
                message: 'Success',
                data: slots,
                total: slots.length,
            })
        } catch (error) {
            return res.status(400).json({ message: error.message});
        }
    }

    public async bookSlot (req: Request, res: Response) {
        const { date, time } = req.body;

        // validate working days and hours
        const operationalDayTime = await checkWorkingDaysAndTimes(date, time);
        if (operationalDayTime === false) {
            return res.status(400).json({ message: 'No slot available outside operational hours and days'});
        }

        try {
            await this.service.bookSlot(date, time);
            return res.status(200).json({
                message: 'Slot Booked',
            })
        } catch (error) {
            return res.status(400).json({ message: error.message});
        }
    }
}

export { AppointmentController };