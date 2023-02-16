import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { AuthProvider } from "@asgardeo/auth-react";
import { useAuthContext } from "@asgardeo/auth-react";





class Square extends React.Component {
  render() {
    return (
      <button className="square">
        {/* TODO */}
      </button>
    );
  }
}

class Board extends React.Component {
  renderSquare(i) {
    return <Square />;
  }

  render() {
    const status = 'Next player: X';

    return (
      <div>
        <div className="status">{status}</div>
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>
    );
  }
}

class Game extends React.Component {
  render() {
    return (
      <div className="game">
        <div className="game-board">
          <Board />
        </div>
        <div className="game-info">
          <div>{/* status */}</div>
          <ol>{/* TODO */}</ol>
        </div>
      </div>
    );
  }
}

// ========================================
/*
Web app
    Patient View
        Find Doctor
            Find Appointment 
                Book ( add on click)
    Doctor View
        List Appoinement 
            Add prescription and details -> Done 

    Admin View 
        Add Doctor
        Add appointment 
*/

class PatientView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {doctors: []};
    this.handleChange = this.handleChange.bind(this);

  }

  handleChange(e) {
    //this.setState({login: e.target.value});
    //update doctor found div from here
    console.log('You clicked submit.');
    //this.setState({
    //  doctors: ["Doctor 1", "Doctor 2"]
    //});
    fetch(
      "http://localhost:3000/api/doctors?searchstr=%22%22")
                  .then((res) => res.json())
                  .then((json) => {
                      this.setState({
                          doctors: json,
                          DataisLoaded: true
                      });
                      console.log('received JSON '+ json);
                  })
  }
  render() {
    const doctorList = this.state.doctors
    //const myList = doctorList.map((item) => <li key={item.name}>{item.name} ({item.specialization})</li>)
    const myList = doctorList.map((item) => 
      <li key={item.name}>
        <DoctorData dcotorID={item.dcotorID} name={item.name} specialization={item.specialization}>
        </DoctorData>
      </li>
    )

    return (
      
      <div className="patient-app-view">
        <h1>Patient View</h1>
        <h2>find a Doctor</h2>
        <input name="doctor-search" value="Doctor name" />
        <button onClick={this.handleChange}>Find Doctors</button>

        <div className='DoctorsFound'>
          <ol>{myList}</ol>
        </div>       
      </div>
    );
  }
}

class DoctorData extends React.Component {
  constructor(props) {
    super(props);
    console.log('props0='+ props.dcotorID + " "+ props.name);
    this.dcotorID = props.dcotorID;
    this.name = props.name;
    this.specialization = props.specialization;
    this.getAppoinements = this.getAppoinements.bind(this);
    this.state = {appointments: []};
  }
  getAppoinements(e) {
    //fetch("http://localhost:8080/appointments?doctorID=d01")
    fetch("http://localhost:3000/api/appointments?doctorID="+this.dcotorID)
      .then((res) => res.json())
      .then((json) => {
          this.setState({
              appointments: json
          });
          console.log('received JSON '+ json);
      })

    
    // get appoinments , set state 
    // redner appoinments, book button which ask for info 
    //when book is clicked, call handleBooK, set the doctorID, appinementID as a property in the button 
  }

  
  render() {
    const myList = this.state.appointments.map((item) => 
      <li key={item.appintmentID}>
        <AppointmentData appintmentID={item.appintmentID} doctorID={item.doctorID}>
        </AppointmentData>
      </li>
    )
    return (
      <div className="doctor-data">
        <div>{this.name} ({this.specialization})</div>
        <button onClick={this.getAppoinements}>Appoinments</button>
        <div className='Appoinments'>
          <ol>{myList}</ol>
        </div>       
      </div>
    );
  }
}

function getAccessToken2(){
  const { httpRequest, getAccessToken} = useAuthContext();
  return getAccessToken();
}

class AppointmentData extends React.Component {
  
  constructor(props) {
    super(props);
    console.log('props='+ props.dcotorID + " "+ props.appintmentID);
    this.doctorID = props.doctorID
    this.handleReserve = this.handleReserve.bind(this);
    this.handleBookingConfirm = this.handleBookingConfirm.bind(this);
    this.onInputchange = this.onInputchange.bind(this);
    this.state = {currentState: 0};
  }

