// dateStamp: an example JavaScript plugin for microTools (see kit/docs/javascript.md).

function pad(n) { return (n < 10 ? '0' : '') + n }

function formatted(format) {
  const d = new Date()
  if (format === 'long') return d.toLocaleDateString(undefined, { day: 'numeric', month: 'long', year: 'numeric' })
  if (format === 'stamp') return `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}-${pad(d.getHours())}${pad(d.getMinutes())}`
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
}

function copy(format) {
  const text = formatted(format || microtools.setting('format'))
  microtools.writeClipboard(text)
  if (microtools.setting('notice')) microtools.notice(microtools.localized('Copied'), text)
}

microtools.register({
  start() { microtools.onShortcut('copy', () => copy()) },
  menu() {
    const current = microtools.setting('format')
    return [
      { title: microtools.localized('Copy Date'), symbol: 'doc.on.clipboard', action: () => copy() },
      { title: microtools.localized('Format'), submenu: ['iso', 'long', 'stamp'].map(f => ({
          title: formatted(f), checked: f === current, action: () => microtools.setSetting('format', f) })) }
    ]
  }
})

// microtools://dateStamp/copy?format=long, or microtools.call('dateStamp', 'copy', { format: 'long' }) from another plugin
microtools.route('copy', args => { copy(args.format); return formatted(args.format || microtools.setting('format')) })
