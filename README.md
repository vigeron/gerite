# Gerite Task Manager

Multilanguage client-server task manager similar to Trello.

* english (default)
* polish

You can select language in client/env file.
 
Written in TypeScript VUE + NestJS.

![Gerite lists](https://github.com/vigeron/gerite/blob/master/screen1.png)
![Gerite lists](https://github.com/vigeron/gerite/blob/master/screen2.png)

### Backend build with
 * NodeJS
 * NestJS framework
 * MongoDB
 * JWT Authorization

### Fontend build with
 * Vue
 * Vuex
 * Vuetify

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

Run remote server
Set up .env config file

```
// remote address
VUE_APP_API_URL=http://localhost:3000

// select language en or pl
VUE_APP_I18N_LOCALE=en

// select fallback language en or pl
VUE_APP_I18N_FALLBACK_LOCALE=en
```
### TODO:
- [x] add function to change name board
- [x] add function to change name list
- [x] change select color method in create board
- [ ] archives/deleted boards
- [ ] select language on site
- [ ] add edit user profile
- [ ] add action logs panel
- [ ] add comments to cards
- [ ] add more method login (GitHub, FB...)
- [ ] create public/private board
- [ ] change REST to WebSocket

### License
This application is licensed under [GPL-3.0](https://github.com/vigeron/gerite/LICENSE). More information can be [found here](https://www.gnu.org/licenses/gpl-3.0.en.html).











