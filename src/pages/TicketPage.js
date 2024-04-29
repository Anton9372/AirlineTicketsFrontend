import * as React from 'react';
import MenuAppBar from "../components/MenuAppBar";
import {FindTickets,
    AddTickets,
    GetTicketByIdAndProcessIt,
    CancelBookTicket,
    BookTicket} from "../components/controller/TicketController";

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

export function TicketPage () {
    return(
        <div className='App'>
            <MenuAppBar showHomeButton={true} title="Tickets"/>
            <div style={{display: 'flex', width: '100%'}}>
                <div style={leftComponentStyle}>
                    <BookTicket />
                    <CancelBookTicket />
                </div>
                <div style={centerComponentStyle}>
                    <FindTickets/>
                </div>
                <div style={rightComponentStyle}>
                    <AddTickets />
                    <GetTicketByIdAndProcessIt />
                </div>
            </div>
        </div>
    );
}