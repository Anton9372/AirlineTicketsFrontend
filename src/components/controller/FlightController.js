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

export function Flights() {
    const [flights, setFlights] = React.useState([]);
    const [flightPassengers, setFlightPassengers] = React.useState([]);
    const [flightTickets, setFlightTickets] = React.useState([]);

    const [departureTown, setDepartureTown] = React.useState("");
    const [arrivalTown, setArrivalTown] = React.useState("");
    const [newDepartureTown, setNewDepartureTown] = React.useState("");
    const [newArrivalTown, setNewArrivalTown] = React.useState("");
    const [newDepartureDate, setNewDepartureDate] = React.useState("")
    const [newTicketPrice, setNewTicketPrice] = React.useState("");
    const [numOfTickets, setNumOfTickets] = React.useState("");

    const [errorMessage, setErrorMessage] = React.useState("");
    const [showErrorMessage, setShowErrorMessage] = React.useState(false);

    const [selectedFlight, setSelectedFlight] = React.useState(null);
    const [showFlightTicketsDialog, setShowFlightTicketsDialog] = React.useState(false);
    const [showFlightPassengersDialog, setShowFlightPassengersDialog] = React.useState(false);
    const [showCreateTicketsDialog, setShowCreateTicketsDialog] = React.useState(false);
    const [showEditDialog, setShowEditDialog] = React.useState(false);

    const handleFindFlightsButton = () => {
        let path = "";
        if (departureTown.trim() !== "" && arrivalTown.trim() !== "") {
            path = `${API_URL}/api/v1/flights/departure_town/${departureTown}/arrival_town/${arrivalTown}`;
        } else if (departureTown.trim() !== "") {
            path = `${API_URL}/api/v1/flights/departure_town/${departureTown}`;
        } else if (arrivalTown.trim() !== "") {
            path = `${API_URL}/api/v1/flights/arrival_town/${arrivalTown}`;
        } else {
            path = `${API_URL}/api/v1/flights`;
        }
        refreshFlightList(path);
    };

    const refreshFlightList = (requestPath) => {
        console.log("Refresh flight list");
        console.log(requestPath);
        setShowErrorMessage(false);
        fetch(requestPath, {
            method: "GET"
        })
            .then(response => {
                if (response.ok) {
                    console.log("Flight list get success");
                    return response.json();
                } else {
                    return response.json().then(errorResponse => {
                        throw new Error(errorResponse.error);
                    })
                }
            })
            .then(result => {
                if (result.length === 0) {
                    console.log("Empty flight list");
                    setErrorMessage("No flights found");
                    setShowErrorMessage(true);
                }
                result.sort((a, b) => new Date(a.departureDateTime) - new Date(b.departureDateTime));
                setFlights(result);
            })
            .catch(error => {
                console.error("Error finding flights:", error);
            });
    };

    const handleOpenEditDialog = (flight) => {
        setSelectedFlight(flight);
        setShowEditDialog(true);
    }

    const handleOpenFlightPassengersDialog = (flight) => {
        setSelectedFlight(flight);
        handleFindFlightPassengersButton(flight.id);
        setShowFlightPassengersDialog(true);
    }

    const handleOpenFlightTicketsDialog = (flight) => {
        setSelectedFlight(flight);
        handleFindFlightTicketsButton(flight.id);
        setShowFlightTicketsDialog(true);
    }

    const handleOpenCreateTicketsDialog = (flight) => {
        setSelectedFlight(flight);
        setShowCreateTicketsDialog(true);
    }

    const handleCloseEditDialog = () => {
        setSelectedFlight(null);
        setShowEditDialog(false);
        setShowErrorMessage(false);
    }

    const handleCloseFlightPassengersDialog = () => {
        setSelectedFlight(null);
        setShowFlightPassengersDialog(false);
        setShowErrorMessage(false);
    }

    const handleCloseFlightTicketsDialog = () => {
        setSelectedFlight(null);
        setShowFlightTicketsDialog(false);
        setShowErrorMessage(false);
    }

    const handleCloseCreateTicketsDialog = () => {
        setSelectedFlight(null);
        setShowCreateTicketsDialog(false);
        setShowErrorMessage(false);
    }

    const handleDeleteFlightButton = (flightId) => {
        setShowErrorMessage(false);
        console.log("Delete flight. flightId: ", flightId);
        fetch(`${API_URL}/api/v1/flights/delete_flight/${flightId}`, {
            method: "DELETE"
        })
            .then(response => {
                if (response.ok) {
                    console.log("Flight deleted successfully");
                    setShowEditDialog(false);
                } else {
                    return response.json().then(errorResponse => {
                        throw new Error(errorResponse.error);
                    })
                }
            })
            .catch(error => {
                console.error("Error deleting flight:", error);
            });
    };

    const handleUpdateFlightButton = (id, departureTown, arrivalTown, departureDateTime, airlineId) => {
        setShowErrorMessage(false);
        const updatedFlight = {id, departureTown, arrivalTown, departureDateTime};
        console.log("Update flight:", updatedFlight);
        fetch(`${API_URL}/api/v1/flights/update_flight/${airlineId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(updatedFlight)
        })
            .then(response => {
                if (response.ok) {
                    console.log("Flight update success");
                    setShowEditDialog(false);
                } else {
                    if (response.status === 404) {
                        setErrorMessage("Airline not found");
                    } else {
                        setErrorMessage("departureTown, arrivalTown, departureDate must be valid");
                    }
                    return response.json().then(errorResponse => {
                        throw new Error(errorResponse.error);
                    })
                }
            })
            .catch(error => {
                console.error("Error updating flight:", error);
                setShowErrorMessage(true);
            });
    }

    const handleCreateTicketsButton = (price, numOfTickets, flightId) => {
        setShowErrorMessage(false);
        const newTicket = {price}
        console.log("Create tickets. flightId: " + flightId, " price: " + price + " num: " + numOfTickets);
        fetch(`${API_URL}/api/v1/tickets/save_tickets/${flightId}/${numOfTickets}`, {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body:JSON.stringify(newTicket)
        })
            .then(response => {
                if (response.ok) {
                    console.log("Create tickets success");
                    setShowCreateTicketsDialog(false);
                } else {
                    if (response.status === 404) {
                        setErrorMessage("Flight not found");
                    } else if (response.status === 400) {
                        setErrorMessage("Num of tickets and price must be valid");
                    } else {
                        setErrorMessage("Unknown error");
                    }
                    return response.json().then(errorResponse => {
                        throw new Error(errorResponse.error);
                    })
                }
            })
            .catch(error => {
                console.error("Error create tickets", error);
                setShowErrorMessage(true);
            });
    }

    const handleFindFlightPassengersButton = (flightId) => {
        console.log("Get passenger list from flight with id: ", flightId);
        setFlightPassengers([]);
        setShowErrorMessage(false);
        fetch(`${API_URL}/api/v1/flights/${flightId}/passengers`, {
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
                    setErrorMessage("No passengers found");
                    setShowErrorMessage(true);
                }
                result.sort((a, b) => (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0));
                setFlightPassengers(result);
                console.log("Success get passengers list");
            })
            .catch(error => {
                setErrorMessage("No flight found");
                setShowErrorMessage(true);
                console.error("Error get passenger list:", error);
            });
    }

    const handleFindFlightTicketsButton = (flightId) => {
        console.log("Get ticket list from flight with id: ", flightId);
        setFlightTickets([]);
        setShowErrorMessage(false);
        fetch(`${API_URL}/api/v1/flights/${flightId}/tickets`, {
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
                    setErrorMessage("No tickets found");
                    setShowErrorMessage(true);
                }
                result.sort((a, b) => a.price - b.price);
                setFlightTickets(result);
                console.log("Success get ticket list");
            })
            .catch(error => {
                setErrorMessage("No flight found");
                setShowErrorMessage(true);
                console.error("Error get ticket list:", error);
            });
    }

    const editDialog = selectedFlight !== null && showEditDialog && (
        <>
            <div style={backdropStyle}></div>
            <div style={popUpWindowStyle}>
                <h2>Edit Ticket</h2>
                <TextField name="outlined" label="New departure town" variant="outlined"
                           value={newDepartureTown}
                           onChange={(e) => setNewDepartureTown(e.target.value)}
                />
                <TextField name="outlined" label="New arrival town" variant="outlined"
                           value={newArrivalTown}
                           onChange={(e) => setNewArrivalTown(e.target.value)}
                />
                <TextField name="outlined" label="New departure date-time" variant="outlined"
                           value={newDepartureDate}
                           onChange={(e) => setNewDepartureDate(e.target.value)}
                />
                {showErrorMessage && (
                    <h2 style={errorStyle}>{errorMessage}</h2>
                )}
                <h2>
                    <Button variant="contained" style={buttonStyle}
                            onClick={() => handleDeleteFlightButton(selectedFlight.id)}>
                        DELETE
                    </Button>
                    <Button variant="contained" style={buttonStyle} onClick={() =>
                        handleUpdateFlightButton(selectedFlight.id, newDepartureTown, newArrivalTown, newDepartureDate,
                            selectedFlight.airline.id)}>
                        SAVE CHANGES
                    </Button>
                    <Button variant="outlined" style={buttonStyle} onClick={handleCloseEditDialog}>
                        CANCEL
                    </Button>
                </h2>
            </div>
        </>
    );

    const createTicketsDialog = selectedFlight !== null && showCreateTicketsDialog && (
        <>
            <div style={backdropStyle}></div>
            <div style={popUpWindowStyle}>
                <h2>Create tickets</h2>
                <TextField name="outlined" label="Price" variant="outlined"
                           value={newTicketPrice}
                           onChange={(e) => setNewTicketPrice(e.target.value)}
                />
                <TextField name="outlined" label="Number of tickets" variant="outlined"
                           value={numOfTickets}
                           onChange={(e) => setNumOfTickets(e.target.value)}
                />
                {showErrorMessage && (
                    <h2 style={errorStyle}>{errorMessage}</h2>
                )}
                <h2>
                    <Button variant="contained" style={buttonStyle}
                            onClick={() => handleCreateTicketsButton(newTicketPrice, numOfTickets, selectedFlight.id)}>
                        CONFIRM
                    </Button>
                    <Button variant="outlined" style={buttonStyle} onClick={handleCloseCreateTicketsDialog}>
                        CANCEL
                    </Button>
                </h2>
            </div>
        </>
    );

    const flightPassengersDialog = selectedFlight !== null && showFlightPassengersDialog && (
        <>
            <div style={backdropStyle}></div>
            <div style={popUpWindowStyle}>
                <h2>Flight №{selectedFlight.id} passengers</h2>

                {showErrorMessage && (
                    <h2 style={errorStyle}>{errorMessage}</h2>
                )}

                {flightPassengers.map(passenger => (
                    <div key={passenger.id}>
                        <Paper elevation={6} style={{margin: '20px 200px', padding: '15px', display: 'flex'}}>
                            <div style={contentStyle}>
                                <div style={{color: 'green', marginBottom: '15px', fontSize: '20px'}}>
                                    {passenger.name}
                                </div>
                                <div style={{marginBottom: '10px', fontSize: '20px'}}>
                                    Passport №: {passenger.passportNumber}</div>
                            </div>
                        </Paper>
                    </div>
                ))}

                <h2>
                    <Button variant="outlined" style={buttonStyle} onClick={handleCloseFlightPassengersDialog}>
                        EXIT
                    </Button>
                </h2>
            </div>
        </>
    );

    const flightTicketsDialog = selectedFlight !== null && showFlightTicketsDialog && (
        <>
        <div style={backdropStyle}></div>
        <div style={popUpWindowStyle}>
            <h2>Flight №{selectedFlight.id} ticketss</h2>

            {showErrorMessage && (
                <h2 style={errorStyle}>{errorMessage}</h2>
            )}

            {flightTickets.map(ticket => (
                <div key={ticket.id}>
                    <Paper elevation={6} style={{margin: '20px 200px', padding: '15px', display: 'flex'}}>
                        <div style={contentStyle}>
                            <div style={{color: 'blue', marginBottom: '15px', fontSize: '20px'}}>
                                {ticket.price} USD
                            </div>
                            <div style={{marginBottom: '10px', fontSize: '20px'}}>
                                {ticket.flight.departureTown} - {ticket.flight.arrivalTown}</div>
                            <div style={{marginBottom: '5px', fontSize: '16px'}}>
                                {formatDate(ticket.flight.departureDateTime)}</div>
                            <div style={{fontSize: '15px'}}>
                                {ticket.flight.airlineName}
                            </div>
                            {ticket.reserved ? (
                                <div style={{color: 'red', marginTop: '15px', fontSize: '18px', fontWeight: '700'}}>
                                    RESERVED
                                </div>
                            ) : (
                                <div style={{color: 'green', marginTop: '15px', fontSize: '18px', fontWeight: '700'}}>
                                    UNRESERVED
                                </div>
                            )}
                        </div>
                    </Paper>
                </div>
        ))}

        <h2>
            <Button variant="outlined" style={buttonStyle} onClick={handleCloseFlightTicketsDialog}>
                EXIT
            </Button>
        </h2>
        </div>
</>
)
    ;

    return (
        <Paper elevation={3} style={paperStyle}>
            <h1 style={headerStyle}>Find flights</h1>
            <h1>
                <TextField name="outlined" label="Departure town" variant="outlined"
                           value={departureTown}
                           onChange={(e) => setDepartureTown(e.target.value)}
                />
                <TextField name="outlined" label="Arrival town" variant="outlined"
                           style={{marginLeft: '20px', marginRight: '100px'}}
                           value={arrivalTown}
                           onChange={(e) => setArrivalTown(e.target.value)}
                />
                <Button variant="contained" style={buttonStyle} onClick={handleFindFlightsButton}>
                    Find flights
                </Button>
            </h1>

            {showErrorMessage && (
                <h1 style={{marginLeft: '500px', marginRight: '500px', ...errorStyle}}>{errorMessage}</h1>
            )}

            {editDialog}
            {flightPassengersDialog}
            {flightTicketsDialog}
            {createTicketsDialog}

            {flights.map(flight => (
                <div key={flight.id}>
                    <Paper elevation={6} style={elementStyle}>

                        <div style={{width: '50%', ...contentStyle}}>
                            <div style={{color: 'green', marginBottom: '15px', fontSize: '20px'}}>
                                №{flight.id}
                            </div>
                            <div style={{marginBottom: '10px', fontSize: '20px'}}>
                                {flight.departureTown} - {flight.arrivalTown}</div>
                            <div style={{marginBottom: '5px', fontSize: '16px'}}>
                                {formatDate(flight.departureDateTime)}</div>
                        </div>

                        <div style={{width: '25%'}}>
                            <Button variant="contained" color="primary" style={{marginTop: '30px'}}
                                    onClick={() => handleOpenFlightPassengersDialog(flight)}>
                                Passengers
                            </Button>
                            <Button variant="contained" color="primary" style={{marginTop: '30px'}}
                                    onClick={() => handleOpenFlightTicketsDialog(flight)}>
                                Tickets
                            </Button>
                        </div>

                        <div style={{width: '25%'}}>
                            <h1>
                                <Button variant="outlined" color="primary" style={{}}
                                        onClick={() => handleOpenEditDialog(flight)}>
                                    Edit
                                </Button>
                                <Button variant="outlined" color="primary" style={{marginTop: '30px'}}
                                        onClick={() => handleOpenCreateTicketsDialog(flight)}>
                                    Add tickets
                                </Button>
                            </h1>
                        </div>

                    </Paper>
                </div>
            ))}
        </Paper>
    )
}
