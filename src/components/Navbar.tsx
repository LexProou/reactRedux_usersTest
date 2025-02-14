import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Avatar from '@mui/material/Avatar';
import FavoriteIcon from '@mui/icons-material/FavoriteBorder';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import Box from '@mui/material/Box';

import '../index.scss'

const Navbar = () => {
  return (
    <AppBar position="static" className='navbar'>
      <Toolbar>
        <Typography variant="h6" component="div" className='logo'>
          <img src="./src/assets/at-work.svg" alt="logo" />
        </Typography>
        <Box className='icon-buttons'>
          <IconButton>
            <FavoriteIcon />
          </IconButton>
          <IconButton>
            <NotificationsNoneIcon />
          </IconButton>
          <Avatar alt="User Avatar" src="./src/assets/avatar.jpg" />
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;