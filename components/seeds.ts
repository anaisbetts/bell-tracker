export const seeds = [
  {
    "description": "Getting dressed by yourself",
    "value": 1,
    "isSpend": false
  },
  {
    "description": "Asking nicely for something",
    "value": 1,
    "isSpend": false
  },
  {
    "description": "Doing a chore (10min)",
    "value": 5,
    "isSpend": false
  },
  {
    "description": "Eating food without complaining",
    "value": 3,
    "isSpend": false
  },
  {
    "description": "Device time over without a fight",
    "value": 1,
    "isSpend": false
  },
  {
    "description": "Listening to a grownup",
    "value": 1,
    "isSpend": false
  },
  {
    "description": "Doing Schoolwork / music practice",
    "value": 5,
    "isSpend": false
  },
  {
    "description": "Using your words with Julian",
    "value": 5,
    "isSpend": false
  },
  {
    "description": "Asking for quiet time when feeling upset",
    "value": 10,
    "isSpend": false
  },
  {
    "description": "Taking a shower",
    "value": 2,
    "isSpend": false
  },
  {
    "description": "Brushing hair",
    "value": 1,
    "isSpend": false
  },
  {
    "description": "Do something independent",
    "value": 3,
    "isSpend": false
  },
  {
    "description": "Behaving on a Zoom call with an adult *alone*",
    "value": 3,
    "isSpend": false
  },
  {
    "description": "Being gentle with Maya",
    "value": 3,
    "isSpend": false
  },
  {
    "description": "15 minutes of device time",
    "value": 5,
    "isSpend": "TRUE"
  },
  {
    "description": "30 minutes of device time with A Friend",
    "value": 5,
    "isSpend": "TRUE"
  },
  {
    "description": "Dinner requests",
    "value": 10,
    "isSpend": "TRUE"
  },
  {
    "description": "Movie night",
    "value": 10,
    "isSpend": "TRUE"
  },
  {
    "description": "New My City game + 15 minutes of device time",
    "value": 50,
    "isSpend": "TRUE"
  },
  {
    "description": "throwing things",
    "value": -10,
    "isSpend": false
  },
  {
    "description": "not listening to an adult",
    "value": -1,
    "isSpend": false
  },
  {
    "description": "calling people names/saying shut-up",
    "value": -5,
    "isSpend": false
  },
  {
    "description": "hitting",
    "value": -10,
    "isSpend": false
  },
  {
    "description": "Non-angry yelling",
    "value": -1,
    "isSpend": false
  },
  {
    "description": "misbehaving in a zoom call with an adult",
    "value": -5,
    "isSpend": false
  },
  {
    "description": "slamming doors",
    "value": -3,
    "isSpend": false
  },
  {
    "description": "drawing on walls/ furniture/ things that aren't paper",
    "value": -2,
    "isSpend": false
  },
  {
    "description": "pointing a fake gun at people",
    "value": -1,
    "isSpend": false
  },
  {
    "description": "being mean to Julian",
    "value": -3,
    "isSpend": false
  }
];

export const earningBells = seeds.filter(x => x.value > 0);
export const losingBells = seeds.filter(x => x.value < 0 && !x.isSpend);
export const spendingBells = seeds.filter(x => x.isSpend);