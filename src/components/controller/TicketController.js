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

export function FindTickets() {
    const [tickets, setTickets] = React.useState([]);
    const [departureTown, setDepartureTown] = React.useState("");
    const [arrivalTown, setArrivalTown] = React.useState("");
    const [findUnreserved, setFindUnreserved] = React.useState(false);
    const [errorMessage, setErrorMessage] = React.useState("");
    const [showErrorMessage, setShowErrorMessage] = React.useState(false);

    /*
    const find = () => {
        let path = "";
        if(departureTown.trim() !== "" && arrivalTown.trim() !== "") {
            console.log("1");
            if(findUnreserved) {
               path = "http://localhost:8080/api/v1/tickets/unreserved/departure_town/" +
                    departureTown + "/arrival_town/" + arrivalTown;
            } else {
                path = "http://localhost:8080/api/v1/tickets/departure_town/" +
                    departureTown + "/arrival_town/" + arrivalTown;
            }
        }
        else if(departureTown.trim() !== "") {
            console.log("2");
            if(findUnreserved) {
                path = "http://localhost:8080/api/v1/tickets/unreserved/departure_town/" + departureTown;
            } else {
                path = "http://localhost:8080/api/v1/tickets/departure_town/" + departureTown;
            }
        }
        else if(arrivalTown.trim() !== "") {
            console.log("3");
            if(findUnreserved) {
                path = "http://localhost:8080/api/v1/tickets/unreserved/arrival_town/" + arrivalTown;
            } else {
                path = "http://localhost:8080/api/v1/tickets/arrival_town/" + arrivalTown;
            }
        }
        else {
            console.log("4");
            if(findUnreserved) {
                path ="http://localhost:8080/api/v1/tickets/unreserved";
            } else {
                path = "http://localhost:8080/api/v1/tickets";
            }
        }
        refreshTicketList(path);
    }*/

    const find = () => {
        let path = "";
        if (departureTown.trim() !== "" && arrivalTown.trim() !== "") {
            console.log("1");
            if (findUnreserved) {
                path = `${API_URL}/api/v1/tickets/unreserved/departure_town/${departureTown}/arrival_town/${arrivalTown}`;
            } else {
                path = `${API_URL}/api/v1/tickets/departure_town/${departureTown}/arrival_town/${arrivalTown}`;
            }
        } else if (departureTown.trim() !== "") {
            console.log("2");
            if (findUnreserved) {
                path = `${API_URL}/api/v1/tickets/unreserved/departure_town/${departureTown}`;
            } else {
                path = `${API_URL}/api/v1/tickets/departure_town/${departureTown}`;
            }
        } else if (arrivalTown.trim() !== "") {
            console.log("3");
            if (findUnreserved) {
                path = `${API_URL}/api/v1/tickets/unreserved/arrival_town/${arrivalTown}`;
            } else {
                path = `${API_URL}/api/v1/tickets/arrival_town/${arrivalTown}`;
            }
        } else {
            console.log("4");
            if (findUnreserved) {
                path = `${API_URL}/api/v1/tickets/unreserved`;
            } else {
                path = `${API_URL}/api/v1/tickets`;
            }
        }
        refreshTicketList(path);
    };


    const refreshTicketList = (requestPath) => {
        console.log("Refresh ticket list");
        console.log(requestPath);
        setShowErrorMessage(false);
        fetch(requestPath, {
            method: "GET"
        })
            .then(response => {
                if (response.ok) {
                    console.log("Ticket list get success");
                    return response.json();
                } else {
                    return response.json().then(errorResponse => {
                        throw new Error(errorResponse.error);
                    })
                }
            })
            .then(result => {
                if (result.length === 0) {
                    console.log("Empty ticket list");
                    setErrorMessage("No tickets found");
                    setShowErrorMessage(true);
                }
                setTickets(result);
            })
            .catch(error => {
                console.error("Error finding tickets:", error);
            });
    };

    const handleUnreservedButton = () => {
        setFindUnreserved(!findUnreserved);
    }

    return (
        <Paper elevation={3} style={paperStyle}>
            <h1 style={headerStyle}>Find tickets</h1>
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
            <Button variant="outlined" style={buttonStyle} onClick={handleUnreservedButton}>
                {findUnreserved ? "Find unreserved" : "Find all"}
            </Button>
            <h1></h1>
            {showErrorMessage && (
                <h1 style={errorStyle}>{errorMessage}</h1>
            )}
            <h1></h1>
            <Button variant="outlined" style={buttonStyle} onClick={find}>
                Find tickets
            </Button>
            {tickets.map(ticket => (
                <div>
                    <Paper elevation={6} style={elementStyle}>
                        <div>Id: {ticket.id}</div>
                        <div>Price: {ticket.price}</div>
                        <div>Is reserved: {ticket.reserved ? 'Yes' : 'No'}</div>
                        <br/>
                        <div>Flight id: {ticket.flight.id}</div>
                        <div>Flight departure town: {ticket.flight.departureTown}</div>
                        <div>Flight arrival town: {ticket.flight.arrivalTown}</div>
                        <div>Flight departure date-time: {ticket.flight.departureDateTime}</div>
                        <div>Flight airline name: {ticket.flight.airlineName}</div>
                    </Paper>
                </div>
            ))}
        </Paper>
    )
}

