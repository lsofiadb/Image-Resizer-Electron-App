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
                label: 'About'
            }
        ]
    }] : []),
    {
        role: 'fileMenu', 
    },
    ...(!isMac ? [{
        label: 'Help',
        submenu: [{
            label: 'About'
        }]
    }] : [])
];

app.on("window-all-closed", () => {
  // quit the app when windows will be closed
  if (process.platform !== "darwin") app.quit(); // darwin -> mac
});
