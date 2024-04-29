import * as React from 'react';
import MenuAppBar from "../components/MenuAppBar";
import {FindAllPassengers,
    AddPassenger,
    FindAllPassengerReservations,
    GetPassengerByIdAndProcessIt} from "../components/controller/PassengerController";

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
export function PassengerPage () {
    return(
        <div className='App'>
            <MenuAppBar showHomeButton={true} title="Passengers"/>
            <div style={{display: 'flex', width: '100%'}}>
                <div style={leftComponentStyle}>
                    <FindAllPassengers />
                    <FindAllPassengerReservations />
                </div>
                <div style={rightComponentStyle}>
                    <AddPassenger />
                    <GetPassengerByIdAndProcessIt />
                </div>
            </div>
        </div>
    );
}