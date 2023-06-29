# Notes of Electron JS

productName -> title of our project on the search menu deppending on the OS

index.js -> main.js -> main process, entry point of our app

## Dependencies

```node js
npm i electron resize-img toastify-js
```

- main.js -> backend, dealing with database, business logic
- renderer -> frontend

```JSON
"scripts": {
    "start": "electron ."
  }
```
The code above allow us to run main.js file as a node js process.

main.js -> main window

``` shell
npx electronmon .
```
the command above allow us to refresh our changes without restart the Electron application. The dot indicates that it's calling the main process which means: main.js file

## Electron Security Warning (Insecure Content-Security-Policy)

To fix that we add a metatag on our html file
```HTML
<meta http-equiv="Content-Security-Policy" content="script-src 'self'" />
```


## Preload js
Electron's main process is a Node.js environment that has full operating system access. On top of Electron modules, you can also access Node.js built-ins, as well as any packages installed via npm. On the other hand, renderer processes run web pages and do not run Node.js by default for security reasons.

To bridge Electron's different process types together, we will need to use a special script called a preload.

## Electron js - Packaging and distributing our app
There are two methods:
- Distribute unpackaged files
- Distribute packaged (.asar files) -> more secure -> Tools: electron builder, electron packager 

https://github.com/electron/electron/releases

## Inno Setup
https://jrsoftware.org/isdl.php
