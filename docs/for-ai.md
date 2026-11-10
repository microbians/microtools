# Building a microTools plugin (instructions for an AI)

You are asked to build a plugin for **microTools**, a macOS menu bar app that hosts small utilities. Build a
**JavaScript plugin** (Swift plugins can only be signed by microbians). Follow these steps exactly.

## 1. Understand the request

- What does it do, when (a menu item, a keyboard shortcut, a timer, a URL), and what does the user set?
- Check the API in `docs/javascript.md`. If something needs an API that does not exist (the screen, the
  selection in other apps), say so instead of inventing one. Commands through
  `microtools.shell` are possible but need `"permissions": ["shell"]`: use them only when the plugin cannot work
  without them, and say why in the plugin's summary or a `note` setting.
- Files: `"permissions": ["files"]` and `"minApp": "3.1"`. The plugin can only use folders the user grants
  (`await microtools.chooseFolder()`, or *Add Folder…* in its Settings pane); build every path from
  `microtools.folders()` or the chosen folder, never from a fixed path like `~/Documents`. Never use `shell` for
  files.

## 2. Create the folder

```
<id>.microplugin/
  Contents/
    Resources/
      manifest.json
      main.js
      en.lproj/Localizable.strings   (a comment line only: English keys are the text)
      es.lproj/Localizable.strings   (and other languages the user wants)
```

`<id>` is lowerCamelCase and unique (`dateStamp`, `tabCounter`). The folder name is `<id>.microplugin`.

## 3. Write manifest.json

- `kind` is `"js"`, `sdk` is `1`, `minApp` is `"3.0"` (`"3.1"` with the `files` permission), `version` starts at `"1.0"`.
- `summary`: one plain sentence, what it does for the user, no marketing.
- `about`: two to four plain sentences: what it does, how it is used, what it needs. Users find plugins by
  searching these words, so name the things they would search for.
- `symbol`: an SF Symbol name that exists (check SF Symbols), or `lucide:<name>`.
- Declare every option the user sets in `settings` (never ask with a dialog what a setting can hold). Group them
  with `section`. Give each a `default`. A global shortcut is a `shortcut` setting plus `microtools.onShortcut`.

## 4. Write main.js

- Call `microtools.register({ start, stop, menu })` once. Keep `menu()` fast: it runs every time the menu opens.
- Use `microtools.localized('English text')` for every text the user reads; add each key to every `.lproj`.
- Use `microtools.notice` for results the user must know about (copied, done, failed), short: a title of 1–3
  words and a detail line.
- Long work: `microtools.activity('working')` while it runs, `microtools.activity(null)` at the end.
- Handle failures: wrap `await` calls in `try/catch` and show a notice with a short reason.
- No `require`, `import`, DOM, `window`, `document`, `localStorage`: use `microtools.save`/`load`.

## 5. Check before handing it over

- `manifest.json` is valid JSON; every setting key used in `main.js` exists in `settings`.
- Every `.lproj` has the same keys.
- Install it (double-click the folder), switch it on in Settings, try each menu item, shortcut and setting.
  Errors appear at the top of the plugin's pane and in
  `log stream --predicate 'subsystem == "com.microbians.microTools" && category == "Scripts"'`.

## Example

`examples/dateStamp.microplugin`: a select, a toggle and a shortcut setting, a menu with a submenu, a notice,
the clipboard and a route. `examples/notesToFile.microplugin`: the `files` permission, a chosen folder, appending
to a file.
