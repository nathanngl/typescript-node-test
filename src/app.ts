import express, { Request, Response } from 'express';
import * as dotenv from 'dotenv';

dotenv.config();
import { AppointmentController } from './controllers/AppointmentController';

const port = process.env.PORT;
const app = express();
app.use(express.json()); 

const appointmentController = new AppointmentController();

app.listen(port, () => {
	return console.log(`Express is listening at http://localhost:${port}`);
});

// get available slots
app.get('/slots', async (req: Request, res: Response, next) => {
	try {
		await appointmentController.getSlots(req, res);
	} catch (error) {
		next(error);
	}
});

// book available slots
app.post('/book', async (req: Request, res: Response, next) => {
	try {
		console.log(req.body);
		await appointmentController.bookSlot(req, res);
	} catch (error) {
		next(error);
	}
});