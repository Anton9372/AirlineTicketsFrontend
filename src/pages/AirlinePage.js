import * as React from 'react';
import MenuAppBar from "../components/MenuAppBar";
import {Airlines} from '../components/controller/AirlineController';

const defaultComponentStyle = {
    paddingLeft: '50px',
    paddingRight: '50px'
}

export function AirlinePage() {
    return(
        <div className='App'>
            <MenuAppBar showHomeButton={true} title="Airlines"/>
            <div style={defaultComponentStyle}>
                <Airlines/>
            </div>
        </div>

    );
}
