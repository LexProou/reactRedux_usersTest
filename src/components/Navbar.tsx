import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Avatar from '@mui/material/Avatar';
import FavoriteIcon from '@mui/icons-material/FavoriteBorder';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import Box from '@mui/material/Box';

import avatar from '../assets/img/avatar.png'
import logo from '../assets/img/logo.svg'
import '../index.scss'

const Navbar = () => {
  return (
    <AppBar position="static" className='navbar'>
      <Toolbar>
        <Typography variant="h6" component="div" className='logo'>
          <img src={logo} alt="logo" />
        </Typography>
        <Box className='icon-buttons'>
          <IconButton>
            <FavoriteIcon />
          </IconButton>
          <IconButton>
            <NotificationsNoneIcon />
          </IconButton>
          <Avatar alt="User Avatar" src={avatar} />
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;