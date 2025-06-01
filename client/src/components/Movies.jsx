import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Carousel from 'react-material-ui-carousel';
import { textTruncate } from '../utils/utils';
import {
  CssBaseline,
  Card,
  CardMedia,
  CardActionArea,
  CardContent,
  Typography,
  Link,
} from '.';

const useStyles = makeStyles((theme) => ({
  card: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    borderRadius: '15px !important',
  },
  cardMedia: {
    paddingTop: '43%',
    backgroundRepeat: 'no-repeat',
    borderRadius: '15px !important',
    color: theme.palette.common.white,
  },
  cardContent: {
    flexGrow: 1,
    background: 'linear-gradient(to top, #000, rgba(0,0,0,0))',
    borderRadius: '0 0 15px 15px !important',
  },
  action: {
    borderRadius: '15px !important',
  },
  movies: {
  margin: '5vh auto',
  width: '90vw',
  [theme.breakpoints.down('sm')]: {
    width: '100vw',
  },
},
  safety: { margin: '5vh auto', width: '80vw' },
}));

const Movies = () => {
  const [data, setData] = useState('');

  const getData = async () => {
    try {
      const res = await fetch('http://localhost:5000/movies', {
        method: 'GET',
        headers: { token: localStorage.token },
      });

      const parseData = await res.json();
      setData(parseData);
      console.log(parseData);
    } catch (err) {
      console.error(err.message);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  const classes = useStyles();

  return (
    <>
      <CssBaseline />
      <div className={classes.movies}>
        <Carousel
          className={classes.carousel}
          animation="fade"
          interval={10500}
        >
          {data.length !== 0 &&
            data[0].movie_id !== null &&
            data.map((movies) => (
              <Link
                href={`movies/${movies.movie_id}`}
                style={{ textDecoration: 'none' }}
              >
                <Card className={classes.card}>
                  <CardActionArea className={classes.action}>
                    <CardMedia
                      className={classes.cardMedia}
                      image={movies.image_url}
                      title={movies.movie_title}
                    >
                      <CardContent className={classes.cardContent}>
                        <Typography gutterBottom variant="h3" component="h1">
                          {movies.movie_title}
                        </Typography>
                        <Typography variant="body1" component="p">
                          {textTruncate(movies.movie_description, 300)}
                        </Typography>
                      </CardContent>
                    </CardMedia>
                  </CardActionArea>
                </Card>
              </Link>
            ))}
        </Carousel>
      </div>
      <div className={classes.safety}>
        <h1>SAFE CINEMA</h1>
        <Typography variant="body1" component="p">
          It is important to us that you feel comfortable. Therefore, the cinema staff daily observes federal standards for the safety of guests.
        </Typography>
        <br />
        <Typography variant="body1" component="p">
          We recommend purchasing tickets on the website. Such tickets are easy to exchange and return if necessary. We accept contactless payments.
        </Typography>
        <br />
        <Typography variant="body1" component="p">
          During an alarm, please do not panic and follow the instructions, as there is a shelter in our cinema.
        </Typography>
        <br />
      </div>
    </>
  );
};

export default Movies;
