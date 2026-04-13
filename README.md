# web-component-designer-demo

Demonstration project using https://github.com/node-projects/web-component-designer

## url of demo project

https://node-projects.github.io/web-component-designer-demo/index.html

## Collaboration Notes

Manual WebRTC signaling works out of the box for same-browser tabs. For different machines you will often need STUN or TURN servers. The demo accepts one or more `collabIceServer` query parameters, for example:

```text
https://node-projects.github.io/web-component-designer-demo/index.html?collabIceServer=stun:stun.l.google.com:19302
```

For more advanced setups you can pass a full JSON-encoded `RTCConfiguration` through `collabRtcConfiguration`.

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