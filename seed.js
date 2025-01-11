import WebTorrent from "webtorrent"

const client = new WebTorrent()
const filePath = process.argv[2] || './seed-file.txt'

const trackerUrls = [
  // 'udp://127.0.0.1:8000',
  'udp://[::1]:8000',
  // 'http://127.0.0.1:9000',
  // 'http://[::1]:9000',
]
const options = {
  announce: trackerUrls,
  // dht: false,
  // localPeerDiscovery: false,
}

client.seed(filePath, options, (torrent) => {
  console.log('seeding file: ', filePath)
  console.log('magnet uri: ', torrent.magnetURI)
  console.log('tracker being used: ', torrent["announce-list"])
  console.log('trackers being used: ', torrent.announce)
  console.log('info hash: ', torrent.infoHash)
  console.log('waiting for peers to connect...')

  torrent.on('wire', (_, addr) => {
    console.log('peer connected: ', addr)
  })

  torrent.on('upload', (bytes) => {
    console.log('uploaded: ', bytes)
  })
})

client.on('error', (err) => {
  console.error('error: ', err.message)
})
