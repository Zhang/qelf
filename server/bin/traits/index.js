'use strict';

const _ = require('lodash');
const traitTemplateModel = require('../../app/models/traitTemplate');
//Rename
const THEMES = {
  happiness: 'Traits that predict happiness (Kaufman @ UPenn)',
  likeability: 'Traits that make you likeable (Norman Anderson)',
  leadership: 'Traits measuring leadership potential (Cattell Leadership Potential Equation)',
  friend: 'Traits of a good friend (Roberts-Griffin @ UPenn)'
};

//Trait names must fit into the sentence: "I scored really high in ___TRAIT___"
//Comparisons are meant to:
//  1. Be interesting to answer
//  2. Together, fully encompass the given trait
//  3. Concise
//  4. Has to be easy to answer ('Who is more inspiring' vs 'Who inspires you to be a better person?')

const defaults = [
  {
    id: 'Kindness',
    comparisons: [
      'Who is a more kind person?',
      'Who do you enjoy spending time with more?',
      'Who is more concerned about others?'
    ],
    themes: [THEMES.likeability]
  },
  {
    id: 'Thoughtfulness',
    comparisons: [
      'Who is a more thoughtful person?',
      'Who is more likely to remember your birthday?',
      'Who is more concerned about your well being?' //Hmm
    ]
  },
  {
    id: 'Enthusiasm',
    comparisons: [
      'Who is a more enthusiastic person?',
      'Who is more energetic?'
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
      //'Who do you think ?'
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
      'Who is more confident in their own decisions?'
    ],
    themes: [THEMES.leadership]
  },
  {
    id: 'Positivity',
    comparisons: [
      'Who has a more positive attitude?',
      'Who is more likely to make the best out of a bad situation?'
    ]
  },
  {
    id: 'Dominance',
    comparisons: [
      'Who has a more dominant personality?',
      'Who is more business like?',
      'Who is more competitive?'
    ],
    themes: [THEMES.leadership]
  },
  {
    id: 'Love of :earning',
    comparisons: [
      'Who is a more curious person?',
      'Who is more likely to try out new things?',
      'Who likes to read more?'
    ],
    themes: [THEMES.happiness]
  },
  {
    id: 'Sincerity',
    comparisons: [
      'Who is a more sincere person?',
      'Who is less likely to talk about you behind your back?',
      'Who is more likely to tell you how they really feel rather than hold it in?' //HMMM
    ],
    themes: [THEMES.likeability]
  },
  {
    id: 'Honesty',
    comparisons: [
      'Who is a more honest person?',
      'Who is more likely to return excess change given to them by a cashier' //HMM
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
      'Who is more energetic'
    ],
    themes: [THEMES.happiness]
  },
  {
    id: 'Calmness',
    comparisons: [
      'Who is more calm?',
      'Who is more likely to keep their cool in a stressful situation?'
    ]
  },
  {
    id: 'Trustworthiness',
    comparisons: [
      'Who do you trust more?'
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
      'Who do you like more?'
    ],
    themes: [THEMES.likeability]
  },
  {
    id: 'Acceptance',
    comparisons: [
      'Who is more accepting of others?',
      'Who are you more comfortable being yourself around?',
    ]
  },
  {
    id: 'Fun',
    comparisons: [
      'Who is more fun to hang out with?',
      'Who is more fun?'
    ]
  },
  {
    id: 'Reliability',
    comparisons: [
      'Who is a more reliable person?',
      'Who keeps their promises more often?'
    ]
  },
  {
    id: 'Integrity',
    comparisons: [
      'Who is more true to their word?',
      'Who has a stronger moral compass?'
    ]
  },
  {
    id: 'Empathy',
    comparisons: [
      'Who is more able to see from your point of view?',
      'Who is more empathetic towards your point of view?',
      'Who is less likely to litter?', //Ehhhh
      'Who is more likely to give money to a homeless person?'
    ],
    themes: [THEMES.likeability, THEMES.leadership]
  },
  {
    id: 'Conscientiousness',
    comparisons: [
      'Who has a higher standard for themselves and their work?',
      'Who is more organized and neat?',
      'Who is more self disciplined?'
    ],
    themes: [THEMES.leadership]
  },
  {
    id: 'Determination',
    comparisons: [
      'Who is a more determined person?',
      'Who pushes themselves harder to succeed?'
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
  }
];

module.exports = {
  defaultTraits: defaults,
  addDefault: function* () {
    yield _.map(defaults, function(trait) {
      if (!trait.themes) {
        trait.themes = [];
      }
      return traitTemplateModel.addOrUpdate(trait);
    });
  }
};
