Qelf
=====

## Setup
1. Install prerequisites (mongo 3.2.x, node 5.4.x, npm 3.5.x)

2. Install App
    git clone git@github.com:zhang/qelf.git
    cd qelf
    npm install && bower install && grunt init && cd server && npm install

## First Run

1. Add ionic platforms and serve the app
    ionic platform add ios
    ionic build ios
    ionic serve

2. Start the server
    npm start

##Dev Data

1. Run `node server/bin/initDev`
