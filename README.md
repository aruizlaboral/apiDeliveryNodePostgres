
# API node PostGres con Docker Compose

Docker-Compose
```bash
  docker-compose up -d
  docker-compose ps
  docker-compose top

  docker-compose start
  docker-compose top

  docker-compose down -v

```

## Crear sdk firebase
Descargar y guardar como: delivery-b9284-firebase

Modificar archivo firebase-config.js remplazar la linea storageBucket


```bash
  storageBucket: 'myAplicationDemo.appspot.com'
```

## link

[Firebase] (https://console.firebase.google.com/)


## Running Test

instalacion de dependencias

```bash
  rm -rf node_modules
  rm package-lock.json
  npm install
```
run tests, run the following command
```bash
  node server.js
```

