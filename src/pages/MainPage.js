import * as React from 'react';
import MenuAppBar from "../components/MenuAppBar";
import {Button, Paper} from "@mui/material";
import { Link } from 'react-router-dom';

const leftComponentStyle = {
    width: '50%',
    paddingLeft:'50px',
    paddingRight:'15px'
}

const rightComponentStyle = {
    width: '50%',
    paddingLeft:'15px',
    paddingRight:'50px'
}

const paperStyle = {
    padding: "5px 0px",
    width: "100%",
    marginTop: "30px",
    backgroundColor: "inherit",
};

const headerStyle = {
    marginBottom: "20px",
    marginTop: "20px"
}

const buttonStyle = {
    margin: "20px"
}

export function AirlinePage () {
    return(
        <Paper elevation={3} style={paperStyle}>
            <h1 style={headerStyle}>Airlines</h1>
            <Link to="/airlines" style={{ textDecoration: 'none' }}>
                <Button variant="outlined" style={buttonStyle}>
                    Check
                </Button>
            </Link>
        </Paper>
    )
}

export function FlightPage () {
    return(
        <Paper elevation={3} style={paperStyle}>
            <h1 style={headerStyle}>Flights</h1>
            <Link to="/flights" style={{ textDecoration: 'none' }}>
                <Button variant="outlined" style={buttonStyle}>
                    Go
                </Button>
            </Link>
        </Paper>
    )
}

export function PassengerPage () {
    return(
        <Paper elevation={3} style={paperStyle}>
            <h1 style={headerStyle}>Passengers</h1>
            <Link to="/passengers" style={{ textDecoration: 'none' }}>
                <Button variant="outlined" style={buttonStyle}>
                    Explore
                </Button>
            </Link>
        </Paper>
    )
}

export function TicketPage () {
    return(
        <Paper elevation={3} style={paperStyle}>
            <h1 style={headerStyle}>Tickets</h1>
            <Link to="/tickets" style={{ textDecoration: 'none' }}>
                <Button variant="outlined" style={buttonStyle}>
                    Book now
                </Button>
            </Link>
        </Paper>
    )
}

export function MainPage () {
    return(
        <div className='App'>
            <MenuAppBar showHomeButton={false} title="Airline Tickets"/>
            <div className='main-content'>
                <h1>Welcome to Airline Tickets Service!</h1>
                <p>Explore our flights and book your tickets now!</p>
            </div>
            <div style={{display: 'flex', width: '100%'}}>
                <div style={leftComponentStyle}>
                    <FlightPage />
                    <AirlinePage />
                </div>
                <div style={rightComponentStyle}>
                    <TicketPage />
                    <PassengerPage />
                </div>
            </div>
        </div>
    );
}