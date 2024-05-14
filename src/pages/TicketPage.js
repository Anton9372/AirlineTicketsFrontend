import * as React from 'react';
import MenuAppBar from "../components/MenuAppBar";
import {Tickets} from "../components/controller/TicketController";

const defaultComponentStyle = {
    paddingLeft:'50px',
    paddingRight:'50px'
}

export function TicketPage () {
    return(
        <div className='App'>
            <MenuAppBar showHomeButton={true} title="Tickets"/>
            <div style={defaultComponentStyle}>
                <Tickets />
            </div>
        </div>
    );
}