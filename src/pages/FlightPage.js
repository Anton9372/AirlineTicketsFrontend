import * as React from 'react';
import MenuAppBar from "../components/MenuAppBar";
import {FindFlights,
    AddFlight,
    FindAllFlightPassengers,
    FindAllFlightTickets,
    GetFlightByIdAndProcessIt} from "../components/controller/FlightController";

const leftComponentStyle = {
    width: '30%',
    paddingLeft:'50px',
    paddingRight:'15px'
}

const centerComponentStyle = {
    width: '40%',
    paddingLeft:'15px',
    paddingRight:'15px'
}

const rightComponentStyle = {
    width: '30%',
    paddingLeft:'15px',
    paddingRight:'50px'
}

export function FlightPage () {
    return(
        <div className='App'>
            <MenuAppBar showHomeButton={true} title="Flights"/>
            <div style={{display: 'flex', width: '100%'}}>
                <div style={leftComponentStyle}>
                    <FindAllFlightPassengers />
                    <FindAllFlightTickets />
                </div>
                <div style={centerComponentStyle}>
                    <FindFlights />
                </div>
                <div style={rightComponentStyle}>
                    <AddFlight />
                    <GetFlightByIdAndProcessIt />
                </div>
            </div>
        </div>
    );
}