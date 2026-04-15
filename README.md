# web-component-designer-demo

Demonstration project using https://github.com/node-projects/web-component-designer

## url of demo project

https://node-projects.github.io/web-component-designer-demo/index.html

## Collaboration Notes

Manual WebRTC signaling works out of the box for same-browser tabs. The demo now defaults to Google's public STUN server at `stun:stun.l.google.com:19302`, and you can change the RTC configuration from the `collab` menu.

The `collab` menu also has a `free TURN providers` submenu. The first option is `Metered TURN (hardcoded)`, which applies the built-in Metered/OpenRelay ICE server credentials directly without prompting. Cloudflare TURN is also supported there through Cloudflare's official `generate-ice-servers` flow documented at `https://developers.cloudflare.com/realtime/turn/generate-credentials/`. For local testing, the demo can prompt for the TURN key id, API token, and TTL and fetch that JSON directly with `Cloudflare TURN (official API) > fetch credentials now... (dev/test)`. You can also paste the returned JSON into `Cloudflare TURN (official API) > paste generate-ice-servers JSON...`.

The hardcoded Metered/OpenRelay option contains live TURN credentials in the demo source, so treat it as a convenience preset rather than a production-safe deployment pattern.

For different machines you will often still need STUN or TURN servers. The demo also accepts one or more `collabIceServer` query parameters, for example:

```text
https://node-projects.github.io/web-component-designer-demo/index.html?collabIceServer=stun:stun.l.google.com:19302
```

For more advanced setups you can pass a full JSON-encoded `RTCConfiguration` through `collabRtcConfiguration`, or paste that JSON into the collab menu's `edit RTC configuration...` action. The menu now also accepts direct provider responses such as a single ICE server entry, an `iceServers` array, or Cloudflare's `generate-ice-servers` JSON object. When using the direct Cloudflare fetch path, prefer local testing only because the API token is exposed to the browser.

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