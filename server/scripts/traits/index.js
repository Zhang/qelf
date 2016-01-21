'use strict';

const _ = require('lodash');
const traitTemplateModel = require('../../app/models/traitTemplate');
//Rename
const THEMES = {
  happiness: 'Happiness (Kaufman @ UPenn)',
  likeability: 'Likability (Norman Anderson, APA)',
  leadership: 'Leadership potential (Cattell Leadership Potential Equation)',
  friend: 'Good Friend (Roberts-Griffin @ UPenn)'
};

//Trait names must fit into the sentence: "I scored really high in ___TRAIT___"
//Comparisons are meant to:
//  1. Be interesting to answer
//  2. Together, fully encompass the given trait
//  3. Concise
//  4. Has to be easy to answer ('Who is more inspiring' vs 'Who inspires you to be a better person?')
//  Measurable through 'things everyone does'

const defaults = [
  {
    id: 'Kindness',
    comparisons: [
      'Who is a more kind person?',
      'Who do you enjoy spending time with more?',
      'Who is more concerned about others?',
      'Who is more likely to volunteer their time?'
    ],
    themes: [THEMES.likeability]
  },
  {
    id: 'Thoughtfulness',
    comparisons: [
      'Who is a more thoughtful person?',
      'Who is more likely to remember your birthday?'
    ]
  },
  {
    id: 'Enthusiasm',
    comparisons: [
      'Who is a more enthusiastic person?',
      'Who is more energetic?',
      'Who is more likely to get you hyped about their ideas?',
      'Who do you feel more energetic around'
    ],
    themes: [THEMES.leadership]
  },
  {
    id: 'Intuitiveness',
    comparisons: [
      'Who has more intuition?',
      'Who is more likely to rely on their gut instinct?',
      'Who is more likely to focus on the big picture?'
    ],
    themes: [THEMES.leadership]
  },
  {
    id: 'Charisma',
    comparisons: [
      'Who is a more charismatic person?',
      'Who would you rather be president?',
      'Who would make a better manager?'
    ],
    themes: [THEMES.leadership]
  },
  {
    id: 'Emotional Stability',
    comparisons: [
      'Who is a more emotionally stable person?',
      'Who is more even-tempered?'
    ],
    themes: [THEMES.leadership]
  },
  {
    id: 'Self Assurance',
    comparisons: [
      'Who is more confident?',
      'Who is more confident in their own decisions?',
      'Who is better at saying no to what they don\'t want?',
      //'Who would rather ?'
    ],
    themes: [THEMES.leadership]
  },
  {
    id: 'Positivity',
    comparisons: [
      'Who has a more positive attitude?',
      'Who is more likely to make the best out of a bad situation?',
      'Who smiles more?',
      'Who is more likely to give out compliments?'
    ]
  },
  {
    id: 'Dominance',
    comparisons: [
      'Who has a more dominant personality?',
      'Who is more competitive?',
      'Who is likely to turn a competition into a game?'
    ],
    themes: [THEMES.leadership]
  },
  {
    id: 'Love of Learning',
    comparisons: [
      'Who is a more curious person?',
      'Who is more likely to try out new things?',
      'Who likes to read more?',
      'Who is more likely to step out of their comfort zone to learn something new?'
    ],
    themes: [THEMES.happiness]
  },
  {
    id: 'Sincerity',
    comparisons: [
      'Who is a more sincere person?',
      'Who is less likely to talk about you behind your back?',
      'Who is more likely to tell you how they really feel rather than hold it in?', //HMMM
    ],
    themes: [THEMES.likeability]
  },
  {
    id: 'Honesty',
    comparisons: [
      'Who is a more honest person?',
      'Who is less likely to pirate music?',
      'Who is more likely to return excess change given to them by a cashier', //HMM
      'Who is less likely to cheat on a test?'
    ],
    themes: [THEMES.likeability, THEMES.leadership, THEMES.friend]
  },
  {
    id: 'Loyalty',
    comparisons: [
      'Who is a more loyal friend?',
      'Who is more likely to give you an honest opinion, even if it might hurt your feelings?',
      'During tough times, who\'s more likely to be there to support you?'
    ],
    themes: [THEMES.likeability]
  },
  {
    id: 'Gratitude',
    comparisons: [
      'Who is more thankful for things in their life?',
      'Who shows their gratitude more often?',
      'Who shows more gratitude for the things you do?'
    ],
    themes: [THEMES.happiness]
  },
  {
    id: 'Happiness',
    comparisons: [
      'Who is a happier person?',
      'Who laughs more?',
      'Who is more energetic',
      'Who is more satisfied with their work?',
      'Who is more fulfilled with their hobbies?',
      'Who has a good sense of humor?'
    ],
    themes: [THEMES.happiness]
  },
  {
    id: 'Calmness',
    comparisons: [
      'Who is more calm?',
      'Who is more likely to keep their cool in a stressful situation?',
      'Who does the term \'cool as a cucumber\' apply to more?'
    ]
  },
  {
    id: 'Trustworthiness',
    comparisons: [
      'Who do you trust more?',
      'Who would you trust borrowing your car'
    ],
    themes: [THEMES.likeability, THEMES.leadership, THEMES.friend]
  },
  {
    id: 'Social Boldness',
    comparisons: [
      'Who is more likely to put themselves out there?',
      'Who is less offended by criticism'
    ],
    themes: [THEMES.leadership]
  },
  {
    id: 'Inspiration',
    comparisons: [
      'Who is more inspiring?'
    ]
  },
  {
    id: 'Patience',
    comparisons: [
      'Who is more patient?',
      'Who is less frantic?'
    ]
  },
  {
    id: 'Likeability',
    comparisons: [
      'Who do you like more?',
      'Who is liked by more people?'
    ],
    themes: [THEMES.likeability]
  },
  {
    id: 'Acceptance',
    comparisons: [
      'Who is more accepting of others?',
      'Who are you more comfortable being yourself around?',
      'Who do you feel more comfortable sharing your failures with?',
    ]
  },
  {
    id: 'Fun Loving',
    comparisons: [
      'Who is more fun to hang out with?',
      'Who likes travelling more?',
      'Who is more likely to forego chores over having fun?',
      'Who is more likely to look for fun things to do?',
      'Who is more likely to go to a rave?'
    ]
  },
  {
    id: 'Reliability', //As a friend, as a citizen
    comparisons: [
      'Who is a more reliable person?',
      'Who keeps their promises more often?',
      'Who is more on time?'
    ]
  },
  {
    id: 'Integrity',
    comparisons: [
      'Who is more true to their word?',
      'Who has a stronger moral compass?',
      'Morally, who would make a better cop?'
    ]
  },
  {
    id: 'Empathy',
    comparisons: [
      'Who is a more empathetic person?',
      'Who is more able to see from your point of view?',
      'Who is more likely to give money to a homeless person?',
      'Who is more likely to volunteer?'
    ],
    themes: [THEMES.likeability, THEMES.leadership]
  },
  {
    id: 'Conscientiousness',
    comparisons: [
      'Who has a higher standard for themselves and their work?',
      'Who is more organized and neat?',
      'Who is more self disciplined?',
      'Who is more meticulous?',
      'Who is more deliberate in their actions?',
      'Who uses their time more efficiently?'
    ],
    themes: [THEMES.leadership]
  },
  {
    id: 'Determination',
    comparisons: [
      'Who is a more determined person?',
      'Who pushes themselves harder to succeed?',
      'Who do you think has the mental determination to train for a marathon?',
      'Who is more likely to stick all the way through a 60 day workout program'
    ]
  },
  {
    id: 'Adaptability',
    comparisons: [
      'If time travelled to the 1800\'s, who do you think would adapt the most quickly?',
      'Who is a more receptive towards new experiences?',
      'Who is a more adaptable person?'
    ]
  },
  {
    id: 'Supportive',
    comparisons: [
      'Who is a more supportive friend?',
      'If you are sick, who is more likely to help you with your daily chores?',
      'Who do you feel more comfortable sharing your worries and fears with?',
      'Who is more likely to invite you to hang out?'
    ],
    themes: [THEMES.friend]
  },
  {
    id: 'Humorous',
    comparisons: [
      'Who is funnier?',
      'Who tells better jokes?',
      'Who would be a better prankster?',
      'Who tells funnier stories?',
      'Who is more likely to have been the class clown?'
    ]
  },
  {
    id: 'Creativity',
    comparisons: [
      'Who is more creative?',
      'Who is better at solving riddles?',
      'Who is more likely to be able to solve a rubix cube?',
      'Who is a better artist?',
      'Who are you more likely to have an original conversation with (less likely to talk about the weather, traffic, etc)?',
      'Who works for a more creative company?'
    ]
  }
];

module.exports = {
  defaultTraits: defaults,
  addDefault: function* () {
    yield traitTemplateModel.clear();
    yield _.map(defaults, function(trait) {
      if (!trait.themes) {
        trait.themes = [];
      }
      return traitTemplateModel.addOrUpdate(trait);
    });
  }
};
