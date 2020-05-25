const importer = require('ipfs-unixfs-importer')

// Import path /tmp/foo/bar
const source = [{
  path: '/tmp/foo/bar',
  content: fs.createReadStream(file)
}]

async function main() {
    // You need to create and pass an ipld-resolve instance
    // https://github.com/ipld/js-ipld-resolver
    for await (const entry of importer(source, ipld, options)) {
      console.info(entry)
    }
}

main();