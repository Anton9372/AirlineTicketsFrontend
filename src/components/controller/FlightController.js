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
    margin: '10px 20px',
};


const buttonStyle = {
    margin: "20px"
}

export function FindFlights() {
    const [flights, setFlights] = React.useState([]);
    const [departureTown, setDepartureTown] = React.useState("");
    const [arrivalTown, setArrivalTown] = React.useState("");
    const [errorMessage, setErrorMessage] = React.useState("");
    const [showErrorMessage, setShowErrorMessage] = React.useState(false);
    /*
    const find = () => {
        let path = "";
        if(departureTown.trim() !== "" && arrivalTown.trim() !== "") {
                path = "http://localhost:8080/api/v1/flights/departure_town/" +
                    departureTown + "/arrival_town/" + arrivalTown;
        }
        else if(departureTown.trim() !== "") {
                path = "http://localhost:8080/api/v1/flights/departure_town/" + departureTown;
        }
        else if(arrivalTown.trim() !== "") {
                path = "http://localhost:8080/api/v1/flights/arrival_town/" + arrivalTown;
        }
        else {
                path = "http://localhost:8080/api/v1/flights";
        }
        refreshFlightList(path);
    }*/

    const find = () => {
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
                setFlights(result);
            })
            .catch(error => {
                console.error("Error finding flights:", error);
            });
    };

    return (
        <Paper elevation={3} style={paperStyle}>
            <h1 style={headerStyle}>Find flights</h1>
            <h1></h1>
            <TextField name="outlined" label="Departure town" variant="outlined"
                       value={departureTown}
                       onChange={(e) => setDepartureTown(e.target.value)}
            />
            <h1></h1>
            <TextField name="outlined" label="Arrival town" variant="outlined"
                       value={arrivalTown}
                       onChange={(e) => setArrivalTown(e.target.value)}
            />
            <h1></h1>
            {showErrorMessage && (
                <h1 style={errorStyle}>{errorMessage}</h1>
            )}
            <h1></h1>
            <Button variant="outlined" style={buttonStyle} onClick={find}>
                Find flights
            </Button>
            {flights.map(flight => (
                <div>
                    <Paper elevation={6} style={elementStyle}>
                        <div>Id: {flight.id}</div>
                        <div>Departure town: {flight.departureTown}</div>
                        <div>Arrival town: {flight.arrivalTown}</div>
                        <div>Departure date-time: {flight.departureDateTime}</div>
                        <div>Airline name: {flight.airlineName}</div>
                    </Paper>
                </div>
            ))}
        </Paper>
    )
}

export function FindAllFlightTickets() {
    const [flightId, setFlightId] = React.useState("");
    const [tickets, setTickets] = React.useState([]);
    const [showErrorMessage, setShowErrorMessage] = React.useState(false);
    const [errorMessage, setErrorMessage] = React.useState("");

    const refreshTicketList = () => {
        console.log("Get ticket list from flight with id:", flightId);
        setTickets([]);
        setShowErrorMessage(false);
        /*
        fetch("http://localhost:8080/api/v1/flights/" + flightId + "/tickets", {
            method: "GET"
        })*/
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
                setTickets(result);
                console.log("Success get ticket list");
            })
            .catch(error => {
                setErrorMessage("No flight found");
                setShowErrorMessage(true);
                console.error("Error get ticket list:", error);
            });

    };

    return (
        <Paper elevation={3} style={paperStyle}>
            <h1 style={headerStyle}>Flight's tickets</h1>
            <TextField name="outlined" label="Flight Id" variant="outlined"
                       value={flightId}
                       onChange={(e) => setFlightId(e.target.value)}
            />
            <h1></h1>
            {tickets.map(ticket => (
                <div>
                    <Paper elevation={6} style={elementStyle}>
                        <div>Id: {ticket.id}</div>
                        <div>Price: {ticket.price}</div>
                        <div>Is reserved: {ticket.reserved ? 'Yes' : 'No'}</div>
                    </Paper>
                </div>
            ))}
            {showErrorMessage && (
                <h1 style={errorStyle}>{errorMessage}</h1>
            )}
            <Button variant="outlined" style={buttonStyle} onClick={() => refreshTicketList()}>
                View flight's tickets
            </Button>
        </Paper>
    )
}

