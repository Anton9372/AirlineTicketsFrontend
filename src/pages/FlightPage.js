import * as React from 'react';
import MenuAppBar from "../components/MenuAppBar";
import {Flights} from "../components/controller/FlightController";

const defaultComponentStyle = {
    paddingLeft:'50px',
    paddingRight:'50px'
}

export function FlightPage () {
    return(
        <div className='App'>
            <MenuAppBar showHomeButton={true} title="Flights"/>
            <div style={defaultComponentStyle}>
                <Flights/>
            </div>
        </div>
    );
}