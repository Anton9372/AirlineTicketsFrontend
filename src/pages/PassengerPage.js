import * as React from 'react';
import MenuAppBar from "../components/MenuAppBar";
import {Passengers} from "../components/controller/PassengerController";

const defaultComponentStyle = {
    paddingLeft: '50px',
    paddingRight: '50px'
}

export function PassengerPage () {
    return(
        <div className='App'>
            <MenuAppBar showHomeButton={true} title="Passengers"/>
            <div style={defaultComponentStyle}>
                <Passengers/>
            </div>
        </div>
    );
}