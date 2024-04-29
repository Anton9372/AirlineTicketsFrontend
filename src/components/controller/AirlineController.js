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

export function FindAllAirlines() {
    const [airlines, setAirlines] = React.useState([]);
    const [emptyList, setEmptyList] = React.useState(false);

    const refreshAirlineList = () => {
        console.log("Refresh airline list");
        setEmptyList(false);
       // fetch("http://localhost:8080/api/v1/airlines", {
           // method: "GET"
        //})
        fetch(`${API_URL}/api/v1/airlines`, {
            method: "GET"
        })
            .then(response => response.json())
            .then(result => {
                if (result.length === 0) {
                    console.log("Empty airline list");
                    setEmptyList(true);
                }
                setAirlines(result);
            })
    };

    return (
        <Paper elevation={3} style={paperStyle}>
            <h1 style={headerStyle}>All airlines</h1>
            {airlines.map(airline => (
                <div>
                    <Paper elevation={6} style={elementStyle}>
                        <div>Id: {airline.id}</div>
                        <div>Name: {airline.name}</div>
                    </Paper>
                </div>
            ))}
            {emptyList && (
                <h1 style={errorStyle}>No airlines found</h1>
            )}
            <Button variant="outlined" style={buttonStyle} onClick={refreshAirlineList}>
                View all airlines
            </Button>
        </Paper>
    )
}

export function GetAirlineByNameAndProcessIt() {
    const [airlineName, setAirlineName] = React.useState("");
    const [newAirlineName, setNewAirlineName] = React.useState("");
    const [airline, setAirline] = React.useState(null);
    const [showSelectButton, setShowSelectButton] = React.useState(false);
    const [showDeleteAndUpdateButtons, setShowDeleteAndUpdateButtons] = React.useState(false);
    const [showUpdateField, setShowUpdateField] = React.useState(false);
    const [airlineNotFound, setAirlineNotFound] = React.useState(false);
    const [notValidName, setNotValidName] = React.useState(false);

    const handleFind = (name) => {
        console.log("Find airline by name");
        setNotValidName(false);
        //fetch(("http://localhost:8080/api/v1/airlines/" + name), {
            //method: "GET"
        //})
        fetch((`${API_URL}/api/v1/airlines/${name}`), {
            method: "GET"
        })
            .then(response => {
                if (response.ok) {
                    console.log("Airline get success");
                    return response.json();
                } else {
                    return response.json().then(errorResponse => {
                        throw new Error(errorResponse.error);
                    })
                }
            })
                .then(result => {
                    setAirline(result);
                    setAirlineNotFound(false);
                    setShowSelectButton(true);
                })
                .catch(error => {
                    console.error("Error finding airline:", error);
                    setAirline(null);
                    setAirlineNotFound(true);
                });
    };

    const handleUpdate = () => {
        setShowDeleteAndUpdateButtons(false);
        setShowUpdateField(true);
    };

    const handleDelete = (name) => {
        console.log("Delete airline:", airline);
        //fetch(`http://localhost:8080/api/v1/airlines/delete_airline/` + name, {
            //method: "DELETE"
        //})
        fetch(`${API_URL}/api/v1/airlines/delete_airline/${name}`, {
            method: "DELETE"
        })
            .then(response => {
                if (response.ok) {
                    console.log("Airline deleted successfully");
                } else {
                    return response.json().then(errorResponse => {
                        throw new Error(errorResponse.error);
                    })
                }
            })
            .catch(error => {
                console.error("Error deleting airline:", error);
            });
        setShowDeleteAndUpdateButtons(false);
    };

    const update = (id, name) => {
        const updatedAirline = { id, name };
        console.log("Update airline:", updatedAirline);
        //fetch(`http://localhost:8080/api/v1/airlines/update_airline`, {
            //method: "PUT",
            //headers: { "Content-Type": "application/json" },
            //body: JSON.stringify(updatedAirline)
        //})
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
                } else {
                    return response.json().then(errorResponse => {
                        throw new Error(errorResponse.error);
                    })
                }
            })
            .catch(error => {
                console.error("Error updating airline:", error);
                setNotValidName(true);
            });
        setShowUpdateField(false);
    }

    const handleSelect = () => {
        console.log("Airline selected:", airline);
        setShowDeleteAndUpdateButtons(true);
        setShowSelectButton(false);
    };

    return (
        <Paper elevation={3} style={paperStyle}>
            <h1 style={headerStyle}>Find airline</h1>
            <TextField name="outlined" label="Name" variant="outlined"
                       value={airlineName}
                       onChange={(e) => setAirlineName(e.target.value)}
            />
            {showUpdateField && (
                <>
                    <h1></h1>
                    <TextField name="outlined" label="New name" variant="outlined" style={{marginTop: "20px"}}
                               value={newAirlineName}
                               onChange={(e) => setNewAirlineName(e.target.value)}
                    />
                    <h1></h1>
                    <Button variant="outlined" style={buttonStyle} onClick={() => update(airline.id,
                        newAirlineName)}>
                        Save
                    </Button>
                </>
            )}
            {airline && (
                <>
                    <Paper elevation={6} style={elementStyle}>
                        Id: {airline.id} <br/>
                        Name: {airline.name} <br/>
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
                                handleDelete(airline.name)}>
                                Delete
                            </Button>
                        </>
                    )}
                </>
            )}
            {airlineNotFound && (
                <h1 style={errorStyle}>Airline not found</h1>
            )}
            {notValidName && (
                <h1 style={errorStyle}>Not valid name</h1>
            )}
            <h1></h1>
            <Button variant="outlined" style={buttonStyle} onClick={() => handleFind(airlineName)}>
                FIND
            </Button>
        </Paper>

    );
}

