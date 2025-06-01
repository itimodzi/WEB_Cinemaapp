import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
  CssBaseline,
  Footer,
  Container,
  Typography,
  Grid,
  Table,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
  TableContainer,
  Header,
} from '.';

const useStyles = makeStyles((theme) => ({
  table: {
    padding: theme.spacing(0, 0, 4, 0),
  },
  tableRow: {
    height: '64px',
  },
  tableCell: {
    whiteSpace: 'nowrap',
  },
  tableCellInner: {
    display: 'flex',
    alignItems: 'center',
  },
  title: {
    fontSize: '3rem',
    textAlign: 'center',
    padding: theme.spacing(10, 0, 2, 0),
  },
  [theme.breakpoints.down('sm')]: {
    fullWidth: { width: '100%' },
  },
}));

const MyTickets = () => {
  const classes = useStyles();

  const [email, setEmail] = useState('');
  const [userId, setUserId] = useState('');
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);

  const getEmail = async () => {
    try {
      const res = await fetch('http://localhost:5000/dashboard/', {
        method: 'GET',
        headers: { token: localStorage.token },
      });

      const parseData = await res.json();
      setEmail(parseData.user_email);
      setUserId(parseData.user_id);
    } catch (err) {
      console.error(err.message);
      setLoading(false);
    }
  };

  const getReservations = async () => {
    if (!userId) return;
    
    try {
      const res = await fetch(
        `http://localhost:5000/reservations/user/${userId}`,
        {
          method: 'GET',
          headers: { token: localStorage.token },
        }
      );

      const parseData = await res.json();
      setReservations(parseData);
      setLoading(false);
    } catch (err) {
      console.error(err.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    getEmail();
  }, []);

  useEffect(() => {
    if (userId) {
      getReservations();
    }
  }, [userId]);

  return (
    <>
      <CssBaseline />
      <Header />
      <Container maxWidth="lg">
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Typography className={classes.title} variant="h2" color="inherit">
              Your tickets
              
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <TableContainer
              component={Container}
              maxWidth="lg"
              className={classes.table}
            >
              <Table className={classes.table} aria-label="customized table">
                <TableHead>
                  <TableRow>
                    <TableCell align="left">Name</TableCell>
                    <TableCell align="left">Date</TableCell>
                    <TableCell align="left">Start time</TableCell>
                    <TableCell align="left">Tickets</TableCell>
                    <TableCell align="left">Ticket price</TableCell>
                    <TableCell align="left">Total</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={6} align="center">
                        Loading...
                      </TableCell>
                    </TableRow>
                  ) : reservations.length > 0 ? (
                    reservations.map((reservation) => (
                      <TableRow key={reservation.reservation_id} className={classes.tableRow} hover>
                        <TableCell className={classes.tableCell}>
                          {reservation.movie_title}
                        </TableCell>
                        <TableCell className={classes.tableCell}>
                          {new Date(reservation.rsd).toLocaleDateString()}
                        </TableCell>
                        <TableCell className={classes.tableCell}>
                          {reservation.start_at}
                        </TableCell>
                        <TableCell className={classes.tableCell}>
                          {reservation.booked_seats.map(
                            (item) => `row:${item[0] + 1} seat: ${item[1] + 1}; `
                          )}
                        </TableCell>
                        <TableCell className={classes.tableCell}>
                          {reservation.ticket_price}
                        </TableCell>
                        <TableCell className={classes.tableCell}>
                          {reservation.total}
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} align="center">
                        No tickets.... 
                        Only you can fix this error ;)
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
        </Grid>
      </Container>
     <Footer />
    </>
  );
};

export default MyTickets;
