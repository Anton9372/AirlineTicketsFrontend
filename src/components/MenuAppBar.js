import * as React from 'react';
import Box from '@mui/material/Box';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { Link } from 'react-router-dom';
import {Button} from "@mui/material";

export default function MenuAppBar({ showHomeButton, title }) {
    const [anchorEl, setAnchorEl] = React.useState(null);

    const handleMenuClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const linkStyle = {
        textDecoration: 'none'
    }

    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="static">
                <Toolbar>
                    <IconButton
                        size="large"
                        edge="start"
                        color="inherit"
                        aria-label="menu"
                        sx={{ mr: 2 }}
                        onClick={handleMenuClick}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1, textAlign: 'center' }}>
                        {title}
                    </Typography>
                    {showHomeButton && (<Button color="inherit" component={Link} to="/"
                                                style={{ textTransform: 'none' }}>Home</Button>)}
                </Toolbar>
            </AppBar>
            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
            >
                {showHomeButton && (<MenuItem onClick={handleMenuClose}><Link to="/"
                                                                              style={linkStyle}>Home</Link></MenuItem>)}
                <MenuItem onClick={handleMenuClose}><Link to="/airlines" style={linkStyle}>Airlines</Link></MenuItem>
                <MenuItem onClick={handleMenuClose}><Link to="/flights" style={linkStyle}>Flights</Link></MenuItem>
                <MenuItem onClick={handleMenuClose}><Link to="/passengers"
                                                          style={linkStyle}>Passengers</Link></MenuItem>
                <MenuItem onClick={handleMenuClose}><Link to="/tickets" style={linkStyle}>Tickets</Link></MenuItem>
            </Menu>
        </Box>
    );
}
