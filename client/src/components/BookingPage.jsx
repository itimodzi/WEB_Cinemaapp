import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { makeStyles } from '@material-ui/styles';
import { toast } from 'react-toastify';
import Moment from 'react-moment';

import GooglePayButton from '@google-pay/button-react';
import { Container, Grid, Typography, Button, BookingSeats, Footer } from '.';

const BookingPage = () => {
  const [email, setEmail] = useState('');
  const [userId, setUserId] = useState('');
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
    }
  };

  const [movie, setMovie] = useState('');
  const { id } = useParams();
  const getMovie = async () => {
    try {
      const res = await fetch(`http://localhost:5000/movies/${id}`, {
        method: 'GET',
        headers: { token: localStorage.token },
      });

      const parse = await res.json();
      setMovie(parse[0]);
    } catch (err) {
      console.error(err.message);
    }
  };

  const [hallScheme, setHallScheme] = useState('');
  const getHallSchemeData = async () => {
    try {
      const res = await fetch(`http://localhost:5000/booking/${id}`, {
        method: 'GET',
        headers: { token: localStorage.token },
      });

      const parse = await res.json();
      setHallScheme(parse[0]);
    } catch (err) {
      console.error(err.message);
    }
  };

  const [showtime, setShowtime] = useState('');
  const getShowtime = async () => {
    try {
      const res = await fetch(`http://localhost:5000/booking/showtimes/${id}`, {
        method: 'GET',
        headers: { token: localStorage.token },
      });

      const parse = await res.json();
      setShowtime(parse[0]);
    } catch (err) {
      console.error(err.message);
    }
  };

  const [seats, setSeats] = useState('');
  // eslint-disable-next-line no-unused-vars
  const [selectedSeats, setSelectedSeats] = useState('');
  const [newSeats, setNewSeats] = useState('');
  let bookedSeats = [];
  const getSeats = async () => {
    try {
      const res = await fetch(`http://localhost:5000/booking/${id}`, {
        method: 'GET',
        headers: { token: localStorage.token },
      });

      const parse = await res.json();
      setSeats(parse[0].seats);
      setNewSeats(parse[0].seats);
    } catch (err) {
      console.error(err.message);
    }
  };

  useEffect(() => {
    getEmail();
    getMovie();
    getHallSchemeData();
    getShowtime();
    getSeats();
  }, []);

  const updateHallScheme = async () => {
    try {
      for (let i = 0; i < newSeats.length; i += 1) {
        for (let j = 0; j < newSeats[i].length; j += 1) {
          if (newSeats[i][j] === 2) {
            newSeats[i][j] = 1;
            bookedSeats.push([i, j]);
          }
        }
      }
      const body = { newSeats };
      const myHeaders = new Headers();
      myHeaders.append('Content-Type', 'application/json');
      myHeaders.append('token', localStorage.token);

      await fetch(
        `http://localhost:5000/booking/hallschemes/${hallScheme.hallscheme_id}`,
        {
          method: 'PUT',
          headers: myHeaders,
          body: JSON.stringify(body),
        }
      );
    } catch (err) {
      console.error(err.message);
    }
  };

  const [count, setCount] = useState(0);
  const [total, setTotal] = useState(0);

  const checkCount = (row, seat) => {
    if (count < 5) {
      newSeats[row][seat] = 2;
      setCount(count + 1);
      setTotal(showtime.ticket_price * (count + 1));
    } else {
      alert('You cannot select more than five seats.');
    }
  };

  function onSelectSeat(row, seat) {
    if (newSeats !== undefined) {
      if (seats[row][seat] === 1) {
        newSeats[row][seat] = 1;
      } else if (seats[row][seat] === 2) {
        setCount(count - 1);
        setTotal(showtime.ticket_price * (count - 1));
        newSeats[row][seat] = 3;
      } else if (seats[row][seat] === 3) {
        checkCount(row, seat);
      } else {
        newSeats[row][seat] = 4;
      }
    }
    console.log(count);
  }

  const createReservation = async () => {
    try {
      const myHeaders = new Headers();

      myHeaders.append('Content-Type', 'application/json');
      myHeaders.append('token', localStorage.token);
      const shId = showtime.showtime_id;
      const selectedDate = showtime.show_date;
      const body = { shId, bookedSeats, selectedDate, total };

      await fetch(`http://localhost:5000/reservations/${userId} `, {
        method: 'POST',
        headers: myHeaders,
        body: JSON.stringify(body),
      });
      toast.success('<Tickets are issued>!', {
        position: 'bottom-right',
        autoClose: 1500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    } catch (err) {
      console.error(err.message);
    }
  };

  function delay(URL) {
    setTimeout(function () {
      window.location = URL;
    }, 1900);
  }

  function onConfirmBook() {
    updateHallScheme();
    createReservation();
    delay('/');
  }
  const useStyles = makeStyles((theme) => ({
    blurBackground: {
      backgroundImage: `linear-gradient(to right, rgba(0,0,0,.7) 10%, rgba(0,0,0,.7) 10%),url(${movie.back_image_url})`,
      position: 'absolute',
      top: 0,
      zIndex: -1,
      right: 0,
      height: '120vh',
      filter: 'blur(0px)',
      backgroundPosition: 'center',
      backgroundSize: 'cover',
      backgroundRepeat: 'no-repeat',
      width: '105vw',
    },
    centerBlock: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      textAlign: 'center',
      marginTop: theme.spacing(4),
    },

    container: {
      background: 'transparant',
      transform: 'translate(0%, 0%)',
      color: theme.palette.common.white,
    },
    form: {
      padding: theme.spacing(4, 0, 0, 0),
    },
    bannerTitle: {
      fontSize: theme.spacing(1.4),
      textTransform: 'uppercase',
      color: theme.palette.common.white,
      marginBottom: theme.spacing(1),
    },
    bannerContent: {
      fontSize: theme.spacing(2),
      color: theme.palette.common.white,
    },
    [theme.breakpoints.down('sm')]: {
      hideOnSmall: {
        display: 'none',
      },
    },
    checkout: {
      padding: theme.spacing(4, 0, 0, 0),
      color: theme.palette.common.white,
    },
    textfield: {
      color: theme.palette.common.white,
      textAlign: 'center',
    },
    gPaybutton: { display: 'none' },
  }));

  const classes = useStyles();
  return (
    <>
      <Container className={classes.container} maxWidth="lg">
        <Grid container spacing={3}>
          <Grid item xs={12} md={12}>
            <Grid className={classes.form} container spacing={3}>
              <Grid item>
                <Button
                      style={{ display: 'flex',
                        maxHeight: '40px',
                        minHeight: '40px',
                        maxWidth: '100px',
                        minWidth: '40px'
                      }}
                      variant="contained"
                      href={`/movies/${id}`}
                    >
                      Cancel
                    </Button>
              </Grid>
              <Grid item xs className={classes.hideOnSmall}>
                <Typography variant="h5" className={classes.textfield}>
                  {`${hallScheme.hall_name}`}
                </Typography>
              </Grid>
              <Grid item xs>
                <Typography variant="h5" className={classes.textfield}>
                  <Moment format="DD/MM/YYYY" date={showtime.show_date} />
                </Typography>
              </Grid>
              <Grid item xs>
                <Typography variant="h5" className={classes.textfield}>
                  {showtime.start_at}
                </Typography>
              </Grid>
            </Grid>

            <BookingSeats
              seats={seats}
              onSelectSeat={(indexRow, index) => onSelectSeat(indexRow, index)}
            />

            <Grid
              container
              spacing={3}
              className={classes.centerBlock}
              style={{ justifyContent: 'space-evenly' }}
            >
            </Grid>
          </Grid>
        </Grid>
      </Container>
      
      
      <Container className={classes.centerBlock}>
        <GooglePayButton
          style={{ display: 'center' }}
          environment="TEST"
          existingPaymentMethodRequired="false"
          buttonColor="black"
          buttonType="plain"
          paymentRequest={{
            apiVersion: 2,
            apiVersionMinor: 0,
            allowedPaymentMethods: [
              {
                type: 'CARD',
                parameters: {
                  allowedAuthMethods: [
                    'PAN_ONLY',
                    'CRYPTOGRAM_3DS',
                  ],
                  allowedCardNetworks: ['MASTERCARD', 'VISA'],
                },
                tokenizationSpecification: {
                  type: 'PAYMENT_GATEWAY',
                  parameters: {
                    gateway: 'example',
                    gatewayMerchantId: 'exampleGatewayMerchantId',
                  },
                },
              },
            ],
            merchantInfo: {
              merchantId: '12345678901234567890',
              merchantName: `tickets for the movie ${movie.movie_title}`,
            },
            transactionInfo: {
              totalPriceStatus: 'FINAL',
              totalPriceLabel: 'Total',
              totalPrice: `${total}`,
              currencyCode: 'UAH',
              countryCode: 'US',
            },
            shippingAddressRequired: true,
            callbackIntents: [
              'SHIPPING_ADDRESS',
              'PAYMENT_AUTHORIZATION',
            ],
          }}
          onLoadPaymentData={(paymentRequest) => {
            console.log('Success', paymentRequest);
            onConfirmBook();
          }}
          onPaymentAuthorized={(paymentData) => {
            console.log('Payment Authorised Success', paymentData);
            return { transactionState: 'SUCCESS' };
          }}
          onPaymentDataChanged={(paymentData) => {
            console.log('On Payment Data Changed', paymentData);
            return {};
          }}
          onError={(e) => {
            alert('Payment failed!');
            console.log('Payment failed!', e.message);
          }}
        />
      </Container>
      <div className={classes.blurBackground} />
    </>
    
  );
};

export default BookingPage;
