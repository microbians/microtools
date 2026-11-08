# JavaScript plugins

A JavaScript plugin is a folder `<id>.microplugin/Contents/Resources/` with a `manifest.json`, a `main.js` and,
optionally, translations in `<lang>.lproj/Localizable.strings`. microTools runs `main.js` in its own
JavaScriptCore context (no browser, no Node: no `require`, no DOM). The script reaches the Mac only through the
global `microtools` object described here.

Install a plugin by double-clicking the `.microplugin` folder, or in microTools › Settings › General ›
*Add Plugin from File…*. It is copied to `~/Library/Application Support/microTools/Plugins` and switched on.

## manifest.json

```json
{
  "id": "dateStamp",
  "title": "dateStamp",
  "summary": "Copies today’s date in the format you choose.",
  "symbol": "calendar",
  "version": "1.0",
  "kind": "js",
  "sdk": 1,
  "minApp": "3.0",
  "permissions": [],
  "settings": [
    { "key": "format", "type": "select", "title": "Format", "section": "Date",
      "options": [ { "value": "iso", "title": "2026-11-08" }, { "value": "long", "title": "8 November 2026" } ],
      "default": "iso" },
    { "key": "notice", "type": "toggle", "title": "Show a notice", "description": "When the date is copied.", "default": true },
    { "key": "copy", "type": "shortcut", "title": "Shortcut" }
  ]
}
```

| Key | |
| --- | --- |
| `id` | Unique, camelCase, also the folder name. Prefixes the plugin's settings and is the host of its URLs. |
| `title` | Shown in the menu bar menu and Settings. microTools' own plugins use lowerCamelCase names. |
| `summary` | One sentence under the title in Settings (a translation key). |
| `symbol` | An [SF Symbol](https://developer.apple.com/sf-symbols/) name, or `lucide:<name>` for a [Lucide](https://lucide.dev) icon. |
| `version` | The plugin's version, `major.minor`. |
| `kind` | `"js"`. |
| `sdk` | `1`. |
| `permissions` | `"shell"` to run commands (the user is asked once). |
| `settings` | Drawn by microTools in the plugin's Settings pane, grouped by `section`. Types: `toggle`, `text`, `select` (`options`), `shortcut` (a global keyboard shortcut), `folder`, `note` (text only). `title`, `description`, `section` and option titles are translation keys. |

## main.js

```js
microtools.register({
  start() { },                 // switched on (and at launch while on)
  stop() { },                  // switched off: timers and shortcuts are cleared by microTools
  menu() { return [ ... ] },   // its items in the menu bar menu, every time the menu opens
  settingsChanged(key, value) { },
  url(path, args) { }          // microtools://<id>/<path>?… when no route matches
})
```

### Menu items

```js
menu() {
  return [
    { header: 'Recent' },
    { title: 'Copy Date', symbol: 'doc.on.clipboard', action: () => copy() },
    { title: 'Format', submenu: [ { title: 'ISO', checked: true, action: () => {} } ] },
    { separator: true },
    { title: 'Nothing to do', enabled: false }
  ]
}
```

### API

| Call | |
| --- | --- |
| `microtools.setting(key)` | A setting's value (or its manifest default). |
| `microtools.setSetting(key, value)` | Changes a setting. |
| `microtools.onShortcut(key, fn)` | `fn` runs when the shortcut set in setting `key` is pressed, anywhere. |
| `microtools.save(key, value)` / `microtools.load(key)` | The plugin's own data, any JSON value, kept across launches. |
| `microtools.notice(title, detail?, symbol?)` | A small tooltip under the plugin's menu bar icon, for a few seconds. |
| `microtools.activity(value)` | A ring on its menu bar icon: a number 0…1, `'working'` (turning), or `null` (none). |
| `microtools.sound(name)` | A system sound: `Ping`, `Glass`, `Pop`, `Tink`… |
| `microtools.readClipboard()` / `microtools.writeClipboard(text)` | The clipboard's text. |
| `microtools.open(urlOrPath)` | Opens a URL, a file or a folder (`~` works). |
| `await microtools.frontTab()` | `{ url, title, browser }` of the front tab in Safari or a Chromium browser, or `null`. |
| `await microtools.fetch(url, { method, headers, body })` | `{ status, headers, text, json() }`. http and https only. |
| `await microtools.ai(prompt, instructions?)` | Apple's on-device model (Apple Intelligence, macOS 26): its answer as text. |
| `await microtools.shell(command, [args])` | `{ status, output, error }`. Needs `"permissions": ["shell"]`; the user is asked once. |
| `microtools.route(path, fn)` | `microtools://<id>/<path>?a=1` calls `fn({ a: '1' })`; other plugins can call it too. |
| `microtools.call(pluginId, path, args)` | Calls another plugin's route; a JS plugin's route returns its value. |
| `microtools.localized(key)` | A string from the plugin's `Localizable.strings` in the user's language. |
| `setTimeout`, `setInterval`, `clearTimeout`, `clearInterval`, `console.log` | As in a browser. Logs: `log stream --predicate 'subsystem == "com.microbians.microTools" && category == "Scripts"'`. |

Calls marked `await` return promises.

### Translations

Keys are the English text. `Contents/Resources/es.lproj/Localizable.strings`:

```
"Copy Date" = "Copiar fecha";
"Copies today’s date in the format you choose." = "Copia la fecha de hoy en el formato que elijas.";
```

## Errors

An uncaught error stops the call that threw it; microTools logs it and shows it at the top of the plugin's pane.

## Example

`examples/dateStamp.microplugin` in this repository.
