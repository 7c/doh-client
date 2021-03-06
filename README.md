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
        --rtype <rtype>          resource type to query, default 'A'
        --method <method>       request method,default 'POST'
        --server <url>          doh server,default 'https://ns3.com'
        --format <fmt>          output format, default 'json', available:'string','basic'
        
        --timeout <seconds>     query timeout, default: 5
        --useragent <ua>        sets user-agent for requests, default:'ns3-doh-client'
        --version               outputs the version of doh-client version
```

## BASIC Output
```
$ doh ns3.com --format basic
ns3.com IN A 142.93.50.149
ns3.com IN A 144.202.68.103
ns3.com IN A 66.42.82.132
ns3.com IN A 3.136.108.55
ns3.com IN A 104.238.182.24
ns3.com IN A 140.82.29.140
ns3.com IN A 104.207.138.237
ns3.com IN A 137.184.82.165
ns3.com IN A 45.77.163.166
$ doh ns3.com --format basic --rtype mx
ns3.com IN MX 50 mx3.zoho.com
ns3.com IN MX 20 mx2.zoho.com
ns3.com IN MX 10 mx.zoho.com
```

## JSON Output
output format can be changed with --format option

```
{
  query: {
    name: 'ns3.com',
    hostname: 'ns3.com',
    path: '/',
    method: 'POST',
    userAgent: 'ns3-doh-client',
    type: 'A',
    port: 443,
    klass: 'IN',
    useHttps: true
  },
  spent: 243,
  dohServer: {
    id: 0,
    type: 'response',
    flags: 384,
    flag_qr: true,
    opcode: 'QUERY',
    flag_aa: false,
    flag_tc: false,
    flag_rd: true,
    flag_ra: true,
    flag_z: false,
    flag_ad: false,
    flag_cd: false,
    rcode: 'NOERROR',
    questions: [ { name: 'ns3.com', type: 'A', class: 'IN' } ],
    answers: [
      {
        name: 'ns3.com',
        type: 'A',
        ttl: 300,
        class: 'IN',
        flush: false,
        data: '104.238.182.24'
      },
      {
        name: 'ns3.com',
        type: 'A',
        ttl: 300,
        class: 'IN',
        flush: false,
        data: '137.184.82.165'
      },
      {
        name: 'ns3.com',
        type: 'A',
        ttl: 300,
        class: 'IN',
        flush: false,
        data: '3.136.108.55'
      },
      {
        name: 'ns3.com',
        type: 'A',
        ttl: 300,
        class: 'IN',
        flush: false,
        data: '45.77.163.166'
      },
      {
        name: 'ns3.com',
        type: 'A',
        ttl: 300,
        class: 'IN',
        flush: false,
        data: '104.207.138.237'
      },
      {
        name: 'ns3.com',
        type: 'A',
        ttl: 300,
        class: 'IN',
        flush: false,
        data: '142.93.50.149'
      },
      {
        name: 'ns3.com',
        type: 'A',
        ttl: 300,
        class: 'IN',
        flush: false,
        data: '66.42.82.132'
      },
      {
        name: 'ns3.com',
        type: 'A',
        ttl: 300,
        class: 'IN',
        flush: false,
        data: '144.202.68.103'
      },
      {
        name: 'ns3.com',
        type: 'A',
        ttl: 300,
        class: 'IN',
        flush: false,
        data: '140.82.29.140'
      },
      {
        name: 'ns3.com',
        type: 'A',
        ttl: 300,
        class: 'IN',
        flush: false,
        data: '54.219.166.243'
      }
    ],
    authorities: [],
    additionals: []
  }
}
```
