# microTools

**microTools** is a small macOS menu bar app that hosts little utilities as **plugins**. Turn on only the ones you
need; new tools arrive as new plugins, not as one more app. Get the app at
[microbians.gumroad.com/l/microtools](https://microbians.gumroad.com/l/microtools); more at
[microbians.github.io/microtools](https://microbians.github.io/microtools/).

This repository holds what you need to get and build plugins:

| Folder | What |
| --- | --- |
| `catalog/index.json` | The official plugins microTools offers in Settings › General › More Plugins. Each entry is a plugin's manifest plus its release download and SHA-256. |
| Releases | One release per plugin version (`<id>-<version>`), with the signed, notarized `<id>.microplugin.zip`. |
| `docs/` | [`javascript.md`](docs/javascript.md): the plugin format and the JavaScript API. [`for-ai.md`](docs/for-ai.md): step-by-step instructions so an AI can build a plugin. |
| `sdk/` | MicroKit's interface for Swift plugins. *(coming)* |
| `examples/` | Open example plugins: [`dateStamp`](examples/dateStamp.microplugin), [`notesToFile`](examples/notesToFile.microplugin) (JavaScript). |

## Plugins

A plugin is a `.microplugin` folder installed in `~/Library/Application Support/microTools/Plugins`:

```
mediaGrab.microplugin/
  Contents/
    Info.plist                 Swift plugins: the bundle's id and executable
    MacOS/MediaGrab            Swift plugins: the code, linked against MicroKit
    Resources/
      manifest.json            what microTools shows before loading the code
      main.js                  JavaScript plugins: the code
      es.lproj/Localizable.strings
```

`manifest.json`:

```json
{
  "id": "mediaGrab",
  "title": "mediaGrab",
  "summary": "Video, MP3 or images from the page in your browser.",
  "symbol": "arrow.down.circle",
  "version": "1.0",
  "kind": "swift",
  "principalClass": "MediaGrab.MediaGrabPlugin",
  "sdk": 1,
  "minApp": "3.0"
}
```

- **Swift plugins** run with microTools' own rights, so microTools only loads Swift plugins signed by microbians.
- **JavaScript plugins** run in a sandboxed JavaScriptCore context and reach the Mac only through the API
  microTools gives them, with the permissions you grant each one: anyone can write them, an AI too.

## Official plugins

| Plugin | What it does |
| --- | --- |
| hideOnStart | Hides the windows apps open at login. |
| rightClick | 14 tools in Finder's right-click menu and in Services. |
| audioSwitch | Audio devices, profiles and rules that switch them for you. |
| mediaGrab | Video, MP3 or images from the page in your browser. |
| midiLink | Bluetooth MIDI devices from the menu bar, and MIDI from one to another. |
| shotGrab | Text, QR codes and what an image shows, from any part of the screen — and screenshots named by what they show. |
| colorPick | Pick any color on screen, named and copied in the format you need, or a palette from an image. |
| keepAwake | Keeps your Mac awake for a while, until you turn it off, or while a rule holds. |
| deskClean | A clean desktop for screen sharing, recording or focus. |
| batteryCare | Your Mac's and your Bluetooth devices' battery, from the menu bar. |
| macTweaks | The Mac's hidden settings and repairs, without Terminal. |
| habitTrack | Habits to do a few times a day or a week, marked from the menu bar with one click. |

Made by [microbians](https://microbians.com).
