// Noam's Game Hub for Mac — a small app window around https://noamtoder.com
const { app, BrowserWindow, Menu, shell, dialog, session, net } = require("electron");
const path = require("path");
const fs = require("fs");

const HOME = "https://noamtoder.com/";
const SITE_HOSTS = ["noamtoder.com", "www.noamtoder.com"];
// Pages that must open inside the app so signing in works (Google / Firebase popups)
const AUTH_HOSTS = ["gamehub-fb2ed.firebaseapp.com", "accounts.google.com", "apis.google.com"];
const RELEASES_API = "https://api.github.com/repos/ntoder/gamehub/releases/latest";
const DOWNLOAD_PAGE = "https://noamtoder.com/app";

app.setName("Noam's Game Hub");

let win;
const stateFile = () => path.join(app.getPath("userData"), "window.json");

function hostOf(url) {
  try { return new URL(url).hostname; } catch { return ""; }
}
const isSite = (url) => SITE_HOSTS.includes(hostOf(url));
const isAuth = (url) => AUTH_HOSTS.some((h) => hostOf(url) === h || hostOf(url).endsWith("." + h));

function loadBounds() {
  try { return JSON.parse(fs.readFileSync(stateFile(), "utf8")); } catch { return {}; }
}
function saveBounds() {
  if (!win || win.isDestroyed()) return;
  try {
    fs.writeFileSync(stateFile(), JSON.stringify({ ...win.getNormalBounds(), max: win.isMaximized() }));
  } catch {}
}

// Look like normal Chrome (Google sign-in refuses unknown browsers), plus our own tag
function userAgent() {
  const chrome = process.versions.chrome;
  return `Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/${chrome} Safari/537.36 NoamGameHubApp/${app.getVersion()}`;
}