export function FindAllFlightPassengers() {
    const [flightId, setFlightId] = React.useState("");
    const [passengers, setPassengers] = React.useState([]);
    const [showErrorMessage, setShowErrorMessage] = React.useState(false);
    const [errorMessage, setErrorMessage] = React.useState("");

    const refreshPassengerList = () => {
        console.log("Get passenger list from flight with id:", flightId);
        setPassengers([]);
        setShowErrorMessage(false);
        /*
        fetch("http://localhost:8080/api/v1/flights/" + flightId + "/passengers", {
            method: "GET"
        })*/
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
                setPassengers(result);
                console.log("Success get passenger list");
            })
            .catch(error => {
                setErrorMessage("No flight found");
                setShowErrorMessage(true);
                console.error("Error get passengers list:", error);
            });

    };

    return (
        <Paper elevation={3} style={paperStyle}>
            <h1 style={headerStyle}>Flight's passengers</h1>
            <TextField name="outlined" label="Flight Id" variant="outlined"
                       value={flightId}
                       onChange={(e) => setFlightId(e.target.value)}
            />
            <h1></h1>
            {passengers.map(passenger => (
                <div>
                    <Paper elevation={6} style={elementStyle}>
                        <div>Id: {passenger.id}</div>
                        <div>Name: {passenger.name}</div>
                        <div>Passport number: {passenger.passportNumber}</div>
                    </Paper>
                </div>
            ))}
            {showErrorMessage && (
                <h1 style={errorStyle}>{errorMessage}</h1>
            )}
            <Button variant="outlined" style={buttonStyle} onClick={() => refreshPassengerList()}>
                View flight's passengers
            </Button>
        </Paper>
    )
}

