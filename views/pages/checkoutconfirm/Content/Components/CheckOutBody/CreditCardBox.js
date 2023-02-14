import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { CardActionArea, CardContent, CardMedia, Typography, Card } from '@material-ui/core';

const useStyles = makeStyles({
  cardContainer: {
    backgroundImage: ' url("/images/EmptyCreditCard.png")',
    minWidth: "245px",
    backgroundSize:"cover",
    height: "162px",
    border: "1px solid #2D2866",
  }
});

const CreditCardItem = ({ cardInfo, selectCard }) => {
  const classes = useStyles();

  return (
    <Card className={classes.root}>
      <CardActionArea className={classes.cardContainer} onClick={() => selectCard(cardInfo)} >
        <CardContent>
          <Typography gutterBottom variant="h5" component="h2">
            **** **** **** {cardInfo.extra1}
          </Typography>
          <Typography variant="body2" color="textSecondary" component="p">
            {cardInfo.extra0}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}

export default function CreditCardBox({ paymentData, selectCard }) {
  return (
    paymentData.map(card => <CreditCardItem cardInfo={card} key={card.id} selectCard={selectCard} />)
  )
}