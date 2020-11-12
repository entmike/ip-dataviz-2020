# dataviz-2020

## Run the Demo
Run the following command in a terminal window.  (Requires Docker to be installed)
```
docker run --rm -p 5000:5000 entmike/ip-dataviz-2020
```
Open http://localhost:5000 in a browser.

## Prerequisites

- [node](https://nodejs.org/en/) - at least v10.13 We recommend you have the latest LTS version installed.
- A text editor, (recommended VSCode)

## Initial Setup
From a commmand line, run the following:
```bash
# Pull this repo
git clone https://github.com/entmike/ip-dataviz-2020.git

cd ip-dataviz-2020

# install dependencies
npm install
```

## Run local
Serves with hot reload at localhost:3000

```
npm run dev
```

## Building in Docker

```
docker build -t yourdockerimage . 
```

## Run your Docker Build

```
docker run --rm -p 5000:5000 yourdockerimage
```