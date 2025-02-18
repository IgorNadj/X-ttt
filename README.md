Changes summary:
1. Split board into a presentation component (no react 16 so couldn't do functional, didn't want to upgrade react)
1. Split game logic out into a separate class

The idea was to do something a bit more fun like a "play again" feature against the same opponent with a win counter, but this kind of splitting out was necessary as a first step to get my head around the codebase, and I do enjoy practicing clean code so it was interesting to me.



Notes:
- Build error on node 20, had to downgrade to 18
- Npm install second time in react_ws_src fails. Use --force to get around issue.










# A simple example of a full multiplayer game web app built with React.js and Node.js stack

Major libraries used on front end:
- react
- webpack
- babel
- react-router
- ampersand
- sass
- jest

Major libraries used on server:
- node.js
- socket.io
- express

### Folder structure:
- **WS** - server side and compiled front end
- **react_ws_src** - React development source and testing

---

### View it online at 
https://x-ttt.herokuapp.com/

#### Configurable with external XML file - 
https://x-ttt.herokuapp.com/ws_conf.xml

---

##For demonstration purposes only.
