# Gerite Task Manager

Multilanguage client-server task manager similar to Trello.

* english (default)
* polish

You can select language in client/env file.
 
Written in TypeScript VUE + NestJS.

![Gerite lists](https://github.com/vigeron/gerite/blob/master/screen1.png)
![Gerite login](https://github.com/vigeron/gerite/blob/master/screen2.png)

### Backend build with
 * NodeJS
 * NestJS framework
 * MongoDB
 * JWT Authorization

### Fontend build with
 * Vue

## Installing

Get repository 
```
git clone https://github.com/vigeron/gerite.git
```

### Installing server

Enter to server folder
```
cd ./server
```

Install depedency
```
npm install
```

Run local server localhost:3000

You can change default configuration in common/constants.ts file
```
npm run start
```

### Installing client

Enter to client folder
```
cd ./client
```

Installing depedency
```
npm install
```

Run local server localhost:8080
```
npm run serve
```

### TODO:
- change REST to WebSocket
- add edit user profile
- select language on site
- change select color method in create board
- add function to change name board
- add function to change name list
- add action logs panel
- add comments to cards
- add more method login (GitHub, FB...)
- create public/private board

### License
This application is licensed under [GPL-3.0](https://github.com/vigeron/gerite/LICENSE). More information can be [found here](https://www.gnu.org/licenses/gpl-3.0.en.html).










