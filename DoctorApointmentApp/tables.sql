CREATE TABLE Doctor (
    dcotorID varchar(255),
    name varchar(255), 
    specialization varchar(255),
    PRIMARY KEY (dcotorID)
);


CREATE TABLE Patient (
    patientID varchar(255),
    name varchar(255),
    address varchar(255), 
    phoneNumber varchar(255),
    PRIMARY KEY (patientID)
);

CREATE TABLE Appointment (
    appintmentID varchar(255),
    scheduledTime TIMESTAMP, 
    doctorID varchar(255),
    patientID varchar(255),
    prescriptionID varchar(255),
    completed BOOL,
    PRIMARY KEY (appintmentID)
);

CREATE TABLE Prescription (
    prescriptionID varchar(255),
    doctorID varchar(255),
    issuedTimestamp TIMESTAMP, 
    details varchar(1024),
    PRIMARY KEY (prescriptionID)
);
ALTER TABLE Appointment ALTER COLUMN completed SET DEFAULT 


# YYYY-MM-DD HH:MI:SS.
INSERT INTO Appointment (appintmentID, doctorID, scheduledTime)
VALUES ('01', "goo", CURRENT_TIMESTAMP());

INSERT INTO Doctor (dcotorID, name, specialization) VALUES ('d01', 'Jayathilaka', 'Dermatology');
INSERT INTO Doctor (dcotorID, name, specialization) VALUES ('d02', 'Senarathne', 'Pediatrics');

INSERT INTO Appointment (appintmentID, scheduledTime, doctorID) VALUES ('app001', TIMESTAMP("2022-11-02",  "17:00:00"), 'd01');
INSERT INTO Appointment (appintmentID, scheduledTime, doctorID) VALUES ('app002', TIMESTAMP("2022-11-02",  "17:10:00"), 'd01');


Allergy and immunology, Anesthesiology, Dermatology, Diagnostic radiology, Emergency medicine, Family medicine
Internal medicine, Medical genetics. Neurology, Nuclear medicine, Obstetrics and gynecology, Ophthalmology
Pathology, Pediatrics, Physical medicine and rehabilitation, Preventive medicine
Psychiatry, Radiation oncology, Surgery, Urology
 v


    City varchar(255) DEFAULT 'Sandnes'


ALTER TABLE Appointment ALTER COLUMN completed SET DEFAULT 
ALTER TABLE Doctor MODIFY COLUMN name varchar(255)

UPDATE Appointment SET completed = false;

ALTER TABLE Appointment RENAME COLUMN booked TO completed;

ALTER TABLE Patient ADD COLUMN patientID varchar(255);

ALTER TABLE Patient DROP PRIMARY KEY;

alter table Patient add primary key (patientID);