export function AddTickets() {
    const [price, setPrice] = React.useState("");
    const [flightId, setFlightId] = React.useState("");
    const [numOfTickets, setNumOfTickets] = React.useState("");
    const [errorMessage, setErrorMessage] = React.useState("");
    const [showErrorMessage, setShowErrorMessage] = React.useState(false);

    const handleSaveButton = () => {
        console.log("Add tickets");
        setShowErrorMessage(false);
        const newTicket = {price}
        console.log(newTicket);
        /*
        fetch("http://localhost:8080/api/v1/tickets/save_tickets/" + flightId + "/" + numOfTickets,{
            method:"POST",
            headers:{"Content-Type":"application/json"},
            body:JSON.stringify(newTicket)
        })*/
        fetch(`${API_URL}/api/v1/tickets/save_tickets/${flightId}/${numOfTickets}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(newTicket)
        })
            .then(response => {
                if (response.ok) {
                    console.log("New tickets added");
                } else {
                    if(response.status === 404) {
                        setErrorMessage("Flight not found");
                    }
                    else {
                        setErrorMessage("All fields should be valid");
                    }
                    return response.json().then(errorResponse => {
                        throw new Error(errorResponse.error);
                    })
                }
            })
            .catch(error => {
                console.log("Error add ticket", error);
                setShowErrorMessage(true);
            });
    };

    return (
        <Paper elevation={3} style={paperStyle}>
            <h1 style={headerStyle}>Create new tickets</h1>
            <h1></h1>
            <TextField name="outlined" label="Flight id" variant="outlined" style={{marginTop: "20px"}}
                       value={flightId}
                       onChange={(e) => setFlightId(e.target.value)}
            />
            <h1></h1>
            <TextField name="outlined" label="Price" variant="outlined" style={{marginTop: "20px"}}
                       value={price}
                       onChange={(e) => setPrice(e.target.value)}
            />
            <h1></h1>
            <TextField name="outlined" label="Number of tickets" variant="outlined" style={{marginTop: "20px"}}
                       value={numOfTickets}
                       onChange={(e) => setNumOfTickets(e.target.value)}
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

export function GetTicketByIdAndProcessIt() {
    const [ticketId, setTicketId] = React.useState("");
    const [newPrice, setNewPrice] = React.useState("");
    const [newFlightId, setNewFlightId] = React.useState("");
    const [ticket, setTicket] = React.useState(null);
    const [showSelectButton, setShowSelectButton] = React.useState(false);
    const [showDeleteAndUpdateButtons, setShowDeleteAndUpdateButtons] = React.useState(false);
    const [showUpdateField, setShowUpdateField] = React.useState(false);
    const [errorMessage, setErrorMessage] = React.useState("");
    const [showErrorMessage, setShowErrorMessage] = React.useState(false);

    const handleFind = (name) => {
        console.log("Find ticket by id");
        setShowErrorMessage(false);
        /*
        fetch(("http://localhost:8080/api/v1/tickets/" + ticketId), {
            method: "GET"
        })*/
        fetch(`${API_URL}/api/v1/tickets/${ticketId}`, {
            method: "GET"
        })
            .then(response => {
                if (response.ok) {
                    console.log("Ticket get success");
                    return response.json();
                } else {
                    return response.json().then(errorResponse => {
                        throw new Error(errorResponse.error);
                    })
                }
            })
            .then(result => {
                setTicket(result);
                setShowSelectButton(true);
            })
            .catch(error => {
                console.error("Error finding ticket:", error);
                setTicket(null);
                setErrorMessage("Ticket not found")
                setShowErrorMessage(true);
            });
    };

    const handleUpdate = () => {
        setShowDeleteAndUpdateButtons(false);
        setShowUpdateField(true);
    };

    const handleDelete = (id) => {
        console.log("Delete ticket:", ticket);
        /*
        fetch(`http://localhost:8080/api/v1/tickets/delete_ticket/` + id, {
            method: "DELETE"
        })*/
        fetch(`${API_URL}/api/v1/tickets/delete_ticket/${id}`, {
            method: "DELETE"
        })
            .then(response => {
                if (response.ok) {
                    console.log("Ticket deleted successfully");
                } else {
                    return response.json().then(errorResponse => {
                        throw new Error(errorResponse.error);
                    })
                }
            })
            .catch(error => {
                console.error("Error deleting ticket:", error);
            });
        setShowDeleteAndUpdateButtons(false);
    };

    const update = (id, price, flightId) => {
        const updatedTicket = { id, price };
        console.log("Update ticket:", updatedTicket);
        /*
        fetch(`http://localhost:8080/api/v1/tickets/update_ticket/flight_id/` + flightId, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(updatedTicket)
        })*/
        fetch(`${API_URL}/api/v1/tickets/update_ticket/flight_id/${flightId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(updatedTicket)
        })
            .then(response => {
                if (response.ok) {
                    console.log("Ticket update success");
                } else {
                    if(response.status === 404) {
                        setErrorMessage("Flight not found");
                    } else {
                        setErrorMessage("All fields should be valid");
                    }
                    return response.json().then(errorResponse => {
                        throw new Error(errorResponse.error);
                    })
                }
            })
            .catch(error => {
                console.error("Error updating ticket:", error);
                setShowErrorMessage(true);
            });
        setShowUpdateField(false);
    }

    const handleSelect = () => {
        console.log("Ticket selected:", ticket);
        setShowDeleteAndUpdateButtons(true);
        setShowSelectButton(false);
    };

    return (
        <Paper elevation={3} style={paperStyle}>
            <h1 style={headerStyle}>Find ticket</h1>
            <TextField name="outlined" label="Ticket id" variant="outlined"
                       value={ticketId}
                       onChange={(e) => setTicketId(e.target.value)}
            />
            {showUpdateField && (
                <>
                    <h1></h1>
                    <TextField name="outlined" label="New price" variant="outlined" style={{marginTop: "20px"}}
                               value={newPrice}
                               onChange={(e) => setNewPrice(e.target.value)}
                    />
                    <h1></h1>
                    <TextField name="outlined" label="New flight id" variant="outlined" style={{marginTop: "20px"}}
                               value={newFlightId}
                               onChange={(e) => setNewFlightId(e.target.value)}
                    />
                    <h1></h1>
                    <Button variant="outlined" style={buttonStyle}
                            onClick={() => update(ticket.id, newPrice, newFlightId)}>
                        Save
                    </Button>
                </>
            )}
            {ticket && (
                <>
                    <Paper elevation={6} style={elementStyle}>
                        <div>Id: {ticket.id}</div>
                        <div>Price: {ticket.price}</div>
                        <div>Is reserved: {ticket.reserved ? 'Yes' : 'No'}</div>
                        <br/>
                        <div>Flight id: {ticket.flight.id}</div>
                        <div>Flight departure town: {ticket.flight.departureTown}</div>
                        <div>Flight arrival town: {ticket.flight.arrivalTown}</div>
                        <div>Flight departure date-time: {ticket.flight.departureDateTime}</div>
                        <div>Flight airline name: {ticket.flight.airlineName}</div>
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
                            <Button variant="outlined" style={buttonStyle} onClick={() => handleDelete(ticket.id)}>
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
            <Button variant="outlined" style={buttonStyle} onClick={() => handleFind(ticketId)}>
                FIND
            </Button>
        </Paper>

    );
}

export function BookTicket() {
    const [ticketId, setTicketId] = React.useState("");
    const [passengerId, setPassengerId] = React.useState("");
    const [errorMessage, setErrorMessage] = React.useState("");
    const [showErrorMessage, setShowErrorMessage] = React.useState(false);

    const handleBookButton = () => {
        console.log("Book ticket");
        setShowErrorMessage(false);
        /*
        fetch("http://localhost:8080/api/v1/reservations/booking/ticket_id/" + ticketId + "/passenger_id/" +
            passengerId, {
            method:"POST",
            headers:{"Content-Type":"application/json"},
        })
        */
        fetch(`${API_URL}/api/v1/reservations/booking/ticket_id/${ticketId}/passenger_id/${passengerId}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
        })
            .then(response => {
                if (response.ok) {
                    console.log("Ticket book success");
                } else {
                    return response.json().then(errorResponse => {
                        throw new Error(errorResponse.error);
                    })
                }
            })
            .catch(error => {
                console.log("Error book ticket", error);
                setErrorMessage("Ticket or passenger not found");
                setShowErrorMessage(true);
            });
    };

    return (
        <Paper elevation={3} style={paperStyle}>
            <h1 style={headerStyle}>Book ticket</h1>
            <h1></h1>
            <TextField name="outlined" label="Ticket id" variant="outlined" style={{marginTop: "20px"}}
                       value={ticketId}
                       onChange={(e) => setTicketId(e.target.value)}
            />
            <h1></h1>
            <TextField name="outlined" label="Passenger id" variant="outlined" style={{marginTop: "20px"}}
                       value={passengerId}
                       onChange={(e) => setPassengerId(e.target.value)}
            />
            <h1></h1>
            {showErrorMessage && (
                <h1 style={errorStyle}>{errorMessage}</h1>
            )}
            <h1></h1>
            <Button variant="outlined" style={buttonStyle} onClick={handleBookButton}>
                BOOK
            </Button>
        </Paper>
    )
}

