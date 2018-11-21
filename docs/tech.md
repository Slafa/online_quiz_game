### Technologies used

##### Backend
* The backend is build with node.js and express to serve and take care of the rest api, and the use of
some middleware like [passport](https://www.npmjs.com/package/passport) with [passport-local](https://www.npmjs.com/package/passport-local)
to take care of authentication with [bcrypt-nodejs](https://www.npmjs.com/package/bcrypt-nodejs)
to hash the password before saving it.
 
* The server sign up/login happens via REST calls to the api, and there is also an added security
check for creating
a web socket by fetching a random generated token from the server which can only be obtained
while being logged in and returning it when opening the web socket.  
 
* Currently all data is stored in memory as a map, but should be fairly easy to replace with a real database.


* All game logic is handled by using [socket.io](https://www.npmjs.com/package/socket.io) to communicate
between the server and clients

##### Frontend
* The frontend is created using [React](https://reactjs.org/) with js and jsx.

* Some minor styling using bootstrap (planing to look into [semantic ui](https://semantic-ui.com/))

* The site is a single page application. Meaning that the whole page is getting fetched on connection
and all changed is manipulated in the browser.

* The html file is built using [webpack](https://www.npmjs.com/package/webpack) to bundle
 everything into one file and [Babel](https://www.npmjs.com/package/Babel) to translate languages
 that the browser cant understand to html and javascript.