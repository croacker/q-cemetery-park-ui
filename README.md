# Cemetery park UI (q-cemetery-park-ui)

Cemetery park UI(Quasar)

## Install the dependencies
```bash
npm install
```

### Start the app in development mode (hot-code reloading, error reporting, etc.)
```bash
quasar dev
```

### Lint the files
```bash
npm run lint
```

### Build the app for production
```bash
quasar build
```

### Customize the configuration
See [Configuring quasar.conf.js](https://quasar.dev/quasar-cli/quasar-conf-js).

### Run in Heroky
1. ```heroku login```
2. ```heroku container:login```
3. ```docker push registry.heroku.com/cemetery-park-ui/web```
4. ```heroku container:release web --app=cemetery-park-ui```
5. open ```https://cemetery-park-ui.herokuapp.com/```
