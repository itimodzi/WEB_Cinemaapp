import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Typography, Link, Container } from '.';

const useStyles = makeStyles((theme) => ({
  footer: {
    background: 'transparant',
    padding: theme.spacing(2, 0, 0, 0),
    margin: 'initial',
    bottom: 0,
  },
}));

export default function Footer() {
  const classes = useStyles();
  return (
    <footer className={classes.footer}>
      <Container maxWidth="lg">
        <Typography variant="body2" color="textSecondary" align="center">
          {' '}
          <Link href="/" color="inherit">
            CINEMA APP
          </Link>
          {`  `}
          {`© `}
          {new Date().getFullYear()}
          {` `}
        </Typography>
      </Container>
    </footer>
  );
}
