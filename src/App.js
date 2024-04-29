import './App.css';
import {
    BrowserRouter,
    Routes,
    Route,
} from 'react-router-dom';
import {AirlinePage} from "./pages/AirlinePage";
import {FlightPage} from "./pages/FlightPage";
import {MainPage} from "./pages/MainPage";
import {PassengerPage} from "./pages/PassengerPage";
import {TicketPage} from "./pages/TicketPage";

export default function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<MainPage />}/>
                <Route path="airlines" element={<AirlinePage />}/>
                <Route path="flights" element={<FlightPage />}/>
                <Route path="passengers" element={<PassengerPage />}/>
                <Route path="tickets" element={<TicketPage />}/>
            </Routes>
        </BrowserRouter>
    );
}

