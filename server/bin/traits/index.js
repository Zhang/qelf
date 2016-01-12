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
    id: 'Kindness', //Ethical, pleasant, and concerned about others (Wikipedia)
    comparisons: [
      'Who is a more kind person?',
      'Who is a more ethical person?',
      'Who is more pleasant to spend time around?',
      'Who is more concerned about the well being of others?'
    ]
  },
  {
    id: 'Thoughtfulness',
    comparisons: [
      'Who is a more thoughtful person?',
      'Who is more likely to remember your birthday?',
      'Who is more concerned about your well being?'
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
      'Who is a more intuitive person?',
      'Who is more likely to rely on their gut instinct?'
    ],
    themes: [THEMES.leadership]
  },
  {
    id: 'Charisma',
    comparisons: [
      'Who is a more charismatic person?',
      'Who do you think ?'
    ],
    themes: [THEMES.leadership]
  },
  {
    id: 'Emotional Stability',
    comparisons: [
      'Who is a more emotionally stable person?',
      'Who is more even-tempered (who is less likely to have mood swings)?'
    ],
    themes: [THEMES.leadership]
  },
  {
    id: 'Self Assurance',
    comparisons: [
      'Who is a more confident person?',
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
      'Who has a more dominant personality?'
    ],
    themes: [THEMES.leadership]
  },
  {
    id: 'Loving to Learn',
    comparisons: [
      //'Who is more curiouslikely to value new opinions over ?',
      'Who looks for new things to learn?'
    ],
    themes: [THEMES.happiness]
  },
  {
    id: 'Sincerity',
    comparisons: [
      'Who is a more sincere person?',
      'Who is less likely to talk about you behind your back?',
      'Who is more likely to tell you how they really feel rather than hold it in?'
    ],
    themes: [THEMES.likeability]
  },
  {
    id: 'Honesty',
    comparisons: [
      'Who is a more honest person?',
      'Who is more likely to return excess change given to them by a cashier',
      'Who will'
    ],
    themes: [THEMES.likeability, THEMES.leadership]
  },
  {
    id: 'Loyalty',
    comparisons: [
      'Who is a more loyal friend?',
      'Who can you turn to during hard times?'
    ],
    themes: [THEMES.likeability]
  },
  {
    id: 'Gratitude',
    comparisons: [
      'Who shows their gratitude most frequently',
      ''
    ],
    themes: [THEMES.happiness]
  },
  {
    id: 'Happiness',
    comparisons: [
      'Who is a happier person?'
    ],
    themes: [THEMES.happiness]
  },
  {
    id: 'Calmness',
    comparisons: [
      'Who is a calmer person?',
      'Who is more likely to keep their cool in a stressful situation?'
    ]
  },
  {
    id: 'Trustworthiness',
    comparisons: [
      'Who do you trust more?'
    ],
    themes: [THEMES.likeability, THEMES.leadership]
  },
  {
    id: 'Social Boldness',
    comparisons: [
      'Who is less effected by shame or rejection in social situations?',
      'Who is less offended by criticism'
    ],
    themes: [THEMES.leadership]
  },
  {
    id: 'Inspiration',
    comparisons: [
      'Who is more inspiring?',
      'Who'
    ]
  },
  {
    id: 'Patience',
    comparisons: [
      'Who is more patient?',
      'Who is less likely to have road rage?'
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
      'Who do you think is more fun to hang out with?',
      'Who is more fun?'
    ]
  },
  {
    id: 'Reliability',
    comparisons: [
      'Who is a more reliable person?',
      'Who is more likely to keep their promises?'
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
      'Who would be more likely to understand your point of view?',
      'Who is more empathetic towards your point of view?'
    ],
    themes: [THEMES.likeability, THEMES.leadership]
  },
  {
    id: 'Conscientiousness',
    comparisons: [
      'Who has a higher standard for themselves and their work?',
      'Who is more organized and neat rather than disordered and messy?',
      'Who is more self disciplined?'
    ],
    themes: [THEMES.leadership]
  },
  {
    id: 'Determination',
    comparisons: [
      'Who is a more determined person',
      'Who pushes themselves harder to succeed?'
    ]
  },
  {
    id: 'Adaptability',
    comparisons: [
      'If time travelled to the 1800\'s, who do you think would adapt the most quickly?',
      'If woken up in a foreign country, who would be most likely to make it home unscathed?'
    ]
  },
  {
    id: 'Supportive',
    comparisons: [
      'Who is a more supportive friend?',
      'Who are you more likely to turn to during hard times?'
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
