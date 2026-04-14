# web-component-designer-demo

Demonstration project using https://github.com/node-projects/web-component-designer

## url of demo project

https://node-projects.github.io/web-component-designer-demo/index.html

## Collaboration Notes

Manual WebRTC signaling works out of the box for same-browser tabs. The demo now defaults to Google's public STUN server at `stun:stun.l.google.com:19302`, and you can change the RTC configuration from the `collab` menu.

The `collab` menu also has a `free TURN providers` submenu. The currently verified free path is Cloudflare TURN via `https://speed.cloudflare.com/turn-creds`. Paste that JSON into `Cloudflare TURN (verified) > paste turn-creds JSON...`.

OpenRelay is also linked in the same submenu, but it requires signup or API-provided credentials before you can paste the returned `iceServers` JSON into the demo.

For different machines you will often still need STUN or TURN servers. The demo also accepts one or more `collabIceServer` query parameters, for example:

```text
https://node-projects.github.io/web-component-designer-demo/index.html?collabIceServer=stun:stun.l.google.com:19302
```

For more advanced setups you can pass a full JSON-encoded `RTCConfiguration` through `collabRtcConfiguration`, or paste that JSON into the collab menu's `edit RTC configuration...` action. The menu now also accepts direct provider responses such as a single ICE server entry, an `iceServers` array, or Cloudflare's `turn-creds` JSON object.

## Developing

  * Install dependencies
```
  $ npm install
```

  * Compile typescript after doing changes
```
  $ npm run build (if you use Visual Studio Code, you can also run the build task via Ctrl + Shift + B > tsc:build - tsconfig.json)
```

  * *Link web component designer node module*<br/>
    See https://github.com/node-projects/web-component-designer#readme first
```
  $ npm link "@node-projects/web-component-designer" 
```

  * Run the app in a local server
```
  $ npm start
```

## thanks to

https://github.com/jcfranco/composed-offset-position
https://github.com/floating-ui/floating-ui
--> needed code from those two to get the correct offset-parent of slotted content in shadow DOM