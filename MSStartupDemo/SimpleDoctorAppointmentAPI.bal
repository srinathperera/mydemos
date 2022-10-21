
import wso2/choreo.sendsms;
import ballerina/http;
import ballerina/time;

import ballerinax/mysql;
import ballerinax/mysql.driver as _;
import ballerina/uuid;


public type Doctor record {
    string dcotorID;
    string name;
    string specialization;
};

public type Patient record {
    string name;
    string address;
    string phoneNumber;
};

public type Appointment record {
    string appintmentID;
    Doctor doctor;
    time:Civil scheduledTime;
    Patient patientData;
    Prescription prescription;
    boolean completed = false;
};

public type AppointmentUpdate record {
    string patientName;
    string patientAddress;
    string patientPhoneNumber;
    string prescription;
    boolean completed;
};

public type Prescription record {

};

function updateAppointments(mysql:Client db, string appointmentID, AppointmentUpdate appointment) returns string|error {
    string patientID = uuid:createType1AsString();
    _ = check db->execute(`UPDATE Appointment SET patientID = ${patientID}, completed = true  WHERE appintmentID=${appointmentID}`);
    _ = check db->execute(`INSERT INTO Patient (patientID, name, address, phoneNumber)
        VALUES (${patientID}, ${appointment.patientName}, ${appointment.patientAddress}, ${appointment.patientPhoneNumber});`);
    return appointmentID;
}

listener http:Listener httpListener = new (8080);
configurable string passwd = "";

service / on httpListener {

    private final mysql:Client db;

    function init() returns error? {
        self.db = check new ("choreo-mysql-server.mysql.database.azure.com", "choreodemo", passwd, "ecom", 3306);
    }

    resource function patch appointments/[string appointmentID](@http:Payload AppointmentUpdate appointment) returns string|error {
        string|error status = updateAppointments(self.db, appointmentID, appointment);
        sendsms:Client sendsmsEp = check new ();
        _ = check sendsmsEp->sendSms(toMobile = appointment.patientPhoneNumber, message = appointmentID + " confirmed");
        return status;
    }

}
