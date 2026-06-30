# Build & Deployment Guide

## Prerequisites

| Tool | Version | Required For |
|------|---------|-------------|
| Node.js | >= 18 | All |
| Android Studio | Latest | APK |
| Java JDK | >= 17 | APK |
| Gradle | (bundled with Android Studio) | APK |

---

## 1. Web (Dev Server)

```bash
# Start PocketBase first
./pocketbase/pocketbase.exe serve

# Start dev server (another terminal)
npm run dev
```

Open `http://localhost:3000` in your browser.

### Production Build

```bash
npm run build     # outputs to dist/
npm run preview   # serve the built files locally
```

The `dist/` folder can be deployed to any static host (Vercel, Netlify, GitHub Pages, etc.).

---

## 2. Android APK

```bash
# 1. Build the web app
npm run build

# 2. Sync web build to Android project
npx cap sync android

# 3. Open in Android Studio
npx cap open android

# 4. In Android Studio:
#    - Build → Build Bundle(s) / APK(s) → Build APK(s)
#    - Or: Build → Generate Signed Bundle / APK for release
```

The APK will be at `android/app/build/outputs/apk/debug/app-debug.apk`.

**Note:** For the app to connect to PocketBase on a physical device, change `VITE_PB_URL` in `.env` to your computer's local IP (e.g., `http://192.168.1.100:8090`). The device and server must be on the same network.

---

## 3. Windows EXE

### Option A: Electron (Recommended for full window)

```bash
# Install electron and builder
npm install --save-dev electron electron-builder

# Create electron entry file (electron/main.js)
```

Create `electron/main.js`:

```js
const { app, BrowserWindow } = require('electron');
const path = require('path');

app.whenReady().then(() => {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: { nodeIntegration: false }
  });
  win.loadFile(path.join(__dirname, '../dist/index.html'));
});
```

Update `package.json` scripts:

```json
{
  "main": "electron/main.js",
  "scripts": {
    "electron:dev": "npm run build && electron .",
    "electron:build": "npm run build && electron-builder --win"
  }
}
```

```bash
npm run electron:build
```

The EXE will be in `dist-electron/` or `release/` folder.

### Option B: Nativefier (Quick & simple)

```bash
npx nativefier http://localhost:3000 --name "CatholicBreviary" --platform windows
```

This wraps the web app in a lightweight Electron shell. Output in `CatholicBreviary-win32-x64/`.

### Option C: Express + Browser (No bundling)

The app already runs as a web app. Users just open `http://localhost:3000` in their browser. For a pseudo-desktop feel, use Chrome's "Create shortcut" feature (three-dot menu → More tools → Create shortcut → Open as window).

---

## 4. Mobile (Capacitor)

```bash
# Build web app
npm run build

# Sync with Capacitor
npx cap sync

# For Android (requires Android Studio):
npx cap open android

# For iOS (requires Xcode - macOS only):
npx cap add ios     # first time only
npx cap open ios
```

### Connecting to PocketBase from Mobile

When running on a physical device, PocketBase won't be accessible via `localhost`. Create a `.env` file:

```
VITE_PB_URL=http://192.168.1.100:8090
```

Replace `192.168.1.100` with your computer's local IP address. Run `ipconfig` on Windows to find it. The phone and computer must be on the same Wi-Fi network.

For production, deploy PocketBase to a cloud server (Railway, Fly.io, etc.) and set `VITE_PB_URL` to your server URL.

---

## 5. Save & View Text in Realtime

The app uses PocketBase realtime subscriptions. When data changes in the database (from any device or browser tab), the UI updates instantly without a page refresh.

### Step 1: Start PocketBase

```bash
./pocketbase/pocketbase.exe serve
```

### Step 2: Start the App

```bash
npm run dev
```

Open `http://localhost:3000`.

### Step 3: Open Two Browser Tabs

Open the app in **two separate tabs** (or two different devices on the same network). This lets you see realtime sync in action.

### Step 4: Admin Login

In either tab, click **Parish Console** (top-right button) and log in:

| Field | Value |
|-------|-------|
| Email | `mothermary123789@gmail.com` |
| Password | `test123456` |

### Step 5: Edit Content

In the Parish Console panel:

1. Go to the **Prayers** tab (or Saints / Calendar)
2. Click **Add New** or **Edit** on an existing item
3. Change the title or content
4. Click **Save**

### Step 6: Watch Realtime Sync

- **Same tab** — The prayer list updates immediately after save
- **Other tab** — The change appears automatically within 1-2 seconds, no manual refresh needed
- **Other devices** — If another device has the app open and is on the same network pointing to the same PocketBase server, it also updates in realtime

### How It Works

```
Admin edits prayer → savePrayer() → PocketBase API → PB broadcasts SSE event
                                                          ↓
                                              subscribePrayers() callback
                                                          ↓
                                              setPrayers() → React re-render
```

The app subscribes to PocketBase's Server-Sent Events (SSE) channel for each collection (`prayers`, `saints`, `liturgicalDays`, `journalEntries`, `bookmarks`). Any `create`, `update`, or `delete` operation broadcasts to all connected clients.

### Test It Yourself

```bash
# From a terminal (while app is running), add a record directly to PocketBase:
node -e "
import PocketBase from 'pocketbase';
const pb = new PocketBase('http://localhost:8090');
await pb.collection('_superusers').authWithPassword('mothermary123789@gmail.com', 'test123456');
await pb.collection('prayers').create({
  category: 'morning',
  titleEn: 'REALTIME DEMO - ' + new Date().toLocaleTimeString(),
  titleTa: 'நேரலை காட்சி',
  contentEn: 'This appears in the browser automatically!',
  contentTa: 'இது தானாகவே உலாவியில் தோன்றும்!'
});
console.log('Added — watch the browser!');
"
```

The new prayer appears in the app instantly without refreshing.

---

## 6. Quick Reference

| Target | Command | Output |
|--------|---------|--------|
| Web dev | `npm run dev` | `http://localhost:3000` |
| Web build | `npm run build` | `dist/` |
| Android APK | `npm run build && npx cap sync android && npx cap open android` | `android/app/build/outputs/apk/` |
| Windows EXE (Electron) | See §3 Option A | `release/` |
| Mobile dev | `npx cap open android` | Android Studio |

---

## 7. File Structure

```
├── src/                    # React app source
├── dist/                   # Web production build
├── android/                # Android project (Capacitor)
├── pocketbase/             # PocketBase server binary
├── scripts/                # Seed & setup scripts
├── capacitor.config.ts     # Capacitor configuration
├── vite.config.ts          # Vite configuration
└── package.json
```
