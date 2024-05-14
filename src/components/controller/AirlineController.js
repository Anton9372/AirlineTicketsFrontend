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

export function Airlines() {
    const [airlines, setAirlines] = React.useState([]);
    const [airlineFlights, setAirlineFlights] = React.useState([]);

    const [airlineName, setAirlineName] = React.useState("");
    const [newAirlineName, setNewAirlineName] = React.useState("");
    const [newFlightDepartureTown, setNewFlightDepartureTown] = React.useState("");
    const [newFlightArrivalTown, setNewFlightArrivalTown] = React.useState("");
    const [newFlightDepartureDate, setNewFlightDepartureDate] = React.useState("");


    const [errorMessage, setErrorMessage] = React.useState("");
    const [showErrorMessage, setShowErrorMessage] = React.useState(false);

    const [selectedAirline, setSelectedAirline] = React.useState(null);
    const [showCreateAirlineDialog, setShowCreateAirlineDialog] = React.useState(false);
    const [showAirlineFlightsDialog, setShowAirlineFlightsDialog] = React.useState(false);
    const [showEditDialog, setShowEditDialog] = React.useState(false);
    const [showCreateFlightDialog, setShowCreateFlightDialog] = React.useState(false);

    const handleFindAirlinesButton = () => {
        let path = "";
        if (airlineName.trim() === "") {
            path = `${API_URL}/api/v1/airlines`;
        } else {
            path = `${API_URL}/api/v1/airlines/name/${airlineName}`;
        }
        refreshAirlineList(path);
    };

    const refreshAirlineList = (requestPath) => {
        console.log("Refresh airline list");
        console.log(requestPath);
        setShowErrorMessage(false);
        fetch(requestPath, {
            method: "GET"
        })
            .then(response => {
                if (response.ok) {
                    console.log("Airline list get success");
                    return response.json();
                } else {
                    return response.json().then(errorResponse => {
                        throw new Error(errorResponse.error);
                    })
                }
            })
            .then(result => {
                if (result.length === 0) {
                    console.log("Empty airline list");
                    setErrorMessage("No airlines found");
                    setShowErrorMessage(true);
                }
                result.sort((a, b) => (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0));
                setAirlines(result);
            })
            .catch(error => {
                console.error("Error finding airlines:", error);
            });
    };

    const handleOpenCreateAirlineDialog = () => {
        setShowCreateAirlineDialog(true);
    }

    const handleOpenAirlineFlightsDialog = (airline) => {
        setSelectedAirline(airline);
        setShowAirlineFlightsDialog(true);
        handleFindAirlineFlightsButton(airline.id);
    }

    const handleOpenEditDialog = (airline) => {
        setSelectedAirline(airline);
        setShowEditDialog(true);
    }

    const handleOpenCreateFlightDialog = (airline) => {
        setSelectedAirline(airline);
        setShowCreateFlightDialog(true);
    }

    const handleCloseCreateAirlineDialog = () => {
        setShowCreateAirlineDialog(false);
        setShowErrorMessage(false);
        setNewAirlineName('');
    }

    const handleCloseAirlineFlightsDialog = () => {
        setSelectedAirline(null);
        setShowAirlineFlightsDialog(false);
        setShowErrorMessage(false);
    }

    const handleCloseEditDialog = () => {
        setSelectedAirline(null);
        setShowEditDialog(false);
        setShowErrorMessage(false);
        setNewAirlineName('');
    }

    const handleCloseCreateFlightDialog = () => {
        setShowCreateFlightDialog(false);
        setShowErrorMessage(false);
    }

    const handleCreateAirlineButton = (name) => {
        setShowErrorMessage(false);
        const newAirline = {name}
        console.log("Create airline: ", newAirline);
        fetch(`${API_URL}/api/v1/airlines/save_airline`, {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body:JSON.stringify(newAirline)
        })
            .then(response => {
                if (response.ok) {
                    console.log("Create airline success");
                    setShowCreateAirlineDialog(false);
                } else {
                    setErrorMessage("Invalid name");
                    return response.json().then(errorResponse => {
                        throw new Error(errorResponse.error);
                    })
                }
            })
            .catch(error => {
                console.error("Error create airline", error);
                setShowErrorMessage(true);
            });
    }

    const handleFindAirlineFlightsButton = (airlineId) => {
        console.log("Get flight list from airline with id: ", airlineId);
        setAirlineFlights([]);
        setShowErrorMessage(false);
        fetch(`${API_URL}/api/v1/airlines/${airlineId}/flights`, {
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
                    setErrorMessage("No flights found");
                    setShowErrorMessage(true);
                }
                result.sort((a, b) => new Date(a.departureDateTime) - new Date(b.departureDateTime));
                setAirlineFlights(result);
                console.log("Success get flight list");
            })
            .catch(error => {
                setErrorMessage("No airline found");
                setShowErrorMessage(true);
                console.error("Error get flight list:", error);
            });
    }

    const handleDeleteAirlineButton = (airlineId) => {
        setShowErrorMessage(false);
        console.log("Delete airline. airlineId: ", airlineId);
        fetch(`${API_URL}/api/v1/airlines/delete_airline/${airlineId}`, {
            method: "DELETE"
        })
            .then(response => {
                if (response.ok) {
                    console.log("Airline deleted successfully");
                    setShowEditDialog(false);
                } else {
                    return response.json().then(errorResponse => {
                        throw new Error(errorResponse.error);
                    })
                }
            })
            .catch(error => {
                console.error("Error deleting airline:", error);
            });
    };

    const handleUpdateAirlineButton = (id, name) => {
        setShowErrorMessage(false);
        const updatedAirline = {id, name};
        console.log("Update airline:", updatedAirline);
        fetch(`${API_URL}/api/v1/airlines/update_airline`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(updatedAirline)
        })
            .then(response => {
                if (response.ok) {
                    console.log("Airline update success");
                    setShowEditDialog(false);
                } else {
                    if (response.status === 404) {
                        setErrorMessage("Airline not found");
                    } else {
                        setErrorMessage("Name is not valid");
                    }
                    return response.json().then(errorResponse => {
                        throw new Error(errorResponse.error);
                    })
                }
            })
            .catch(error => {
                console.error("Error updating airline:", error);
                setShowErrorMessage(true);
            });
    }

    const handleCreateFlightButton = (airlineId, departureTown, arrivalTown, departureDateTime) => {
        setShowErrorMessage(false);
        const newFlight = {departureTown, arrivalTown, departureDateTime}
        console.log("Create flight: ", newFlight);
        fetch(`${API_URL}/api/v1/flights/save_flight/${airlineId}`, {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body:JSON.stringify(newFlight)
        })
            .then(response => {
                if (response.ok) {
                    console.log("Create flight success");
                    setShowCreateFlightDialog(false);
                } else {
                    setErrorMessage("departureTown, arrivalTown and date must be valid");
                    return response.json().then(errorResponse => {
                        throw new Error(errorResponse.error);
                    })
                }
            })
            .catch(error => {
                console.error("Error create flight", error);
                setShowErrorMessage(true);
            });
    }

    const createAirlineDialog = showCreateAirlineDialog && (
        <>
            <div style={backdropStyle}></div>
            <div style={popUpWindowStyle}>
                <h2>Create Airline</h2>
                <TextField name="outlined" label="Name" variant="outlined"
                           value={newAirlineName}
                           onChange={(e) => setNewAirlineName(e.target.value)}
                />
                {showErrorMessage && (
                    <h2 style={errorStyle}>{errorMessage}</h2>
                )}
                <h2>
                    <Button variant="contained" style={buttonStyle}
                            onClick={() => handleCreateAirlineButton(newAirlineName)}>
                        CREATE
                    </Button>
                    <Button variant="outlined" style={buttonStyle} onClick={handleCloseCreateAirlineDialog}>
                        CANCEL
                    </Button>
                </h2>
            </div>
        </>
    );

    const airlineFlightsDialog = selectedAirline !== null && showAirlineFlightsDialog && (
        <>
            <div style={backdropStyle}></div>
            <div style={popUpWindowStyle}>
                <h2>{selectedAirline.name} flights</h2>

                {showErrorMessage && (
                    <h2 style={errorStyle}>{errorMessage}</h2>
                )}

                {airlineFlights.map(flight => (
                    <div key={flight.id}>
                        <Paper elevation={6} style={{margin: '20px 200px', padding: '15px', display: 'flex'}}>
                            <div style={contentStyle}>
                                <div style={{color: 'green', marginBottom: '15px', fontSize: '20px'}}>
                                    №{flight.id}
                                </div>
                                <div style={{marginBottom: '10px', fontSize: '20px'}}>
                                    {flight.departureTown} - {flight.arrivalTown}</div>
                                <div style={{marginBottom: '5px', fontSize: '16px'}}>
                                    {formatDate(flight.departureDateTime)}</div>
                            </div>
                        </Paper>
                    </div>
                ))}

                <h2>
                    <Button variant="outlined" style={buttonStyle} onClick={handleCloseAirlineFlightsDialog}>
                        EXIT
                    </Button>
                </h2>
            </div>
        </>
    );

    const editDialog = selectedAirline !== null && showEditDialog && (
        <>
            <div style={backdropStyle}></div>
            <div style={popUpWindowStyle}>
                <h2>Edit Airline</h2>
                <TextField name="outlined" label="New name" variant="outlined"
                           value={newAirlineName}
                           onChange={(e) => setNewAirlineName(e.target.value)}
                />
                {showErrorMessage && (
                    <h2 style={errorStyle}>{errorMessage}</h2>
                )}
                <h2>
                    <Button variant="contained" style={buttonStyle}
                            onClick={() => handleDeleteAirlineButton(selectedAirline.id)}>
                        DELETE
                    </Button>
                    <Button variant="contained" style={buttonStyle} onClick={() =>
                        handleUpdateAirlineButton(selectedAirline.id, newAirlineName)}>
                        SAVE CHANGES
                    </Button>
                    <Button variant="outlined" style={buttonStyle} onClick={handleCloseEditDialog}>
                        CANCEL
                    </Button>
                </h2>
            </div>
        </>
    );

    const createFlightDialog = selectedAirline !== null && showCreateFlightDialog && (
        <>
            <div style={backdropStyle}></div>
            <div style={popUpWindowStyle}>
                <h2>Create Flight</h2>
                <TextField name="outlined" label="Departure town" variant="outlined"
                           value={newFlightDepartureTown}
                           onChange={(e) => setNewFlightDepartureTown(e.target.value)}
                />
                <TextField name="outlined" label="Arrival town" variant="outlined"
                           value={newFlightArrivalTown}
                           onChange={(e) => setNewFlightArrivalTown(e.target.value)}
                />
                <TextField name="outlined" label="Departure date-time" variant="outlined" style={{marginTop: '10px'}}
                           value={newFlightDepartureDate}
                           onChange={(e) => setNewFlightDepartureDate(e.target.value)}
                />
                {showErrorMessage && (
                    <h2 style={errorStyle}>{errorMessage}</h2>
                )}
                <h2>
                    <Button variant="contained" style={buttonStyle}
                            onClick={() => handleCreateFlightButton(selectedAirline.id, newFlightDepartureTown,
                                newFlightArrivalTown, newFlightDepartureDate)}>
                        CREATE
                    </Button>
                    <Button variant="outlined" style={buttonStyle} onClick={handleCloseCreateFlightDialog}>
                        CANCEL
                    </Button>
                </h2>
            </div>
        </>
    );

    return (
        <Paper elevation={3} style={paperStyle}>
            <h1 style={headerStyle}>Explore airlines</h1>
            <h1>
                <TextField name="outlined" label="Airline name" variant="outlined" style={{}}
                           value={airlineName}
                           onChange={(e) => setAirlineName(e.target.value)}
                />
                <Button variant="contained" style={buttonStyle} onClick={handleFindAirlinesButton}>
                    Find airlines
                </Button>
                <Button variant="contained" style={buttonStyle}
                        onClick={handleOpenCreateAirlineDialog}>
                    Create Airline
                </Button>
            </h1>

            {showErrorMessage && (
                <h1 style={{marginLeft: '500px', marginRight: '500px', ...errorStyle}}>{errorMessage}</h1>
            )}

            {createAirlineDialog}
            {airlineFlightsDialog}
            {editDialog}
            {createFlightDialog}

            {airlines.map(airline => (
                <div key={airline.id}>
                    <Paper elevation={6} style={elementStyle}>

                        <div style={{width: '70%', ...contentStyle}}>
                            <div style={{color: 'green', marginBottom: '15px', fontSize: '20px'}}>
                                {airline.name}
                            </div>
                        </div>

                        <div style={{width: '30%'}}>
                            <Button variant="outlined" color="primary" style={{marginTop: '30px'}}
                                    onClick={() => handleOpenEditDialog(airline)}>
                                Edit
                            </Button>
                            <h1>
                                <Button variant="contained" color="primary"
                                        onClick={() => handleOpenAirlineFlightsDialog(airline)}>
                                    FLIGHTS
                                </Button>
                            </h1>
                            <h1>
                                <Button variant="outlined" color="primary"
                                        onClick={() => handleOpenCreateFlightDialog(airline)}>
                                    Create Flight
                                </Button>
                            </h1>
                        </div>

                    </Paper>
                </div>
            ))}
        </Paper>
    )
}
