import ballerina/io;
import ballerina/http;
import ballerina/time;

import ballerina/sql;
import ballerinax/mysql;
import ballerinax/mysql.driver as _;
import ballerina/uuid;



#time:Civil civil2 = check time:civilFromString("2007-12-03T10:15:30.00Z");

public type Doctor record {
    string dcotorID; 
    string name;
    string specialization;
};

public type Patient record{
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


public function main() {
    io:println("Hello, World!");
}

//

listener http:Listener httpListener = new (8080);
configurable string passwd = "";


service / on httpListener {
    
     private final mysql:Client db;

    function init() returns error? {
        //self.db = check new ("localhost", "root", "", "DoctorAppointments", 3306);
        //mysql --host choreo-mysql-server.mysql.database.azure.com --database ecom --user choreodemo -
        self.db = check new ("choreo-mysql-server.mysql.database.azure.com", "choreodemo", passwd, "ecom", 3306);
    }

//POST appointments/ - add list of appoinemnts 
    //resource function get appointments() returns Doctor[] {
    //    return [];
    //}

    resource function get appointments(string doctorID) returns Appointment[]|error?  {
        stream<Appointment, sql:Error?> appointmentStream = self.db->query(`SELECT * FROM Appointment WHERE doctorID=${doctorID}`);
        Appointment[]? appointments = check from Appointment appointment in appointmentStream select appointment;
        check appointmentStream.close();
        io:print(appointments);
        return appointments;
    }


    resource function post appointments(boolean booked) returns Appointment[] {
        return [];
    }

    resource function get appointments/[string appinmentID](boolean booked) returns Appointment[] {
        return [];
    }


    resource function patch appointments/[string appointmentID](@http:Payload AppointmentUpdate appointment) returns string|error {
       boolean completed = appointment.completed;
       if completed{
            string prescriptionID = uuid:createType1AsString();
            _ = check self.db->execute(`INSERT INTO Prescription (prescriptionID, details)
                VALUES (${prescriptionID}, ${appointment.prescription}});`);
            _ = check self.db->execute(`UPDATE Appointment SET prescriptionID = ${prescriptionID}, completed = true  WHERE appintmentID=${appointmentID}`);
       }else{
            string patientID = uuid:createType1AsString();
            _ = check self.db->execute(`UPDATE Appointment SET patientID = ${patientID}, completed = true  WHERE appintmentID=${appointmentID}`);
            _ = check self.db->execute(`INSERT INTO Patient (patientID, name, address, phoneNumber)
                VALUES (${patientID}, ${appointment.patientName}, ${appointment.patientAddress}, ${appointment.patientPhoneNumber});`);
        }
        return "Appointment data updated";    
    }

    resource function post appointments/[string appinmentID]/prescription/[string prescriptionID](@http:Payload Appointment appoinement) returns string {
        return "foo";
    }

    resource function get appointments/[string appinmentID]/prescription/[string prescriptionID]() returns Prescription {
        Prescription p = {}; 
        return p;
    }

    resource function post doctors(@http:Payload Doctor[] doctorList) returns string[] {
        return ["foo"];
    }

    resource function get doctors(string searchstr) returns Doctor[]?|error {
        sql:ParameterizedQuery query; 
        if searchstr.length() == 0 {
            query = `select * from Doctor`; 
        }else{
            query = `SELECT * FROM Doctor WHERE name like '%{searchstr}%'`; 
        }
        query = `select * from Doctor`; 
        io:print(query);
        //select * from Doctor WHERE name like '%Sena%';
        stream<Doctor, sql:Error?> doctorStream = self.db->query(query);
        Doctor[]? doctors = check from Doctor d in doctorStream select d;
        check doctorStream.close();
        io:print(doctors);
        return doctors;
    }


//POST doctors/ - add a new doctor 
//GET doctors/?name=XX
//GET appointments/?booked=true - all appointments 
//PATCH appointments/<appointment-id>/



//GET appointments/ - all appointments 
//PATCH appointments/<appointment-id>/ - 
//POST appointments/<appointment-id>/prescription - TODO check  

//GET appointments/<appointment-id>/

//GET appointments/<appointment-id>/prescription/<prescription-id> 
}