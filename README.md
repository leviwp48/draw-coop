<h1 align="center">Drawsome</h1>
<p align="center">Drawsome is a coop drawing experience with a nodeJS backend and reactJS frontend that leverages socket.io and HTML5 canvas to allow you and your friends to draw anything you'd like together.</p>

## Examples
### Sign in and Drawing
![alt text](media/drawing.gif "drawing")

### Drawing Together
![alt text](media/draw-together.gif "draw-together")

### Chatting 
![alt text](media/chatting.gif "chatting")

(Currently Disabled)
**You can find the app at: drawcoop.io**

## 🛠 Set-up and running
Install the dependencies for both the backend and frontend

`npm run install`

Start the development server and client

`npm run start`

## Features
### Accounts
- The site offers account registration and log in features
- User data is saved in a MongoDB backend.

### Boards
- "Boards" is the name for HTML canvas objects that the user can interact with to draw. 
- Boards are stored with their drawing data in MongoDB

### Drawing 
- Drawing is synced between users with Socket.io 
- There are 6 color options
- The save button saves the state of the board
- The back button returns to the board list and saves the state of the board 

## Meta
Created by: Levi Pole

Built with:  ReactJS (frontend), NodeJS (backend), CSS, and a MongoDB database

## Feedback
If you have any feedback or suggestions, feel free to send them to my email that you can find on the bottom right of the website :) (leviwp48@gmail.com)

## Contributing

1. Fork it (<https://github.com/leviwp48/draw-coop/fork>)
2. Create your feature branch (`git checkout -b feature/fooBar`)
3. Commit your changes (`git commit -am 'Add some fooBar'`)
4. Push to the branch (`git push origin feature/fooBar`)
5. Create a new Pull Request

