const path = require("path");
const { app, BrowserWindow, Menu } = require("electron"); // Later we will  instantiate a new browser window

const isDev = process.env.NODE_ENV !== 'development';
const isMac = process.platform === 'darwin';
function createMainWindow() {
  // the first window of our app
  const mainWindow = new BrowserWindow({
    // here we are creating an instance
    title: "Image Resizer",
    width: isDev? 1000: 500,
    height: 600,
  });

  // Open dev tools if we're in dev enviroment
  if(isDev){
    mainWindow.webContents.openDevTools()
  }

  mainWindow.loadFile(path.join(__dirname, "./renderer/index.html")); //also we can load a website if we want to, in this case we'll load our frontend
}

function createAboutWindow(){
    // another window of our app
  const aboutWindow = new BrowserWindow({
    // here we are creating an instance
    title: "About Image Resizer",
    width: 300,
    height: 300,
  });

  aboutWindow.loadFile(path.join(__dirname, "./renderer/about.html")); 
}
// call the window when app is ready
app.whenReady().then(() => {
  createMainWindow();
  // Implement Menu
  const mainMenu = Menu.buildFromTemplate(menu);
  Menu.setApplicationMenu(mainMenu);
});

// Menu template
const menu = [
    ...(isMac ? [{
        label: app.name,
        submenu: [
            {
                label: 'About',
                click: createAboutWindow // don't put parentheses, it will fire off the window automatically
            }
        ]
    }] : []),
    {
        role: 'fileMenu', 
    },
    ...(!isMac ? [{
        label: 'Help',
        submenu: [{
            label: 'About',
            click: createAboutWindow
        }]
    }] : [])
];

app.on("window-all-closed", () => {
  // quit the app when windows will be closed
  if (process.platform !== "darwin") app.quit(); // darwin -> mac
});
