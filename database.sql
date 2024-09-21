CREATE DATABASE IF NOT EXISTS appointments_db;

USE appointments_db;

CREATE TABLE IF NOT EXISTS appointments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    date DATE NOT NULL,
    time TIME NOT NULL,
    available_slots INT NOT NULL DEFAULT 1,
    UNIQUE KEY unique_slot (date, time)
);