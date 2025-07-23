import * as React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import CardActionArea from '@mui/material/CardActionArea';

import {Link} from 'react-router-dom'

const cards = [
  {
    title: 'Orders',
    description: 'Lists all the orders undertaken',
    redirectTo: '/orders'
  },
  {
    title: 'Inventory',
    description: 'Lists all the inventories purchased',
    redirectTo: '/inventory'
  }
];

function SelectActionCard() {
  const [selectedCard, setSelectedCard] = React.useState(0);
  return (
    <Box sx={{ width: '100%', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(200px, 100%), 1fr))', gap: 2,}}>
        {cards.map((card, index) => (
            <Card>
                    <Link to={card.redirectTo}>
                        <CardActionArea key={card.title}
                        onClick={() => setSelectedCard(index)}
                        data-active={selectedCard === index ? '' : undefined}
                        sx={{
                        height: '100%',
                        '&[data-active]': {
                            backgroundColor: 'action.selected',
                            '&:hover': {
                            backgroundColor: 'action.selectedHover',
                            },
                        },
                        }}>
                    

                        <CardContent sx={{ height: '100%' }}>
                            <Typography variant="h5" component="div">
                                {card.title}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                {card.description}
                            </Typography>
                        </CardContent>
                    </CardActionArea>
                </Link>
            </Card>
        ))
      }
    </Box>
  );
}

export default SelectActionCard;