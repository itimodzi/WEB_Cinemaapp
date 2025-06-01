import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import {
  CssBaseline,
  Toolbar,
  AppBar,
  Typography,
  Link,
  Button,
  Box,
  useMediaQuery,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
} from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';

const useStyles = makeStyles((theme) => ({
  appbarWrapper: {
    width: '100%',
    maxWidth: '1200px',
    margin: '0 auto',
    background: 'none !important',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },
  appbarTitle: {
    flexGrow: 1,
    color: theme.palette.primary.light,
    fontWeight: 'bold',
    textDecoration: 'none',
  },
  menu: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(3),
    [theme.breakpoints.down('sm')]: {
      display: 'none',
    },
  },
  drawerMenu: {
    width: 250,
  },
  menuItem: {
    color: theme.palette.text.primary,
    textDecoration: 'none',
    '&:hover': {
      color: theme.palette.primary.main,
    },
  },
  mobileMenuButton: {
    [theme.breakpoints.up('md')]: {
      display: 'none',
    },
  },
}));

const Header = (props) => {
  const classes = useStyles();
  const { userId, logout } = props;
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const isMobile = useMediaQuery((theme) => theme.breakpoints.down('sm'));

  const toggleDrawer = () => {
    setMobileOpen(!mobileOpen);
  };

  const drawerContent = (
    <div className={classes.drawerMenu}>
      <List>
        <ListItem button component="a" href="/">
          <ListItemText primary="Home" />
        </ListItem>
        <ListItem button component="a" href={`/dashboard/myTickets/${userId}`}>
          <ListItemText primary="Tickets" />
        </ListItem>
        <ListItem button onClick={(e) => logout(e)}>
          <ListItemText primary="Leave :(" />
        </ListItem>
      </List>
    </div>
  );

  return (
    <>
      <CssBaseline />
      <AppBar position="sticky" color="inherit">
        <Toolbar className={classes.appbarWrapper}>
          <Typography variant="h5" className={classes.appbarTitle}>
            <Link href="/" color="inherit" underline="none">
              CINEMA
            </Link>
          </Typography>

          <Box className={classes.menu}>
            <Link href="/" className={classes.menuItem}>
              <Typography variant="h6">Home</Typography>
            </Link>
            <Link
              href={`/dashboard/myTickets/${userId}`}
              className={classes.menuItem}
            >
              <Typography variant="h6">Tickets</Typography>
            </Link>
            <Button
              variant="contained"
              color="primary"
              onClick={(e) => logout(e)}
              style={{
                maxWidth: '100px',
                minWidth: '100px',
                borderRadius: 20,
              }}
            >
              <Typography variant="body1">Leave :(</Typography>
            </Button>
          </Box>

          {/* Mobile Menu Icon */}
          <IconButton
            edge="end"
            color="inherit"
            onClick={toggleDrawer}
            className={classes.mobileMenuButton}
          >
            <MenuIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* Drawer for mobile */}
      <Drawer anchor="right" open={mobileOpen} onClose={toggleDrawer}>
        {drawerContent}
      </Drawer>
    </>
  );
};

export default Header;

Header.propTypes = {
  userId: PropTypes.string.isRequired,
  logout: PropTypes.func.isRequired,
};
