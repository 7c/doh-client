## DOH CLIENT (NodeJS)
NodeJS based Dns-Over-Https client implementation

## Usage
`node doh.js <hostname>`

## Options
```
Usage:
node doh.js <hostname> [...parameters...]
        --type <rtype>          resource type to query, default 'A'
        --method <method>       request method,default 'POST'
        --server <url>          doh server,default 'https://ns3.com'
        --format <fmt>  output format, default 'json', available:'string'
```