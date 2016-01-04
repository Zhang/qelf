'use strict';

const accountModel = require('../app/models/account');
const traitModel = require('../app/models/trait');
const completedVotesModel = require('../app/models/completedVotes');
const _ = require('lodash');
const traits = require('./traits');
const DEFAULT_TRAITS = _.map(traits.defaultTraits, function(trait) {
  return traitModel.newTrait(trait.id, trait.categories);
});
const users = ['mock_facebookId1', 'mock_facebookId2', 'mock_facebookId13', 'mock_facebookId4'];
const co = require('co');
function getAllExcept(user) {
  return _.filter(users, function(u) {
    return u !== user;
  });
}
const user1 = {
  facebookId: users[0],
  name: 'scott',
  accessToken: 'mock_accessToken1',
  friends: getAllExcept('mock_facebookId1'),
  profilePicture: 'https://scontent-sjc2-1.xx.fbcdn.net/hphotos-xtp1/v/t1.0-9/12108274_10101564644192315_7334749882900604967_n.jpg?oh=e0fee8c71ce074b2ba8180193ae610bb&oe=56E3A4FB'
};

const user2 = {
  facebookId: users[1],
  name: 'bob',
  accessToken: 'mock_accessToken2',
  friends: getAllExcept('mock_facebookId2'),
  profilePicture: 'https://scontent-sjc2-1.xx.fbcdn.net/hphotos-xfa1/v/t1.0-9/1622790_2249316349597_120305514_n.jpg?oh=54347afaf810a3c18b31d52ad752d647&oe=56D65332'
};

const user3 = {
  facebookId: users[2],
  name: 'joan',
  accessToken: 'mock_accessToken3',
  friends: getAllExcept('mock_facebookId3'),
  profilePicture: 'https://scontent-sjc2-1.xx.fbcdn.net/hphotos-xaf1/v/t1.0-9/11389991_10153380756994173_3936534420190887871_n.jpg?oh=7414a2a09cb545c3c07d2f361474af7d&oe=56D91526'
};

const user4 = {
  facebookId: users[3],
  name: 'alexs',
  accessToken: 'mock_accessToken4',
  friends: getAllExcept('mock_facebookId4'),
  profilePicture: 'https://scontent-sjc2-1.xx.fbcdn.net/hphotos-xtf1/v/t1.0-9/11222815_10101966010266737_978063582363883619_n.jpg?oh=1200337f37288c66fe78026ac4734257&oe=571A381D'
};

var mockUsers = [user1, user2, user3, user4];
function addAcct(acct) {
  co(function* () {
    try {
      yield traits.addDefault();
      const acctValues = yield [traitModel.addBulk(DEFAULT_TRAITS), completedVotesModel.createForAcct(acct.facebookId)];
      acct.traits = _.map(acctValues[0], 'id');
      yield* accountModel.add(acct);
    } catch (e) {
      console.error('error adding account', e);
    }
  });
}
for (var i = 0; i < mockUsers.length; i++) {
  try {
    addAcct(mockUsers[i]);
  } catch (err) {
    throw err;
  }
}
