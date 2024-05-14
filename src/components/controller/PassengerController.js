import * as React from 'react';
import TextField from '@mui/material/TextField';
import {Button, Paper} from '@mui/material';
import API_URL from "../../config";

const paperStyle = {
    padding: '5px 0px',
    width: '100%',
    marginTop: '30px',
    backgroundColor: 'inherit',
};

const elementStyle = {
    margin: '20px 300px',
    padding: '15px',
    display: 'flex',
}

const headerStyle = {
    marginBottom: '20px',
    marginTop: '20px',
}

const errorStyle = {
    color: 'red',
    fontSize: '16px',
    fontWeight: 'bold',
    padding: '8px',
    borderRadius: '4px',
    border: '1px solid red',
    backgroundColor: 'rgba(255, 0, 0, 0.1)',
    marginTop: '10px',
};

const buttonStyle = {
    marginLeft: "20px",
    marginRight: "20px",
    height: '56px',
}

const contentStyle = {
    margin: '20px',
    textAlign: "left",
    fontWeight: '500',
}

const popUpWindowStyle = {
    position: 'fixed',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    zIndex: '1000',
    backgroundColor: '#fff',
    paddingLeft: '50px',
    paddingRight: '50px',
    boxShadow: '0px 0px 10px 0px rgba(0,0,0,0.5)',
    borderRadius: '5px',
    overflowY: 'auto',
    maxHeight: '80vh'
}

const backdropStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: '999'
};

const formatDate = (dateString) => {
    const date = new Date(dateString);
    const formattedDate = date.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
    });
    const time = date.toLocaleTimeString('en-GB', {
        hour: '2-digit',
        minute: '2-digit',
    });
    return `${formattedDate} ${time}`;
};

