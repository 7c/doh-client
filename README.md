## DOH CLIENT (NodeJS)
NodeJS based Dns-Over-Https client implementation
## Install
`npm i -g https://github.com/7c/doh-client`
This will install doh-client as global executable

## Usage
`doh <hostname>`

## Options
```
Usage:
doh <hostname> [...parameters...]
        --type <rtype>          resource type to query, default 'A'
        --method <method>       request method,default 'POST'
        --server <url>          doh server,default 'https://ns3.com'
        --format <fmt>  output format, default 'json', available:'string'
```