#!/usr/bin/env node

const chalk = require('chalk')
const argv = require('minimist')(process.argv.slice(2))
const doh = require('@sagi.io/dns-over-https')

// DEFAULTS - they can be overwritten over cli parameters
let method='POST'
let hostname='ns3.com'
let path='/'
let port=443
let rtype='A'
let useHttps=true
let format='json'

const rtypes = {'65':"HTTPS",'1':"A",'38':"A6",'28':"AAAA",'65400':"ADDR",'18':"AFSDB",'65401':"ALIAS",'255':"ANY",'252':"AXFR",'257':"CAA",'60':"CDNSKEY",'59':"CDS",'37':"CERT",'5':"CNAME",'49':"DHCID",'32769':"DLV",'39':"DNAME",'48':"DNSKEY",'43':"DS",'108':"EUI48",'109':"EUI64",'13':"HINFO",'45':"IPSECKEY",'251':"IXFR",'25':"KEY",'36':"KX",'29':"LOC",'254':"MAILA",'253':"MAILB",'14':"MINFO",'9':"MR",'15':"MX",'35':"NAPTR",'2':"NS",'47':"NSEC",'50':"NSEC3",'51':"NSEC3PARAM",'61':"OPENPGPKEY",'41':"OPT",'12':"PTR",'57':"RKEY",'17':"RP",'46':"RRSIG",'24':"SIG",'6':"SOA",'99':"SPF",'33':"SRV",'44':"SSHFP",'249':"TKEY",'52':"TLSA",'250':"TSIG",'16':"TXT",'256':"URI",'11':"WKS"}

function showUsage() {
    console.log(chalk.yellow.inverse('Usage:'))
    console.log(chalk.bold(`node doh.js <hostname> [...parameters...]`))
    console.log(chalk.gray(`\t--type <rtype>\t\tresource type to query, default 'A'`))
    console.log(chalk.gray(`\t--method <method>\trequest method,default 'POST'`))
    console.log(chalk.gray(`\t--server <url>\t\tdoh server,default 'https://ns3.com'`))
    console.log(chalk.gray(`\t--format <fmt>\toutput format, default 'json', available:'string'`))
    process.exit(0)
}


function doValidation() {
    if (argv.method && !['POST', 'GET'].includes(argv.method.toUpperCase())) sorry(`Unsupported method ${argv.method}, try 'post' or 'get'`)
    if (argv.server && !parseDOHServer(argv.server)) sorry(`Could not parse DOH Server '${argv.server}'`)
    if (argv.type && !validRType(argv.type)) sorry(`RType ${argv.type} is invalid`)
    if (argv.format && !['json','string'].includes(argv.format)) sorry(`Invalid output format '${argv.format}, try 'json' or 'string'`)
    method=argv.method ? argv.method : 'POST'
    rtype=argv.rtype ? argv.rtype.toUpperCase() : 'A'
    format=argv.format ? argv.format : 'json'
}


function validRType(rtype) {
    for(let code of Object.keys(rtypes))
        if (rtypes[code].toLowerCase()===rtype.toLowerCase()) return parseInt(code)
    return false
}

function sorry(msg) {
    console.log(`sorry: ${msg}`)
    process.exit(1)
}

function parseDOHServer(input) {
    let parsed = new URL(input)

    if (parsed.hostname && parsed.pathname && parsed.protocol.search(/^http/)==0) {
        hostname = parsed.hostname
        path = parsed.pathname
        if (parsed.port && parseInt(parsed.port)>0) port=parseInt(parsed.post); 
            else if (parsed.protocol==='https:') port=443; 
            else if (parsed.protocol==='http:') port=80; 
        if (parsed.protocol==='https:') useHttps=true;
        if (parsed.protocol==='http:') useHttps=false;
        return true
    }
    return false
}



async function start() {
    var query
    try {
        let started = Date.now()
        doValidation()
        if (argv._.length!==1) showUsage()
        query = {
            name: argv._[0],
            hostname,
            path,
            method:method.toUpperCase(),
            userAgent:argv.useragent ? argv.useragent : 'ns3-doh-client',
            type:rtype,
            port,
            klass:'IN',
            useHttps
        }
        const dnsResponse = await doh.query(query)
        const output = {
            query,
            spent:Date.now()-started,
            dohServer:
            dnsResponse
        }

        if (format==='json') console.dir(output, { depth: null })
        else console.log(JSON.stringify(output))
    } catch (err) {
        const output = {err,query}
        if (format==='json') console.dir(output, { depth: null })
            else console.log(JSON.stringify(output))
        process.exit(1)
    }
}

start()