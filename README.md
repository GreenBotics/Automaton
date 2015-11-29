## Automaton

[![GitHub version](https://badge.fury.io/gh/GreenBotics%2FAutomaton.svg)](https://badge.fury.io/gh/GreenBotics%2FAutomaton)

> garden (and home) automaton etc


## Whas is this ?

  A simple client & server system for environement monitoring (sensors etc) , meant to "just work"


## Usage

          npm start 


  Then go to http://localhost:3001/index.html


## Development

  continuous rebuild mode (simplest, the one you usually want): this will rebuild
  the client & server builds as you change the code (no live reload for the client for now)

          npm run start-dev

  you can also manually rebuild things:

    client 

          npm run build-client

    server 

          npm run build-server


  please also check out the [package.json](https://github.com/GreenBotics/Automaton/blob/master/package.json)
  file for more useful scripts


## Tech 

  "Mostly" writen in a functional (functional reactive) way (I always was very OOP oriented so quality may vary)

  A few notable libs in use

  - [Cycle.js](http://cycle.js.org/) on both client and server as a sort of "app basis"
  - [tingodb.js](http://www.tingodb.com/) for storage 
  - browserify and various transforms to package things nicely for the client side 
  - socket.io , etc etc 



## Authors


Reza 'zer0s'
Mark 'kaosat-dev' Moissette


## LICENSE

[The AGLP License (AGPL)](https://github.com/GreenBotics/Automaton/blob/master/LICENSE)

- - -

[![experimental](http://badges.github.io/stability-badges/dist/experimental.svg)](http://github.com/badges/stability-badges)
[![Build Status](https://travis-ci.org/GreenBotics/Automaton.svg)](https://travis-ci.org/GreenBotics/Automaton)
[![Dependency Status](https://david-dm.org/GreenBotics/Automaton.svg)](https://david-dm.org/GreenBotics/Automaton)
[![devDependency Status](https://david-dm.org/GreenBotics/Automaton/dev-status.svg)](https://david-dm.org/GreenBotics/Automaton#info=devDependencies)