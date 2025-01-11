import WebTorrent from "webtorrent"

const trackerUrls = [
  'udp://localhost:9000',
  // 'http://localhost:8000',
  // 'http://[::1]:8000'
]
const options = {
  announce: trackerUrls,
  dht: false,
  localPeerDiscovery: false,
}
const file = new File(['Hello Torrent!'], 'test-torrent.txt', { type: 'text/plain' })

// SEED
const seedClient = new WebTorrent()
console.log('starting...')
seedClient.seed(file, options, (torrent) => {
  console.log('seeding: ', torrent.infoHash)
  console.log('magnet uri: ', torrent.magnetURI)

  torrent.on('upload', (bytes) => {
    console.log('uploaded: ', bytes)
  })

  torrent.on('wire', (wire) => {
    console.log('connected to peer: ', wire.remoteAddress)
  })

  // DOWNLOAD
  setTimeout(() => {
    const magnetURI = torrent.magnetURI

    const downloadClient = new WebTorrent()
    downloadClient.add(magnetURI, options, (downloadTorrent) => {
      console.log('downloading torrent: ', downloadTorrent.infoHash)

      downloadTorrent.on('download', (bytes) => {
        console.log(`downloaded: ${bytes} bytes`)
        console.log(`progress: ${Math.round(downloadTorrent.progress * 100)}%`)
      })

      downloadTorrent.on('done', () => {
        console.log('download complete!');
        downloadTorrent.files.forEach((file) => {
          console.log(file.name)
          // file.getBuffer((err, buffer) => {
          //   if (err) {
          //     console.error('error:', err);
          //   } else {
          //     console.log('downloaded content:', buffer.toString());
          //   }
          // });
        })
        downloadClient.destroy(() => {
          seedClient.destroy(() => {
            console.log('done!')
            process.exit(0)
          })
        })
      })
    })
  }, 5000)
})
