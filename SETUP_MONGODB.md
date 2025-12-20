# How to Install MongoDB on Windows

## Option 1: Easiest Method (Using Winget)

Since you have `winget` installed, you can install MongoDB directly from your terminal.

1. **Open a new Terminal as Administrator**.
2. Run the following command to install the MongoDB Server:
   ```powershell
   winget install MongoDB.Server
   ```
3. (Optional) Install MongoDB Compass (a visual tool to view your data):
   ```powershell
   winget install MongoDB.Compass.Full
   ```
4. **Restart your computer** or your terminal to ensure environment variables are updated.

## Option 2: Manual Installation

1. Visit the [MongoDB Community Download Page](https://www.mongodb.com/try/download/community).
2. Select **Windows** as the platform.
3. Download the **MSI** package.
4. Run the installer:
   - Choose **Complete** setup.
   - Ensure **"Install MongoDB as a Service"** is CHECKED.
   - Click **Next** and **Install**.

## Verification

After installation, open a new terminal and run:

```powershell
mongod --version
```

If you see version information, it is installed correctly.

## Starting the Database

MongoDB usually starts automatically as a Windows Service.
If it's not running, you can start it manually:

1. Open Task Manager -> Services.
2. Look for `MongoDB`.
3. Right-click and select **Start**.

## Troubleshooting

If you get a "command not found" error for `mongod` after installing:

1. You may need to add the MongoDB bin folder to your System PATH.
2. Default path is usually: `C:\Program Files\MongoDB\Server\7.0\bin` (version number may vary).