export function Passengers() {
    const [passengers, setPassengers] = React.useState([]);
    const [passengerReservations, setPassengerReservations] = React.useState([]);
    const [passengerName, setPassengerName] = React.useState("");
    const [newPassengerName, setNewPassengerName] = React.useState("");
    const [newPassengerPassport, setNewPassengerPassport] = React.useState("");

    const [errorMessage, setErrorMessage] = React.useState("");
    const [showErrorMessage, setShowErrorMessage] = React.useState(false);

    const [selectedPassenger, setSelectedPassenger] = React.useState(null);
    const [showCreatePassengerDialog, setShowCreatePassengerDialog] = React.useState(false);
    const [showPassengerReservationsDialog, setShowPassengerReservationsDialog] = React.useState(false);
    const [showEditDialog, setShowEditDialog] = React.useState(false);

    const handleFindPassengersButton = () => {
        let path = "";
        if (passengerName.trim() === "") {
            path = `${API_URL}/api/v1/passengers`;
        } else {
            path = `${API_URL}/api/v1/passengers/name/${passengerName}`;
        }
        refreshPassengerList(path);
    };

    const refreshPassengerList = (requestPath) => {
        console.log("Refresh passenger list");
        console.log(requestPath);
        setShowErrorMessage(false);
        fetch(requestPath, {
            method: "GET"
        })
            .then(response => {
                if (response.ok) {
                    console.log("Passenger list get success");
                    return response.json();
                } else {
                    return response.json().then(errorResponse => {
                        throw new Error(errorResponse.error);
                    })
                }
            })
            .then(result => {
                if (result.length === 0) {
                    console.log("Empty passenger list");
                    setErrorMessage("No passengers found");
                    setShowErrorMessage(true);
                }
                result.sort((a, b) => (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0));
                setPassengers(result);
            })
            .catch(error => {
                console.error("Error finding passengers:", error);
            });
    };

    const handleOpenCreatePassengerDialog = () => {
        setShowCreatePassengerDialog(true);
    }

    const handleOpenPassengerReservationsDialog = (passenger) => {
        setSelectedPassenger(passenger);
        setShowPassengerReservationsDialog(true);
        handleFindPassengerReservationsButton(passenger.id);
    }

    const handleOpenEditDialog = (passenger) => {
        setSelectedPassenger(passenger);
        setShowEditDialog(true);
    }

    const handleCloseCreatePassengerDialog = () => {
        setShowCreatePassengerDialog(false);
        setShowErrorMessage(false);
        setNewPassengerName('');
        setNewPassengerPassport('');
    }

    const handleClosePassengerReservationsDialog = () => {
        setSelectedPassenger(null);
        setShowPassengerReservationsDialog(false);
        setShowErrorMessage(false);
    }

    const handleCloseEditDialog = () => {
        setSelectedPassenger(null);
        setShowEditDialog(false);
        setShowErrorMessage(false);
        setNewPassengerName('');
        setNewPassengerPassport('');
    }

    const handleCreatePassengerButton = (name, passportNumber) => {
        setShowErrorMessage(false);
        const newPassenger = {name, passportNumber}
        console.log("Create passenger: ", newPassenger);
        fetch(`${API_URL}/api/v1/passengers/save_passenger`, {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body:JSON.stringify(newPassenger)
        })
            .then(response => {
                if (response.ok) {
                    console.log("Create passenger success");
                    setShowCreatePassengerDialog(false);
                } else {
                    setErrorMessage("Invalid name");
                    return response.json().then(errorResponse => {
                        throw new Error(errorResponse.error);
                    })
                }
            })
            .catch(error => {
                console.error("Error create passenger", error);
                setShowErrorMessage(true);
            });
    }

    const handleFindPassengerReservationsButton = (passengerId) => {
        console.log("Get reservation list from passenger with id: ", passengerId);
        setPassengerReservations([]);
        setShowErrorMessage(false);
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
                result.sort((a, b) => new Date(a.ticket.flight.departureDateTime) - new Date(b.ticket.flight.departureDateTime));
                setPassengerReservations(result);
                console.log("Success get reservation list");
            })
            .catch(error => {
                setErrorMessage("No passenger found");
                setShowErrorMessage(true);
                console.error("Error get reservation list:", error);
            });
    }

    const handleDeletePassengerButton = (passengerId) => {
        setShowErrorMessage(false);
        console.log("Delete passenger. passengerId: ", passengerId);
        fetch(`${API_URL}/api/v1/passengers/delete_passenger/${passengerId}`, {
            method: "DELETE"
        })
            .then(response => {
                if (response.ok) {
                    console.log("Passenger deleted successfully");
                    setShowEditDialog(false);
                } else {
                    return response.json().then(errorResponse => {
                        throw new Error(errorResponse.error);
                    })
                }
            })
            .catch(error => {
                console.error("Error deleting passenger:", error);
            });
    };

    const handleUpdatePassengerButton = (id, name, passportNumber) => {
        setShowErrorMessage(false);
        const updatedPassenger = {id, name, passportNumber};
        console.log("Update passenger:", updatedPassenger);
        fetch(`${API_URL}/api/v1/passengers/update_passenger`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(updatedPassenger)
        })
            .then(response => {
                if (response.ok) {
                    console.log("Passenger update success");
                    setShowEditDialog(false);
                } else {
                    if (response.status === 404) {
                        setErrorMessage("Passenger not found");
                    } else {
                        setErrorMessage("Name and Passport must be valid");
                    }
                    return response.json().then(errorResponse => {
                        throw new Error(errorResponse.error);
                    })
                }
            })
            .catch(error => {
                console.error("Error updating passenger:", error);
                setShowErrorMessage(true);
            });
    }

    const handleCancelReservationButton = (ticketId) => {
        setShowErrorMessage(false);
        console.log("cancel reservation: " + ticketId);
        fetch(`${API_URL}/api/v1/reservations/cancel_booking/ticket_id/${ticketId}`, {
            method: "DELETE",
        })
            .then(response => {
                if (response.ok) {
                    console.log("Ticket cancel booking success");
                } else {
                    return response.json().then(errorResponse => {
                        throw new Error(errorResponse.error);
                    })
                }
            })
            .catch(error => {
                console.log("Error cancel booking ticket", error);
                setErrorMessage("Ticket not found");
                setShowErrorMessage(true);
            });
    }

    const createPassengerDialog = showCreatePassengerDialog && (
        <>
            <div style={backdropStyle}></div>
            <div style={popUpWindowStyle}>
                <h2>Create Passenger</h2>
                <TextField name="outlined" label="Name" variant="outlined"
                           value={newPassengerName}
                           onChange={(e) => setNewPassengerName(e.target.value)}
                />
                <TextField name="outlined" label="Passport number" variant="outlined"
                           value={newPassengerPassport}
                           onChange={(e) => setNewPassengerPassport(e.target.value)}
                />
                {showErrorMessage && (
                    <h2 style={errorStyle}>{errorMessage}</h2>
                )}
                <h2>
                    <Button variant="contained" style={buttonStyle}
                            onClick={() => handleCreatePassengerButton(newPassengerName, newPassengerPassport)}>
                        CREATE
                    </Button>
                    <Button variant="outlined" style={buttonStyle} onClick={handleCloseCreatePassengerDialog}>
                        CANCEL
                    </Button>
                </h2>
            </div>
        </>
    );

    const passengerReservationsDialog = selectedPassenger !== null && showPassengerReservationsDialog && (
        <>
            <div style={backdropStyle}></div>
            <div style={popUpWindowStyle}>
                <h2>{selectedPassenger.name} reservations</h2>

                {showErrorMessage && (
                    <h2 style={errorStyle}>{errorMessage}</h2>
                )}

                {passengerReservations.map(reservation => (
                    <div key={reservation.id}>
                        <Paper elevation={6} style={{margin: '20px 150px', padding: '15px', display: 'flex'}}>
                            <div style={{width: '70%', ...contentStyle}}>
                                <div style={{color: 'green', marginBottom: '15px', fontSize: '20px'}}>
                                    {reservation.ticket.flight.departureTown} - {reservation.ticket.flight.arrivalTown}
                                </div>
                                <div style={{marginBottom: '10px', fontSize: '20px'}}>
                                    {formatDate(reservation.ticket.flight.departureDateTime)}</div>
                                <div style={{marginBottom: '5px', fontSize: '16px'}}>
                                    {reservation.ticket.flight.airlineName}</div>
                                <div style={{fontSize: '15px'}}>
                                    {reservation.ticket.price} USD
                                </div>
                            </div>

                            <div style={{width: '30%'}}>
                                <Button variant="contained" color="primary" style={{marginTop: '105px', marginRight: '40px'}}
                                        onClick={() => handleCancelReservationButton(reservation.ticket.id)}>
                                    ABOLISH
                                </Button>
                            </div>
                        </Paper>
                    </div>
                ))}

                <h2>
                    <Button variant="outlined" style={buttonStyle} onClick={handleClosePassengerReservationsDialog}>
                        EXIT
                    </Button>
                </h2>
            </div>
        </>
    );

    const editDialog = selectedPassenger !== null && showEditDialog && (
        <>
            <div style={backdropStyle}></div>
            <div style={popUpWindowStyle}>
                <h2>Edit Passenger</h2>
                <TextField name="outlined" label="New name" variant="outlined"
                           value={newPassengerName}
                           onChange={(e) => setNewPassengerName(e.target.value)}
                />
                <TextField name="outlined" label="New passport number" variant="outlined"
                           value={newPassengerPassport}
                           onChange={(e) => setNewPassengerPassport(e.target.value)}
                />
                {showErrorMessage && (
                    <h2 style={errorStyle}>{errorMessage}</h2>
                )}
                <h2>
                    <Button variant="contained" style={buttonStyle}
                            onClick={() => handleDeletePassengerButton(selectedPassenger.id)}>
                        DELETE
                    </Button>
                    <Button variant="contained" style={buttonStyle} onClick={() =>
                        handleUpdatePassengerButton(selectedPassenger.id, newPassengerName, newPassengerPassport)}>
                        SAVE CHANGES
                    </Button>
                    <Button variant="outlined" style={buttonStyle} onClick={handleCloseEditDialog}>
                        CANCEL
                    </Button>
                </h2>
            </div>
        </>
    );

    return (
        <Paper elevation={3} style={paperStyle}>
            <h1 style={headerStyle}>Check Passengers</h1>
            <h1>
                <TextField name="outlined" label="Passenger name" variant="outlined" style={{}}
                           value={passengerName}
                           onChange={(e) => setPassengerName(e.target.value)}
                />
                <Button variant="contained" style={buttonStyle} onClick={handleFindPassengersButton}>
                    Find passengers
                </Button>
                <Button variant="contained" style={buttonStyle}
                        onClick={handleOpenCreatePassengerDialog}>
                    Create Passenger
                </Button>
            </h1>

            {showErrorMessage && (
                <h1 style={{marginLeft: '500px', marginRight: '500px', ...errorStyle}}>{errorMessage}</h1>
            )}

            {createPassengerDialog}
            {passengerReservationsDialog}
            {editDialog}

            {passengers.map(passenger => (
                <div key={passenger.id}>
                    <Paper elevation={6} style={elementStyle}>

                        <div style={{width: '70%', ...contentStyle}}>
                            <div style={{color: 'green', marginBottom: '15px', fontSize: '20px'}}>
                                {passenger.name}
                            </div>
                            <div style={{marginBottom: '10px', fontSize: '20px'}}>
                                Passport №: {passenger.passportNumber}</div>
                        </div>

                        <div style={{width: '30%'}}>
                            <Button variant="outlined" color="primary" style={{marginTop: '30px'}}
                                    onClick={() => handleOpenEditDialog(passenger)}>
                                Edit
                            </Button>
                            <h1>
                                <Button variant="contained" color="primary"
                                        onClick={() => handleOpenPassengerReservationsDialog(passenger)}>
                                    RESERVATIONS
                                </Button>
                            </h1>
                        </div>

                    </Paper>
                </div>
            ))}
        </Paper>
    )
}
