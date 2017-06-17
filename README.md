
## Elm, NodeJS (Koa) Full-Stack app

#### Demonstrates:
* Seriving, parsing, & consuming a JSON Api
* Testing (BE only currently; FE tests needed ..sort of.. it's Elm! )
* UI for handling slow data loads

#### To Run:
* need Node 7.6 +
* `yarn install` or `npm install`
* `cd client`
* `elm-make Main.elm --output static/elm.js`*
* `cd ..`
* `yarn start` or `npm start`
* visit `localhost:3501`
 
 Apologies for the extra compile step... wanted to keep it build system (Webpack, Brunch, etc) agnostic for flexibility.

* *if node complains about `elm-make` you may have to do `npm install -g elm` or `yarn add elm`*
