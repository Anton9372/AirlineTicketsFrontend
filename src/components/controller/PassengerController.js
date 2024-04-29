import * as React from 'react';
import TextField from '@mui/material/TextField';
import {Paper, Button} from '@mui/material';

const API_URL = process.env.REACT_APP_API_URL;
export default API_URL;

const paperStyle = {
    padding: "5px 0px",
    width: "100%",
    marginTop: "30px",
    backgroundColor: "inherit",
};

const elementStyle = {
    margin: "20px",
    padding: "15px",
    textAlign: "left"
}

const headerStyle = {
    marginBottom: "20px",
    marginTop: "20px"
}

const errorStyle = {
    color: 'red',
    fontSize: '16px',
    fontWeight: 'bold',
    padding: '8px',
    borderRadius: '4px',
    border: '1px solid red',
    backgroundColor: 'rgba(255, 0, 0, 0.1)',
    margin: '10px 200px',
};


const buttonStyle = {
    margin: "20px"
}

export function FindAllPassengers() {
    const [passengers, setPassengers] = React.useState([]);
    const [emptyList, setEmptyList] = React.useState(false);

    const refreshPassengerList = () => {
        console.log("Refresh passenger list");
        setEmptyList(false);
        /*
        fetch("http://localhost:8080/api/v1/passengers", {
            method: "GET"
        })*/
        fetch(`${API_URL}/api/v1/passengers`, {
            method: "GET"
        })
            .then(response => response.json())
            .then(result => {
                if (result.length === 0) {
                    console.log("Empty passenger list");
                    setEmptyList(true);
                }
                setPassengers(result);
            })
    };

    return (
        <Paper elevation={3} style={paperStyle}>
            <h1 style={headerStyle}>All passengers</h1>
            {passengers.map(passenger => (
                <div>
                    <Paper elevation={6} style={elementStyle}>
                        <div>Id: {passenger.id}</div>
                        <div>Name: {passenger.name}</div>
                        <div>Passport number: {passenger.passportNumber}</div>
                    </Paper>
                </div>
            ))}
            {emptyList && (
                <h1 style={errorStyle}>No passengers found</h1>
            )}
            <Button variant="outlined" style={buttonStyle} onClick={refreshPassengerList}>
                View all passengers
            </Button>
        </Paper>
    )
}

