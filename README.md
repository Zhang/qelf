Qelf
=====

## Setup
1. Install prerequisites (mongo 3.0.x, node 0.12.x, npm 2.x.x)

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
    cd server && node bin/server