export function GetFlightByIdAndProcessIt() {
    const [flightId, setFlightId] = React.useState("");
    const [newDepartureTown, setNewDepartureTown] = React.useState("");
    const [newArrivalTown, setNewArrivalTown] = React.useState("");
    const [newDepartureDateTime, setNewDepartureDateTime] = React.useState("");
    const [newAirlineName, setNewAirlineName] = React.useState("");
    const [flight, setFlight] = React.useState(null);
    const [showSelectButton, setShowSelectButton] = React.useState(false);
    const [showDeleteAndUpdateButtons, setShowDeleteAndUpdateButtons] = React.useState(false);
    const [showUpdateField, setShowUpdateField] = React.useState(false);
    const [errorMessage, setErrorMessage] = React.useState("");
    const [showErrorMessage, setShowErrorMessage] = React.useState(false);

    const handleFind = (name) => {
        console.log("Find flight by id");
        setShowErrorMessage(false);
        /*
        fetch(("http://localhost:8080/api/v1/flights/" + flightId), {
            method: "GET"
        })*/
        fetch(`${API_URL}/api/v1/flights/${flightId}`, {
            method: "GET"
        })
            .then(response => {
                if (response.ok) {
                    console.log("Flight get success");
                    return response.json();
                } else {
                    return response.json().then(errorResponse => {
                        throw new Error(errorResponse.error);
                    })
                }
            })
            .then(result => {
                setFlight(result);
                setShowSelectButton(true);
            })
            .catch(error => {
                console.error("Error finding flight:", error);
                setFlight(null);
                setErrorMessage("Flight not found")
                setShowErrorMessage(true);
            });
    };

    const handleUpdate = () => {
        setShowDeleteAndUpdateButtons(false);
        setShowUpdateField(true);
    };

    const handleDelete = (id) => {
        console.log("Delete flight:", flight);
        /*
        fetch(`http://localhost:8080/api/v1/flights/delete_flight/` + id, {
            method: "DELETE"
        })*/
        fetch(`${API_URL}/api/v1/flights/delete_flight/${id}`, {
            method: "DELETE"
        })
            .then(response => {
                if (response.ok) {
                    console.log("Flight deleted successfully");
                } else {
                    return response.json().then(errorResponse => {
                        throw new Error(errorResponse.error);
                    })
                }
            })
            .catch(error => {
                console.error("Error deleting flight:", error);
            });
        setShowDeleteAndUpdateButtons(false);
    };

    const update = (id, departureTown, arrivalTown, departureDateTime, airlineName) => {
        const updatedFlight = { id, departureTown, arrivalTown, departureDateTime };
        console.log("Update flight:", updatedFlight);
        /*
        fetch(`http://localhost:8080/api/v1/flights/update_flight/` + airlineName, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(updatedFlight)
        })*/
        fetch(`${API_URL}/api/v1/flights/update_flight/${airlineName}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(updatedFlight)
        })
            .then(response => {
                if (response.ok) {
                    console.log("Flight update success");
                } else {
                    if(response.status === 404) {
                        setErrorMessage("No airline found");
                    } else {
                        setErrorMessage("All fields should be valid. Date-time format: YYYY-MM-DDThh:mm");
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
        setShowUpdateField(false);
    }

    const handleSelect = () => {
        console.log("Flight selected:", flight);
        setShowDeleteAndUpdateButtons(true);
        setShowSelectButton(false);
    };

    return (
        <Paper elevation={3} style={paperStyle}>
            <h1 style={headerStyle}>Find flight</h1>
            <TextField name="outlined" label="Flight id" variant="outlined"
                       value={flightId}
                       onChange={(e) => setFlightId(e.target.value)}
            />
            {showUpdateField && (
                <>
                    <h1></h1>
                    <TextField name="outlined" label="New departure town" variant="outlined" style={{marginTop: "20px"}}
                               value={newDepartureTown}
                               onChange={(e) => setNewDepartureTown(e.target.value)}
                    />
                    <h1></h1>
                    <TextField name="outlined" label="New arrival town" variant="outlined" style={{marginTop: "20px"}}
                               value={newArrivalTown}
                               onChange={(e) => setNewArrivalTown(e.target.value)}
                    />
                    <h1></h1>
                    <TextField name="outlined" label="New departure date time" variant="outlined"
                               style={{marginTop: "20px"}}
                               value={newDepartureDateTime}
                               onChange={(e) => setNewDepartureDateTime(e.target.value)}
                    />
                    <h1></h1>
                    <TextField name="outlined" label="New airline name" variant="outlined" style={{marginTop: "20px"}}
                               value={newAirlineName}
                               onChange={(e) => setNewAirlineName(e.target.value)}
                    />
                    <h1></h1>
                    <Button variant="outlined" style={buttonStyle}
                            onClick={() => update(flight.id, newDepartureTown, newArrivalTown,
                                newDepartureDateTime, newAirlineName)}>
                        Save
                    </Button>
                </>
            )}
            {flight && (
                <>
                    <Paper elevation={6} style={elementStyle}>
                        <div>Id: {flight.id}</div>
                        <div>Departure town: {flight.departureTown}</div>
                        <div>Arrival town: {flight.arrivalTown}</div>
                        <div>Departure date-time: {flight.departureDateTime}</div>
                        <div>Airline name: {flight.airlineName}</div>
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
                                handleDelete(flight.id)}>
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
            <Button variant="outlined" style={buttonStyle} onClick={() => handleFind(flightId)}>
                FIND
            </Button>
        </Paper>

    );
}

export function AddFlight() {
    const [departureTown, setDepartureTown] = React.useState("");
    const [arrivalTown, setArrivalTown] = React.useState("");
    const [departureDateTime, setDepartureDateTime] = React.useState("");
    const [airlineName, setAirlineName] = React.useState("");
    const [errorMessage, setErrorMessage] = React.useState("");
    const [showErrorMessage, setShowErrorMessage] = React.useState(false);

    const handleSaveButton = () => {
        console.log("Add flight");
        setShowErrorMessage(false);
        const newFlight = {departureTown, arrivalTown, departureDateTime}
        console.log(newFlight);
        /*
        fetch("http://localhost:8080/api/v1/flights/save_flight/" + airlineName,{
            method:"POST",
            headers:{"Content-Type":"application/json"},
            body:JSON.stringify(newFlight)
        })*/
        fetch(`${API_URL}/api/v1/flights/save_flight/${airlineName}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(newFlight)
        })
            .then(response => {
                if (response.ok) {
                    console.log("New flight added");
                } else {
                    if(response.status === 404) {
                        setErrorMessage("No airline found");
                    } else {
                        setErrorMessage("All fields should be valid. Date-time format: YYYY-MM-DDThh:mm");
                    }
                    return response.json().then(errorResponse => {
                        throw new Error(errorResponse.error);
                    })
                }
            })
            .catch(error => {
                console.log("Error add flight", error);
                setShowErrorMessage(true);
            });
    };

    return (
        <Paper elevation={3} style={paperStyle}>
            <h1 style={headerStyle}>Create new flight</h1>
            <h1></h1>
            <TextField name="outlined" label="Departure town" variant="outlined" style={{marginTop: "20px"}}
                       value={departureTown}
                       onChange={(e) => setDepartureTown(e.target.value)}
            />
            <h1></h1>
            <TextField name="outlined" label="Arrival town" variant="outlined" style={{marginTop: "20px"}}
                       value={arrivalTown}
                       onChange={(e) => setArrivalTown(e.target.value)}
            />
            <h1></h1>
            <TextField name="outlined" label="Departure date time" variant="outlined" style={{marginTop: "20px"}}
                       value={departureDateTime}
                       onChange={(e) => setDepartureDateTime(e.target.value)}
            />
            <h1></h1>
            <TextField name="outlined" label="Airline name" variant="outlined" style={{marginTop: "20px"}}
                       value={airlineName}
                       onChange={(e) => setAirlineName(e.target.value)}
            />
            <h1></h1>
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