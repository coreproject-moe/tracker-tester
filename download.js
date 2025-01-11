import WebTorrent from "webtorrent"

const client = new WebTorrent()
const magnetURI = process.argv[2]

if (!magnetURI) {
  console.error('magnet-uri not found!')
  process.exit(1)
}

client.add(magnetURI, (torrent) => {
  console.log('downloading: ', torrent.name)
  console.log('saving to: ', torrent.path)

  torrent.on('download', () => {
    console.log('downloaded: ', torrent.downloaded / torrent.length, ' bytes')
    console.log('speed: ', (torrent.downloadSpeed / 1024).toFixed(2), 'KB/s')
    console.log('progress: ', (torrent.progress * 100).toFixed(2), '%')
  })

  torrent.on('done', () => {
    console.log('download complete: ', torrent.path)
    process.exit(0)
  })
})

client.on('error', (err) => {
  console.error('error: ', err.message)
})
