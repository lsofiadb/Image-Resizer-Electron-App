const path = require("path");
const os = require("os")
const fs = require("fs")
const resizeImg = require("resize-img")
const { app, BrowserWindow, Menu, ipcMain, shell } = require("electron"); // Later we will  instantiate a new browser window

const isDev = process.env.NODE_ENV !== 'development';
const isMac = process.platform === 'darwin';
let mainWindow; 
function createMainWindow() {
  // the first window of our app
    mainWindow = new BrowserWindow({
    // here we are creating an instance
    title: "Image Resizer",
    width: isDev? 1000: 500,
    height: 600,
    webPreferences: {
        contextIsolation: true,
        nodeIntegration: true,
        preload: path.join(__dirname, 'preload.js')
    }
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

  // Remove mainWindow form memory on close
    mainWindow.on('closed', ()=>(mainWindow = null));
    
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

// Respond to ipcRenderer resize
ipcMain.on('image:resize', (e, options) => {
    options.dest = path.join(os.homedir(),'imageresizer')
    resizeImage(options);
});

// Resize and save image
async function resizeImage({ imgPath, height, width, dest }) {
    try {
      // console.log(imgPath, height, width, dest);
  
      // Resize image
      const newPath = await resizeImg(fs.readFileSync(imgPath), {
        width: +width,
        height: +height,
      });
  
      // Get filename
      const filename = path.basename(imgPath);
  
      // Create destination folder if it doesn't exist
      if (!fs.existsSync(dest)) {
        fs.mkdirSync(dest);
      }
  
      // Write the file to the destination folder
      fs.writeFileSync(path.join(dest, filename), newPath);
  
      // Send success to renderer
      mainWindow.webContents.send('image:done');
  
      // Open the folder in the file explorer
      shell.openPath(dest);
    } catch (err) {
      console.log(err);
    }
  }

app.on("window-all-closed", () => {
  // quit the app when windows will be closed
  if (process.platform !== "darwin") app.quit(); // darwin -> mac
});