export function CancelBookTicket() {
    const [ticketId, setTicketId] = React.useState("");
    const [errorMessage, setErrorMessage] = React.useState("");
    const [showErrorMessage, setShowErrorMessage] = React.useState(false);

    const handleCancelBookButton = () => {
        console.log("cancel Book ticket");
        setShowErrorMessage(false);
        /*
        fetch("http://localhost:8080/api/v1/reservations/cancel_booking/ticket_id/" + ticketId, {
            method:"DELETE",
        })*/
        fetch(`${API_URL}/api/v1/reservations/cancel_booking/ticket_id/${ticketId}`, {
            method: "DELETE"
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
    };

    return (
        <Paper elevation={3} style={paperStyle}>
            <h1 style={headerStyle}>Cancel booking</h1>
            <h1></h1>
            <TextField name="outlined" label="Ticket id" variant="outlined" style={{marginTop: "20px"}}
                       value={ticketId}
                       onChange={(e) => setTicketId(e.target.value)}
            />
            <h1></h1>
            {showErrorMessage && (
                <h1 style={errorStyle}>{errorMessage}</h1>
            )}
            <h1></h1>
            <Button variant="outlined" style={buttonStyle} onClick={handleCancelBookButton}>
                CANCEL
            </Button>
        </Paper>
    )
}