export function GetPassengerByIdAndProcessIt() {
    const [passengerId, setPassengerId] = React.useState("");
    const [newPassengerName, setNewPassengerName] = React.useState("");
    const [newPassengerPassport, setNewPassengerPassport] = React.useState("");
    const [passenger, setPassenger] = React.useState(null);
    const [showSelectButton, setShowSelectButton] = React.useState(false);
    const [showDeleteAndUpdateButtons, setShowDeleteAndUpdateButtons] = React.useState(false);
    const [showUpdateField, setShowUpdateField] = React.useState(false);
    const [errorMessage, setErrorMessage] = React.useState("");
    const [showErrorMessage, setShowErrorMessage] = React.useState(false);

    const handleFind = (name) => {
        console.log("Find passenger by id");
        setShowErrorMessage(false);
        /*
        fetch(("http://localhost:8080/api/v1/passengers/" + passengerId), {
            method: "GET"
        })*/
        fetch(`${API_URL}/api/v1/passengers/${passengerId}`, {
            method: "GET"
        })
            .then(response => {
                if (response.ok) {
                    console.log("Passenger get success");
                    return response.json();
                } else {
                    return response.json().then(errorResponse => {
                        throw new Error(errorResponse.error);
                    })
                }
            })
            .then(result => {
                setPassenger(result);
                setShowSelectButton(true);
            })
            .catch(error => {
                console.error("Error finding passenger:", error);
                setPassenger(null);
                setErrorMessage("Passenger not found")
                setShowErrorMessage(true);
            });
    };

    const handleUpdate = () => {
        setShowDeleteAndUpdateButtons(false);
        setShowUpdateField(true);
    };

    const handleDelete = (id) => {
        console.log("Delete passenger:", passenger);
        /*
        fetch(`http://localhost:8080/api/v1/passengers/delete_passenger/` + id, {
            method: "DELETE"
        })*/
        fetch(`${API_URL}/api/v1/passengers/delete_passenger/${id}`, {
            method: "DELETE"
        })
            .then(response => {
                if (response.ok) {
                    console.log("Passenger deleted successfully");
                } else {
                    return response.json().then(errorResponse => {
                        throw new Error(errorResponse.error);
                    })
                }
            })
            .catch(error => {
                console.error("Error deleting Passenger:", error);
            });
        setShowDeleteAndUpdateButtons(false);
    };

    const update = (id, name, passportNumber) => {
        const updatedPassenger = { id, name, passportNumber };
        console.log("Update passenger:", updatedPassenger);
        /*
        fetch(`http://localhost:8080/api/v1/passengers/update_passenger`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(updatedPassenger)
        })*/
        fetch(`${API_URL}/api/v1/passengers/update_passenger`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(updatedPassenger)
        })
            .then(response => {
                if (response.ok) {
                    console.log("Passenger update success");
                } else {
                    return response.json().then(errorResponse => {
                        throw new Error(errorResponse.error);
                    })
                }
            })
            .catch(error => {
                console.error("Error updating passenger:", error);
                setErrorMessage("Name and Passport number should be valid");
                setShowErrorMessage(true);
            });
        setShowUpdateField(false);
    }

    const handleSelect = () => {
        console.log("Passenger selected:", passenger);
        setShowDeleteAndUpdateButtons(true);
        setShowSelectButton(false);
    };

    return (
        <Paper elevation={3} style={paperStyle}>
            <h1 style={headerStyle}>Find passenger</h1>
            <TextField name="outlined" label="Passenger id" variant="outlined"
                       value={passengerId}
                       onChange={(e) => setPassengerId(e.target.value)}
            />
            {showUpdateField && (
                <>
                    <h1></h1>
                    <TextField name="outlined" label="New name" variant="outlined" style={{marginTop: "20px"}}
                               value={newPassengerName}
                               onChange={(e) => setNewPassengerName(e.target.value)}
                    />
                    <h1></h1>
                    <TextField name="outlined" label="New passport number" variant="outlined" style={{marginTop: "20px"}}
                               value={newPassengerPassport}
                               onChange={(e) => setNewPassengerPassport(e.target.value)}
                    />
                    <h1></h1>
                    <Button variant="outlined" style={buttonStyle} onClick={() => update(passenger.id,
                        newPassengerName, newPassengerPassport)}>
                        Save
                    </Button>
                </>
            )}
            {passenger && (
                <>
                    <Paper elevation={6} style={elementStyle}>
                        Id: {passenger.id} <br/>
                        Name: {passenger.name} <br/>
                        Passport number: {passenger.passportNumber} <br/>
                    </Paper>
                    {showSelectButton && (
                        <>
                            <Button variant="outlined" style={buttonStyle} onClick={handleSelect}>
                                Select
                            </Button>
                        </>
                    )}
                    {showDeleteAndUpdateButtons && (
                        <>
                            <Button variant="outlined" style={buttonStyle} onClick={() => handleUpdate()}>
                                Update
                            </Button>
                            <Button variant="outlined" style={buttonStyle} onClick={() =>
                                handleDelete(passenger.id)}>
                                Delete
                            </Button>
                        </>
                    )}
                </>
            )}
            {showErrorMessage && (
                <h1 style={errorStyle}>{errorMessage}</h1>
            )}
            <h1></h1>
            <Button variant="outlined" style={buttonStyle} onClick={() => handleFind(passengerId)}>
                FIND
            </Button>
        </Paper>

    );
}

