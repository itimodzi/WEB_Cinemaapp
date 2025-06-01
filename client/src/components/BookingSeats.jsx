import React from 'react';
import { makeStyles } from '@material-ui/styles';
import { Box, Typography } from '.'; // Material-UI

const useStyles = makeStyles((theme) => ({
  wrapper: {
    maxWidth: 960,
    margin: '0 auto',
    padding: theme.spacing(2),
  },
  screen: {
    margin: '0 auto 24px auto',
    padding: '8px 0',
    width: '100%',
    maxWidth: 700,
    backgroundColor: 'rgb(100,100,100)',
    borderRadius: 6,
    textAlign: 'center',
    fontWeight: 600,
    color: '#fff',
  },
  rowWrapper: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing(1),
  },
  rowNumber: {
    width: 28,
    textAlign: 'center',
    fontWeight: 500,
    marginRight: theme.spacing(1),
    color: '#ccc',
  },
  seat: {
    width: 36,
    height: 36,
    borderRadius: 4,
    color: '#fff',
    fontWeight: 500,
    fontSize: '0.85rem',
    lineHeight: '36px',
    textAlign: 'center',
    cursor: 'pointer',
    margin: theme.spacing(0.5),
    transition: 'all 0.2s ease-in-out',
    '&:hover': {
      transform: 'scale(1.05)',
      boxShadow: '0 0 5px rgba(255,255,255,0.3)',
    },
    [theme.breakpoints.down('sm')]: {
      width: 32,
      height: 32,
      fontSize: '0.75rem',
      lineHeight: '32px',
    },
  },
  legendContainer: {
    display: 'flex',
    justifyContent: 'center',
    gap: theme.spacing(3),
    marginTop: theme.spacing(4),
    flexWrap: 'wrap',
  },
  legendItem: {
    display: 'flex',
    alignItems: 'center',
    fontSize: '0.9rem',
    color: '#ccc',
  },
  legendLabel: {
    width: 16,
    height: 16,
    borderRadius: 3,
    marginRight: theme.spacing(1),
  },
  
}));

export default function BookingSeats({ seats, onSelectSeat }) {
  const classes = useStyles();

  return (
    <Box className={classes.wrapper}>
      <div className={classes.screen}>SCREEN</div>

      {seats.length > 0 &&
        seats.map((row, rowIndex) => (
          <div key={rowIndex} className={classes.rowWrapper}>
            <div className={classes.rowNumber}>{rowIndex + 1}</div>
            {row.map((seat, seatIndex) => {
              const bgColor =
                seat === 1
                  ? 'rgb(65, 66, 70)'
                  : seat === 2
                  ? 'rgb(56, 142, 60)'
                  : seat === 3
                  ? 'rgb(96, 93, 169)'
                  : 'rgb(211, 47, 47)';

              return (
                <Box
                  key={`seat-${seatIndex}`}
                  onClick={() => onSelectSeat(rowIndex, seatIndex)}
                  className={classes.seat}
                  style={{ backgroundColor: bgColor }}
                >
                  {seatIndex + 1}
                </Box>
              );
            })}
          </div>
        ))}

      <Box className={classes.legendContainer}>
        <div className={classes.legendItem}>
          <span
            className={classes.legendLabel}
            style={{ background: 'rgb(96, 93, 169)' }}
          />
          Free
        </div>
        <div className={classes.legendItem}>
          <span
            className={classes.legendLabel}
            style={{ background: 'rgb(65, 66, 70)' }}
          />
          Reserved
        </div>
        <div className={classes.legendItem}>
          <span
            className={classes.legendLabel}
            style={{ background: 'rgb(56, 142, 60)' }}
          />
          Selected
        </div>
        <div className={classes.legendItem}>
          <span
            className={classes.legendLabel}
            style={{ background: 'rgb(211, 47, 47)' }}
          />
          Blocked
        </div>
      </Box>
    </Box>
  );
}