  handleReserve(appintmentID) {
    console.log('appintmentID='+ appintmentID);
    this.setState({currentState: 1, "name":"", "address":"", "phone":""});
  }

  handleBookingConfirm(appintmentID, name, address, phone){
    //const { httpRequest, getAccessToken} = useAuthContext();
    //https://stackoverflow.com/questions/53371356/how-can-i-use-react-hooks-in-react-classic-class-component
    //https://stackoverflow.com/questions/30203044/using-an-authorization-header-with-fetch-in-react-native
    console.log('confirm='+ appintmentID + " "+ name + " "+ address + " " + phone);
    fetch(`api/appointments/${appintmentID}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        //'X-Authorization': getAccessToken()
        'X-Authorization': getAccessToken2()
      },
      body: JSON.stringify({
        "patientName": name,
        "patientAddress":address,
        "patientPhoneNumber": phone,
        "prescription":"", 
        "completed":false
      }),
    })
      .then((result) => console.log(result.text))
      .catch((err) => console.log('error: ', err))
    this.setState({currentState: 2});
    this.setState({"message": "Reservation Sucessful"});
  }

  onInputchange(event) {
    this.setState({
      [event.target.name]: event.target.value
    });
  }



  render() {
    const currentState = this.state.currentState;
    const state1 =  <button onClick={() => this.handleReserve(this.props.appintmentID)}>Reserve</button>
    const state2 = <div>
        Name: <input name="name" value={this.state.name} onChange={this.onInputchange}/>
        Address: <input name="address" value={this.state.address} onChange={this.onInputchange}/>
        Phone Number: <input name="phone" value={this.state.phone} onChange={this.onInputchange}/>
        <button onClick={
          () => this.handleBookingConfirm(this.props.appintmentID,
            this.state.name, this.state.address, this.state.phone)
          }>Confirm</button>
    </div>
    const state3 = this.state.message
    return (
      <div className="appointment-data">
        {this.props.appintmentID} {this.doctorID}
        {currentState == 0? state1 : (currentState == 1 ? state2 : state3)}
      </div>
    );
  }
}


class DoctorView extends React.Component {
  render() {
    return (
      <div className="patient-app-view">
        <h1>Doctor View</h1>
      </div>
    );
  }
}


class AdminView extends React.Component {
  render() {
    return (
      <div className="patient-app-view">
        <h1>Admin View</h1>
      </div>
    );
  }
}


class AppointmentAppView1 extends React.Component {
  render() {
    return (
      <div className="patient-app-view">
        <PatientView/>
        <DoctorView/>
        <AdminView/>
      </div>
    );
  }
}

function AppointmentAppView() {

  const { state, signIn, signOut } = useAuthContext();

  return (
    <div className="App">
      {
        state.isAuthenticated
          ? (
            <div>
              <div>
                <div>
                <ul>
                  <li>{state.username}</li>
                </ul>
                </div>
                <div float="left"><button onClick={() => signOut()}>Logout</button></div>
              </div>
              <div>
                <PatientView/>
                <DoctorView/>
                <AdminView/>
              </div>

            </div>
          )
          : <button onClick={() => signIn()}>Login</button>
      }
    </div>
  );
}



const Index = () => (
  <AuthProvider
      config={ {
          signInRedirectURL: "http://localhost:3000/",
          signOutRedirectURL: "http://localhost:3000/",
          clientID: "Zgqu17G3GtYe8dNIKBpt6TcHICsa",
          baseUrl: "https://api.asgardeo.io/t/srinath23",
          scope: [ "openid","profile" ]
      } }
  >
      <AppointmentAppView />
  </AuthProvider>
);
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render((<Index />));

//const root = ReactDOM.createRoot(document.getElementById("root"));
//root.render(<AppointmentAppView />);



/**
 * 
 *         <input value="Doctor name"
               onChange={this.handleChange} />
        //<button onClick={this.handleChange}>
          Sign Me Up!
        </button>		

 */