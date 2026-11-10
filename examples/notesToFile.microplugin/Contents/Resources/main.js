// notesToFile: an example JavaScript plugin for microTools that uses the files API (see kit/docs/javascript.md).

const L = key => microtools.localized(key)

// The folder the user chose last (granted in Settings › notesToFile › Folders, or with "Choose Folder…").
function folder() { return microtools.folders().slice(-1)[0] }

function notesPath() {
  const name = (microtools.setting('fileName') || 'Notes.txt').replace(/[\/:]/g, '-')
  return folder() + '/' + name
}

async function chooseFolder() {
  try { return await microtools.chooseFolder() }
  catch (error) { microtools.notice(L('Not allowed'), String(error)); return null }
}

async function append() {
  const text = microtools.readClipboard()
  if (!text) return microtools.notice(L('Clipboard is empty'))
  if (!folder() && !(await chooseFolder())) return
  try {
    await microtools.writeFile(notesPath(), `\n— ${new Date().toLocaleString()}\n${text}\n`, { append: true })
    microtools.notice(L('Added'), notesPath().split('/').pop())
  } catch (error) {
    microtools.notice(L('Not added'), String(error))
  }
}

microtools.register({
  start() { microtools.onShortcut('append', append) },
  menu() {
    return [
      { title: L('Add Clipboard to Notes'), symbol: 'note.text.badge.plus', action: append },
      { title: L('Open Notes'), enabled: !!folder(), action: () => microtools.open(notesPath()) },
      { title: L('Choose Folder…'), action: chooseFolder }
    ]
  }
})

// microtools://notesToFile/append
microtools.route('append', () => { append() })
