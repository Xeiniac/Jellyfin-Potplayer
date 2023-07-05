# Jellyfin-Potplayer

Tested with Jellyfin 10.8.10 and Windows 11. Please note that newer versions are not guaranteed to work with this script. If you encounter any issues, please open an issue on the repository, and I'll do my best to assist you.

## Installation

1. Download this repository.
2. Place the `potplayer.ps1` file somewhere on your disk. Do not delete it even after completing this tutorial. Edit the Potplayer path in `potplayer.ps1`, ensuring you use a double backslash as the divider.
3. Edit `potplayer.reg` and change the path to where you saved `potplayer.ps1`. Use a double backslash in the path as well.
4. Double-click `potplayer.reg` and click "Yes" to proceed with the installation.
5. Install the browser extension called "Tampermonkey BETA."
6. Edit `userscript.js`:
    1. Change `localhost:8096` to the host address of your Jellyfin server.
    2. If you don't want the script to mark the media as watched after clicking play, you can comment out or remove the code from lines 28-31.
    3. Ensuring the video path displayed in your Jellyfin webpage corresponds to the actual location on your computer can be a bit tricky. If you're using the script on the same computer that runs the Jellyfin server, you can skip to step 4. Otherwise, follow these instructions:
       - Right-click on a blank area of the "This computer" window.
       - Choose "Add a network location" (or a similar option, the wording may vary depending on your operating system).
       - Link the drive where you have stored all the videos on your Jellyfin server to a local drive on your current computer.
       - For example, after completing the setup, you should be able to open `D:/folder1/video1.mp4` (on the server) by using `Z:/folder1/video1.mp4` (on your local computer).
    4. Change line 16 in the script. Uncomment the line by removing the leading double backslash, and change `D:` to the drive letter on your server that corresponds to the drive on your local computer. If you have experience with JavaScript, you can customize this path processing script according to your needs. Just ensure that the path matches your local file path. For example, if you followed the step 2 example, the script should be:
    ```
    path = path.replace('D:', 'Z:');
    ```
    5. Choose "Add a new script" in the `Tampermonkey` menu. Copy and paste the entire script, and make sure you enable it. The script should be enabled when you open Jellyfin.
7. Test the setup by clicking on the play button. It should work fine now. Enjoy your movies!

## How it works

This solution utilizes a user script to modify the play buttons in Jellyfin. Instead of using the web player, a link is opened that follows a "url protocol" for Potplayer. This url protocol first calls a PowerShell script, which then passes the video path to Potplayer. That's it!

## FAQ

### The browser successfully opens the PowerShell script, but PotPlayer doesn't start
This issue is related to the PowerShell Execution Policy. Please refer to [this GitHub issue](https://github.com/tccoin/Jellyfin-Potplayer/issues/5) for a solution.

### Additional backslash at the end of the path in PotPlayer
For a solution to the issue with an additional backslash at the end of the path in PotPlayer, please see [this GitHub issue](https://github.com/tccoin/Jellyfin-Potplayer/issues/11). (Note that the issue is in Chinese.)