export function AddAirline() {
    const [name, setName] = React.useState("")
    const [notValidName, setNotValidName] = React.useState(false);

    const handleSaveButton = () => {
        console.log("Add airline")
        setNotValidName(false);
        const newAirline = {name}
        console.log(newAirline)
        //fetch("http://localhost:8080/api/v1/airlines/save_airline",{
            //method:"POST",
            //headers:{"Content-Type":"application/json"},
            //body:JSON.stringify(newAirline)
        //})
        fetch(`${API_URL}/api/v1/airlines/save_airline`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(newAirline)
        })
            .then(response => {
                if (response.ok) {
                    console.log("New airline added");
                } else {
                    return response.json().then(errorResponse => {
                        throw new Error(errorResponse.error);
                    })
                }
            })
        .catch(error => {
            console.log("Error add airline", error);
            setNotValidName(true);
        });
    };

    return (
        <Paper elevation={3} style={paperStyle}>
            <h1 style={headerStyle}>Create new airline</h1>
            <TextField name="outlined" label="Name" variant="outlined"
                       value={name}
                       onChange={(e) => setName(e.target.value)}
            />
            {notValidName && (
                <h1 style={errorStyle}>Not valid name</h1>
            )}
            <h1></h1>
            <Button variant="outlined" style={buttonStyle} onClick={handleSaveButton}>
                SAVE
            </Button>
        </Paper>
    )
}

export function FindAllAirlineFlights() {
    const [airlineName, setAirlineName] = React.useState("");
    const [flights, setFlights] = React.useState([]);
    const [errorMessage, setErrorMessage] = React.useState("");
    const [showErrorMessage, setShowErrorMessage] = React.useState(false);

    const refreshFlightList = (name) => {
        console.log("Get flight list from airline:", name);
        setFlights([]);
        setShowErrorMessage(false);
        //fetch("http://localhost:8080/api/v1/airlines/" + name + "/flights", {
            //method: "GET"
        //})
        fetch(`${API_URL}/api/v1/airlines/${name}/flights`, {
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
                setFlights(result);
                console.log("Success get flight list");
            })
            .catch(error => {
                setErrorMessage("No airline found");
                setShowErrorMessage(true);
                console.error("Error get flight list:", error);
            });

    };

    return (
        <Paper elevation={3} style={paperStyle}>
            <h1 style={headerStyle}>Airline flights</h1>
            <TextField name="outlined" label="Name" variant="outlined"
                       value={airlineName}
                       onChange={(e) => setAirlineName(e.target.value)}
            />
            <h1></h1>
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
            {showErrorMessage && (
                <h1 style={errorStyle}>{errorMessage}</h1>
            )}
            <Button variant="outlined" style={buttonStyle} onClick={() => refreshFlightList(airlineName)}>
                View airline flights
            </Button>
        </Paper>
    )
}

