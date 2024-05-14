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
    margin: '20px 400px',
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
    borderRadius: '5px'
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

export function Tickets() {
    const [tickets, setTickets] = React.useState([]);
    const [departureTown, setDepartureTown] = React.useState("");
    const [arrivalTown, setArrivalTown] = React.useState("");
    const [passengerId, setPassengerId] = React.useState("");
    const [newTicketPrice, setNewTicketPrice] = React.useState("");

    const [findUnreserved, setFindUnreserved] = React.useState(false);
    const [errorMessage, setErrorMessage] = React.useState("");
    const [showErrorMessage, setShowErrorMessage] = React.useState(false);
    const [selectedTicket, setSelectedTicket] = React.useState(null);
    const [showBookingDialog, setShowBookingDialog] = React.useState(false);
    const [showEditDialog, setShowEditDialog] = React.useState(false);

    const handleFindTicketsButton = () => {
        let path = "";
        if (departureTown.trim() !== "" && arrivalTown.trim() !== "") {
            if (findUnreserved) {
                path = `${API_URL}/api/v1/tickets/unreserved/departure_town/${departureTown}/arrival_town/${arrivalTown}`;
            } else {
                path = `${API_URL}/api/v1/tickets/departure_town/${departureTown}/arrival_town/${arrivalTown}`;
            }
        } else if (departureTown.trim() !== "") {
            if (findUnreserved) {
                path = `${API_URL}/api/v1/tickets/unreserved/departure_town/${departureTown}`;
            } else {
                path = `${API_URL}/api/v1/tickets/departure_town/${departureTown}`;
            }
        } else if (arrivalTown.trim() !== "") {
            if (findUnreserved) {
                path = `${API_URL}/api/v1/tickets/unreserved/arrival_town/${arrivalTown}`;
            } else {
                path = `${API_URL}/api/v1/tickets/arrival_town/${arrivalTown}`;
            }
        } else {
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
                result.sort((a, b) => new Date(a.flight.departureDateTime) - new Date(b.flight.departureDateTime));
                setTickets(result);
            })
            .catch(error => {
                console.error("Error finding tickets:", error);
            });
    };

    const handleUnreservedButton = () => {
        setFindUnreserved(!findUnreserved);
    }

    const handleOpenBookDialog = (ticket) => {
        setSelectedTicket(ticket);
        setShowBookingDialog(true);
    }

    const handleOpenEditDialog = (ticket) => {
        setSelectedTicket(ticket);
        setShowEditDialog(true);
    }

    const handleCloseBookDialog = () => {
        setSelectedTicket(null);
        setShowBookingDialog(false);
        setShowErrorMessage(false);
    }

    const handleCloseEditDialog = () => {
        setSelectedTicket(null);
        setShowEditDialog(false);
        setShowErrorMessage(false);
    }

    const handleBookTicketButton = (ticketId, passengerId) => {
        console.log("Book ticket. ticketId: " + ticketId + "passengerId: " + passengerId);
        setShowErrorMessage(false);

        fetch(`${API_URL}/api/v1/reservations/booking/ticket_id/${ticketId}/passenger_id/${passengerId}`, {
            method: "POST",
            headers: {"Content-Type": "application/json"},
        })
            .then(response => {
                if (response.ok) {
                    console.log("Ticket book success");
                    setShowBookingDialog(false);
                } else {
                    if (response.status === 404) {
                        setErrorMessage("Passenger not found");
                    } else if (response.status === 400) {
                        setErrorMessage("Ticket was already reserved");
                    } else {
                        setErrorMessage("Invalid identificator");
                    }
                    return response.json().then(errorResponse => {
                        throw new Error(errorResponse.error);
                    })
                }
            })
            .catch(error => {
                console.error("Error book ticket", error);
                setShowErrorMessage(true);
            });
    }

    const handleDeleteTicketButton = (ticketId) => {
        setShowErrorMessage(false);
        console.log("Delete ticket. ticketId: ", ticketId);
        fetch(`${API_URL}/api/v1/tickets/delete_ticket/${ticketId}`, {
            method: "DELETE"
        })
            .then(response => {
                if (response.ok) {
                    console.log("Ticket deleted successfully");
                    setShowEditDialog(false);
                } else {
                    return response.json().then(errorResponse => {
                        throw new Error(errorResponse.error);
                    })
                }
            })
            .catch(error => {
                console.error("Error deleting ticket:", error);
            });
    };

    const handleUpdateTicketButton = (id, price, flightId) => {
        setShowErrorMessage(false);
        const updatedTicket = {id, price};
        console.log("Update ticket:", updatedTicket);
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
                    setShowEditDialog(false);
                } else {
                    if (response.status === 404) {
                        setErrorMessage("Flight not found");
                    } else {
                        setErrorMessage("Price is not valid");
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
    }

    const bookingDialog = selectedTicket !== null && showBookingDialog && (
        <>
            <div style={backdropStyle}></div>
            <div style={popUpWindowStyle}>
                <h2>Enter your identification number</h2>
                <TextField name="outlined" label="Passenger's id" variant="outlined"
                           value={passengerId}
                           onChange={(e) => setPassengerId(e.target.value)}
                />
                {showErrorMessage && (
                    <h2 style={errorStyle}>{errorMessage}</h2>
                )}
                <h2>
                    <Button variant="contained" style={buttonStyle}
                            onClick={() => handleBookTicketButton(selectedTicket.id, passengerId)}>
                        CONFIRM
                    </Button>
                    <Button variant="outlined" style={buttonStyle} onClick={handleCloseBookDialog}>
                        CANCEL
                    </Button>
                </h2>
            </div>
        </>
    );

    const editDialog = selectedTicket !== null && showEditDialog && (
        <>
            <div style={backdropStyle}></div>
            <div style={popUpWindowStyle}>
                <h2>Edit Ticket</h2>
                <TextField name="outlined" label="New price" variant="outlined"
                           value={newTicketPrice}
                           onChange={(e) => setNewTicketPrice(e.target.value)}
                />
                {showErrorMessage && (
                    <h2 style={errorStyle}>{errorMessage}</h2>
                )}
                <h2>
                    <Button variant="contained" style={buttonStyle}
                            onClick={() => handleDeleteTicketButton(selectedTicket.id)}>
                        DELETE
                    </Button>
                    <Button variant="contained" style={buttonStyle} onClick={() =>
                        handleUpdateTicketButton(selectedTicket.id, newTicketPrice, selectedTicket.flight.id)}>
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
            <h1 style={headerStyle}>Find tickets</h1>
            <h1>
                <Button variant="outlined" style={buttonStyle} onClick={handleUnreservedButton}>
                    {findUnreserved ? "Find unreserved" : "Find all"}
                </Button>
                <TextField name="outlined" label="Departure town" variant="outlined"
                           value={departureTown}
                           onChange={(e) => setDepartureTown(e.target.value)}
                />
                <TextField name="outlined" label="Arrival town" variant="outlined"
                           style={{marginLeft: '20px', marginRight: '100px'}}
                           value={arrivalTown}
                           onChange={(e) => setArrivalTown(e.target.value)}
                />
                <Button variant="contained" style={buttonStyle} onClick={handleFindTicketsButton}>
                    Find tickets
                </Button>
            </h1>

            {showErrorMessage && (
                <h1 style={{marginLeft: '500px', marginRight: '500px', ...errorStyle}}>{errorMessage}</h1>
            )}

            {bookingDialog}
            {editDialog}

            {tickets.map(ticket => (
                <div key={ticket.id}>
                    <Paper elevation={6} style={elementStyle}>

                        <div style={{width: '70%', ...contentStyle}}>
                            <div style={{color: 'green', marginBottom: '15px', fontSize: '20px'}}>
                                {ticket.price} USD
                            </div>
                            <div style={{marginBottom: '10px', fontSize: '20px'}}>
                                {ticket.flight.departureTown} - {ticket.flight.arrivalTown}</div>
                            <div style={{marginBottom: '5px', fontSize: '16px'}}>
                                {formatDate(ticket.flight.departureDateTime)}</div>
                            <div style={{fontSize: '15px'}}>
                                {ticket.flight.airlineName}</div>
                        </div>

                        <div style={{width: '30%'}}>
                            <Button variant="outlined" color="primary" style={{marginTop: '30px'}}
                                    onClick={() => handleOpenEditDialog(ticket)}>
                                Edit
                            </Button>
                            <h1>
                                {ticket.reserved ? (
                                    <div style={{color: 'red', marginTop: '15px', fontSize: '20px', fontWeight: '500'}}>
                                        RESERVED
                                    </div>
                                ) : (
                                    <Button variant="contained" color="primary"
                                            onClick={() => handleOpenBookDialog(ticket)}>
                                        Book
                                    </Button>
                                )}
                            </h1>
                        </div>

                    </Paper>
                </div>
            ))}
        </Paper>
    )
}
