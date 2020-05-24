## Viewfinder
![Viewfinder Logo](./assets/blue-logo.png)

Project for OpenHacks 2020 that aims to bring differing views into an understanding and create an open mind for individuals.

## Build and Run

How to use this project:
- Ensure you have nothing running on ports :4000 and :5678.
- Load the extension from the `extension/` folder into Chrome.
    - Go to `chrome://extensions/`
    - Click the `Load unpacked` button
    - Select the folder titled `extension`
- Get a Google Cloud API key for the Natural Language API, rename it `key.json`, and put it in the `analysis/` folder.
- `cd analysis && yarn && node index.js &`
- `cd chat/backend && yarn && node app.js &`
- Done!
