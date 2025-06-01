import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import {
  Typography,
  Container,
  Box,
  Button,
  Grid,
  useMediaQuery,
  useTheme,
} from '@material-ui/core';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import ConfirmationNumberIcon from '@material-ui/icons/ConfirmationNumber';

const useStyles = makeStyles((theme) => ({
  backImg: {
    backgroundImage: (props) =>
      `linear-gradient(to right, rgba(0,0,0,.8) 40%, rgba(0,0,0,0.6) 100%), url(${props.image})`,
    position: 'absolute',
    top: 0,
    left: 0,
    height: '100vh',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    width: '100vw',
    zIndex: -1,
  },
  container: {
    paddingTop: theme.spacing(15),
    paddingBottom: theme.spacing(5),
    color: theme.palette.common.white,
    [theme.breakpoints.down('sm')]: {
      paddingLeft: theme.spacing(2),
      paddingRight: theme.spacing(2),
    },
    [theme.breakpoints.up('md')]: {
      paddingLeft: theme.spacing(10),
      paddingRight: theme.spacing(10),
      maxWidth: '1100px',
    },
  },
  genre: {
    padding: theme.spacing(0.5, 3),
    marginRight: theme.spacing(1.5),
    marginBottom: theme.spacing(1),
    border: '2px solid',
    borderColor: theme.palette.primary.light,
    borderRadius: 20,
    display: 'inline-block',
    fontWeight: 500,
  },
  leftColumn: {
    [theme.breakpoints.up('md')]: {
      paddingRight: theme.spacing(6),
    },
  },
  description: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
    lineHeight: 1.7,
    maxWidth: '800px',
  },
  director: {
    color: theme.palette.primary.light,
    fontWeight: 600,
    marginTop: theme.spacing(2),
  },
  btn: {
    color: theme.palette.common.white,
    border: '2px solid',
    borderColor: theme.palette.primary.light,
    borderRadius: 20,
    padding: theme.spacing(0.7, 4),
    marginRight: theme.spacing(2),
    marginTop: theme.spacing(3),
  },
}));

const Movie = () => {
  const [selectedMovie, setSelectedMovie] = useState({});
  const [genre, setGenre] = useState([]);
  const { id } = useParams();

  const getMovie = async () => {
    try {
      const res = await fetch(`http://localhost:5000/movies/${id}`, {
        method: 'GET',
        headers: { token: localStorage.token },
      });
      const parse = await res.json();
      setSelectedMovie(parse[0]);
      setGenre(parse[0].movie_genre);
    } catch (err) {
      console.error(err.message);
    }
  };

  useEffect(() => {
    getMovie();
  }, []);

  const classes = useStyles({ image: selectedMovie.image_url });
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <>
      <div className={classes.backImg} />
      <Container className={classes.container}>
        <Grid container spacing={4}>
          <Grid item xs={12} md={8} className={classes.leftColumn}>
            <Box mb={2}>
              {genre.map((g, idx) => (
                <Typography
                  key={idx}
                  variant="body2"
                  className={classes.genre}
                >
                  {g}
                </Typography>
              ))}
            </Box>

            <Typography variant={isMobile ? 'h4' : 'h2'} gutterBottom>
              {selectedMovie.movie_title}
            </Typography>

            <Typography className={classes.description} variant="body1">
              {selectedMovie.movie_description}
            </Typography>

            <Typography className={classes.director} variant="h6" gutterBottom>
              Director: {selectedMovie.movie_director}
            </Typography>

            <Typography variant="body2" gutterBottom>
              Duration: {selectedMovie.movie_duration} min.
            </Typography>

            <Box mt={2}>
              <Button
                className={classes.btn}
                variant="outlined"
                href="/dashboard"
                startIcon={<ArrowBackIcon />}
              >
                Back
              </Button>
              <Button
                className={classes.btn}
                variant="outlined"
                href={`/booking/${id}`}
                startIcon={<ConfirmationNumberIcon />}
              >
                Buy Tickets
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </>
  );
};

export default Movie;
