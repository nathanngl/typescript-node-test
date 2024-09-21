import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'appointments'})
export class Appointment {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: 'date', nullable: false})
    date: string;

    @Column({name: 'time', nullable: false})
    time: string;

    @Column({ name: 'available_slots', default: 1, nullable: false })
    availableSlots: number;
}