export function AddPassenger() {
    const [name, setName] = React.useState("")
    const [passportNumber, setPassportNumber] = React.useState("")
    const [errorMessage, setErrorMessage] = React.useState("");
    const [showErrorMessage, setShowErrorMessage] = React.useState(false);

    const handleSaveButton = () => {
        console.log("Add passenger");
        setShowErrorMessage(false);
        const newPassenger = {name, passportNumber}
        console.log(newPassenger);
        /*
        fetch("http://localhost:8080/api/v1/passengers/save_passenger",{
            method:"POST",
            headers:{"Content-Type":"application/json"},
            body:JSON.stringify(newPassenger)
        })*/
        fetch(`${API_URL}/api/v1/passengers/save_passenger`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(newPassenger)
        })
            .then(response => {
                if (response.ok) {
                    console.log("New passenger added");
                } else {
                    return response.json().then(errorResponse => {
                        throw new Error(errorResponse.error);
                    })
                }
            })
            .catch(error => {
                console.log("Error add passenger", error);
                setShowErrorMessage(true);
                setErrorMessage("Name and Passport number should be valid");
            });
    };

    return (
        <Paper elevation={3} style={paperStyle}>
            <h1 style={headerStyle}>Create new passenger</h1>
            <TextField name="outlined" label="Name" variant="outlined"
                       value={name}
                       onChange={(e) => setName(e.target.value)}
            />
            <h1></h1>
            <TextField name="outlined" label="Passport number" variant="outlined"
                       value={passportNumber}
                       onChange={(e) => setPassportNumber(e.target.value)}
            />
            {showErrorMessage && (
                <h1 style={errorStyle}>{errorMessage}</h1>
            )}
            <h1></h1>
            <Button variant="outlined" style={buttonStyle} onClick={handleSaveButton}>
                SAVE
            </Button>
        </Paper>
    )
}

export function FindAllPassengerReservations() {
    const [passengerId, setPassengerId] = React.useState("");
    const [reservations, setReservations] = React.useState([]);
    const [showErrorMessage, setShowErrorMessage] = React.useState(false);
    const [errorMessage, setErrorMessage] = React.useState("");

    const refreshReservationList = () => {
        console.log("Get reservation list from passenger with id:", passengerId);
        setReservations([]);
        setShowErrorMessage(false);
        /*
        fetch("http://localhost:8080/api/v1/passengers/" + passengerId + "/reservations", {
            method: "GET"
        })*/
        fetch(`${API_URL}/api/v1/passengers/${passengerId}/reservations`, {
            method: "GET"
        })
            .then(response => {
                if (response.ok) {
                    return response.json();
                } else {
                    return response.json().then(errorResponse => {
                        return response.json().then(errorResponse => {
                            throw new Error(errorResponse.error);
                        })
                    });
                }
            })
            .then(result => {
                if (result.length === 0) {
                    setErrorMessage("No reservations found");
                    setShowErrorMessage(true);
                }
                setReservations(result);
                console.log("Success get reservation list");
            })
            .catch(error => {
                setErrorMessage("No passenger found");
                setShowErrorMessage(true);
                console.error("Error get reservation list:", error);
            });

    };

    return (
        <Paper elevation={3} style={paperStyle}>
            <h1 style={headerStyle}>Passenger's reservations</h1>
            <TextField name="outlined" label="Passeger Id" variant="outlined"
                       value={passengerId}
                       onChange={(e) => setPassengerId(e.target.value)}
            />
            <h1></h1>
            {reservations.map(reservation => (
                <div>
                    <Paper elevation={6} style={elementStyle}>
                        <div>Reservation id: {reservation.id}</div>
                        <br/>
                        <div>Passenger id: {reservation.passenger.id}</div>
                        <div>Passenger name: {reservation.passenger.name}</div>
                        <div>Passenger passport number: {reservation.passenger.passportNumber}</div>
                        <br/>
                        <div>Ticket id: {reservation.ticket.id}</div>
                        <div>Ticket price: {reservation.ticket.price}</div>
                        <br/>
                        <div>Flight id: {reservation.ticket.flight.id}</div>
                        <div>Flight departure town: {reservation.ticket.flight.departureTown}</div>
                        <div>Flight arrival town: {reservation.ticket.flight.arrivalTown}</div>
                        <div>Flight departure date-time: {reservation.ticket.flight.departureDateTime}</div>
                        <div>Flight airline name: {reservation.ticket.flight.airlineName}</div>
                    </Paper>
                </div>
            ))}
            {showErrorMessage && (
                <h1 style={errorStyle}>{errorMessage}</h1>
            )}
            <Button variant="outlined" style={buttonStyle} onClick={() => refreshReservationList()}>
                View passenger's reservations
            </Button>
        </Paper>
    )
}