function createWindow() {
  const b = loadBounds();
  win = new BrowserWindow({
    width: b.width || 1280,
    height: b.height || 820,
    x: b.x, y: b.y,
    minWidth: 420,
    minHeight: 500,
    title: "Noam's Game Hub",
    backgroundColor: "#0b0d1a",
    show: false,
    webPreferences: {
      contextIsolation: true,
      sandbox: true,
      spellcheck: false,
    },
  });
  if (b.max) win.maximize();
  win.once("ready-to-show", () => win.show());
  win.on("close", saveBounds);

  win.webContents.setUserAgent(userAgent());
  win.loadURL(HOME);

  const wc = win.webContents;

  // Links: our site + sign-in stay in the app, everything else opens in the normal browser
  wc.setWindowOpenHandler(({ url }) => {
    if (isAuth(url)) {
      return {
        action: "allow",
        overrideBrowserWindowOptions: { width: 500, height: 680, parent: win, autoHideMenuBar: true },
      };
    }
    if (isSite(url)) { wc.loadURL(url); return { action: "deny" }; }
    if (/^(https?|mailto):/.test(url)) shell.openExternal(url);
    return { action: "deny" };
  });
  wc.on("did-create-window", (child) => child.webContents.setUserAgent(userAgent()));
  wc.on("will-navigate", (e, url) => {
    if (isSite(url) || isAuth(url) || url.startsWith("file:")) return;
    e.preventDefault();
    if (/^(https?|mailto):/.test(url)) shell.openExternal(url);
  });

  // No internet? Show a friendly page with a "Try again" button
  wc.on("did-fail-load", (e, code, desc, url, isMain) => {
    if (!isMain || code === -3) return; // -3 = cancelled (normal during redirects)
    win.loadFile(path.join(__dirname, "offline.html"), { query: { back: url || HOME } });
  });

  wc.on("page-title-updated", (e, title) => {
    e.preventDefault();
    win.setTitle(title && !/^noam'?s game hub$/i.test(title) ? title : "Noam's Game Hub");
  });
}

function go(p) {
  if (!win) return;
  win.webContents.loadURL(new URL(p, HOME).toString());
  win.show();
}

function buildMenu() {
  const isMac = process.platform === "darwin";
  const template = [
    ...(isMac ? [{
      label: app.name,
      submenu: [
        { role: "about" },
        { label: "Check for Updates…", click: () => checkForUpdates(true) },
        { type: "separator" },
        { role: "services" },
        { type: "separator" },
        { role: "hide" }, { role: "hideOthers" }, { role: "unhide" },
        { type: "separator" },
        { role: "quit" },
      ],
    }] : []),
    { role: "editMenu" },
    {
      label: "View",
      submenu: [
        { role: "reload" },
        { label: "Hard Reload (get newest version)", accelerator: "CmdOrCtrl+Shift+R", click: hardReload },
        { type: "separator" },
        { role: "resetZoom" }, { role: "zoomIn" }, { role: "zoomOut" },
        { type: "separator" },
        { role: "togglefullscreen" },
      ],
    },
    {
      label: "Go",
      submenu: [
        { label: "Home", accelerator: "CmdOrCtrl+Shift+H", click: () => go("/") },
        { label: "Back", accelerator: "CmdOrCtrl+[", click: () => win && win.webContents.navigationHistory.canGoBack() && win.webContents.navigationHistory.goBack() },
        { label: "Forward", accelerator: "CmdOrCtrl+]", click: () => win && win.webContents.navigationHistory.canGoForward() && win.webContents.navigationHistory.goForward() },
        { type: "separator" },
        { label: "🌍 Arcade World", click: () => go("/world") },
        { label: "🐣 My Hub Pet", click: () => go("/pet") },
        { label: "🧱 Level Maker", click: () => go("/maker") },
        { label: "🧑‍💻 Game Studio", click: () => go("/studio") },
        { label: "🎨 Made by Players", click: () => go("/made") },
        { type: "separator" },
        { label: "My Profile", click: () => go("/profile") },
      ],
    },
    { role: "windowMenu" },
    {
      role: "help",
      submenu: [
        { label: "Open noamtoder.com in my browser", click: () => shell.openExternal(win ? currentSiteUrl() : HOME) },
        { label: "About the Game Hub", click: () => go("/about") },
      ],
    },
  ];
  Menu.setApplicationMenu(Menu.buildFromTemplate(template));
}

function currentSiteUrl() {
  const u = win.webContents.getURL();
  return isSite(u) ? u : HOME;
}

async function hardReload() {
  if (!win) return;
  // clear the website's offline copy so the newest games load
  await win.webContents.session.clearStorageData({ storages: ["serviceworkers", "cachestorage"] }).catch(() => {});
  await win.webContents.session.clearCache().catch(() => {});
  win.webContents.reloadIgnoringCache();
}

// ---- Update check (once a day; shows a message, opens the download page) ----
function newer(a, b) {
  const pa = a.replace(/^\D+/, "").split(".").map(Number), pb = b.replace(/^\D+/, "").split(".").map(Number);
  for (let i = 0; i < 3; i++) { if ((pa[i] || 0) !== (pb[i] || 0)) return (pa[i] || 0) > (pb[i] || 0); }
  return false;
}
async function checkForUpdates(manual) {
  try {
    const res = await net.fetch(RELEASES_API, { headers: { "User-Agent": "NoamGameHubApp" } });
    if (!res.ok) throw new Error("HTTP " + res.status);
    const rel = await res.json();
    const latest = rel.tag_name || "";
    if (latest && newer(latest, app.getVersion())) {
      const { response } = await dialog.showMessageBox(win, {
        type: "info",
        message: `A new version of Noam's Game Hub is ready (${latest.replace(/^\D+/, "")})`,
        detail: "Download it from the website and replace the old app in your Applications folder.\n\n(The games themselves are always up to date — this is only for the app window.)",
        buttons: ["Download", "Later"],
        defaultId: 0, cancelId: 1,
      });
      if (response === 0) shell.openExternal(DOWNLOAD_PAGE);
    } else if (manual) {
      dialog.showMessageBox(win, { type: "info", message: "You have the newest version 🎉", detail: "Version " + app.getVersion() });
    }
  } catch (err) {
    if (manual) dialog.showMessageBox(win, { type: "warning", message: "Couldn't check for updates", detail: "Check your internet connection and try again." });
  }
}

// Only one copy of the app at a time
if (!app.requestSingleInstanceLock()) {
  app.quit();
} else {
  app.on("second-instance", () => { if (win) { if (win.isMinimized()) win.restore(); win.show(); win.focus(); } });

  app.whenReady().then(() => {
    app.setAboutPanelOptions({
      applicationName: "Noam's Game Hub",
      applicationVersion: app.getVersion(),
      copyright: "Made by Noam · noamtoder.com",
    });
    // Allow full screen for games; ask nothing else
    session.defaultSession.setPermissionRequestHandler((wc, permission, cb) => {
      cb(["fullscreen", "pointerLock", "clipboard-sanitized-write", "notifications"].includes(permission));
    });
    buildMenu();
    createWindow();
    setTimeout(() => checkForUpdates(false), 8000);
  });

  // Mac: clicking the Dock icon brings the window back
  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
    else if (win) win.show();
  });
  app.on("window-all-closed", () => { if (process.platform !== "darwin") app.quit(); });
}
