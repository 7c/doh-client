#!/usr/bin/env node
const package = require('./package.json')
const chalk = require('chalk')
const argv = require('minimist')(process.argv.slice(2))
const doh = require('@sagi.io/dns-over-https')
const { promiseTimeout, showUsage, validRType, sorry } = require('./shared')

// DEFAULTS - they can be overwritten over cli parameters
let method = 'POST'
let hostname = 'ns3.com'
let path = '/'
let port = 443
let rtype = 'A'
let useHttps = true
let format = 'json'
let timeoutQuery = 5 // seconds

function doValidation() {
    if (argv.method && !['POST', 'GET'].includes(argv.method.toUpperCase())) sorry(`Unsupported method ${argv.method}, try 'post' or 'get'`)
    if (argv.server && !parseDOHServer(argv.server)) sorry(`Could not parse DOH Server '${argv.server}'`)
    if (argv.type && !validRType(argv.type)) sorry(`RType ${argv.type} is invalid`)
    if (argv.format && !['json', 'string', 'basic'].includes(argv.format)) sorry(`Invalid output format '${argv.format}, try 'json' or 'string'`)
    if (argv.timeout && !parseInt(argv.timeout) > 0) sorry(`Invalid query timeout`)
    method = argv.method ? argv.method : method
    rtype = argv.rtype ? argv.rtype.toUpperCase() : rtype
    format = argv.format ? argv.format : format
    timeoutQuery = argv.timeout ? parseInt(argv.timeout) : timeoutQuery
}



function parseDOHServer(input) {
    let parsed = new URL(input)

    if (parsed.hostname && parsed.pathname && parsed.protocol.search(/^http/) == 0) {
        hostname = parsed.hostname
        path = parsed.pathname
        if (parsed.port && parseInt(parsed.port) > 0) port = parseInt(parsed.post);
        else if (parsed.protocol === 'https:') port = 443;
        else if (parsed.protocol === 'http:') port = 80;
        if (parsed.protocol === 'https:') useHttps = true;
        if (parsed.protocol === 'http:') useHttps = false;
        return true
    }
    return false
}

function basicOutput(output) {
    // console.log(output)
    exitcode=0
    if (output.hasOwnProperty('err')) {
        if (typeof output.err === 'string')
            console.log(chalk.red(`Error:`), output.err, `for ${output.query.type} ${output.query.name}`)
        else
            console.log(chalk.red(`Error:`), output.err.code, `for ${output.query.type} ${output.query.name}`)
        exitcode=1
    } else
        if (output && output.hasOwnProperty('dohServer') && output.dohServer.hasOwnProperty('answers') && Array.isArray(output.dohServer.answers)) {
            let { dohServer } = output
            let { rcode, answers } = dohServer

            if (rcode === 'NOERROR')
            {
                for (let row of answers) {
                    if (typeof row.data === 'string')
                        console.log(`${row.name} ${row.class} ${chalk.blue(row.type)} ${chalk.yellow(row.data)}`)
                    else {
                        if (row.type === 'MX') {
                            console.log(`${row.name} ${row.class} ${chalk.blue(row.type)} ${row.data.preference} ${chalk.yellow(row.data.exchange)}`)
                        } else {
                            console.log(`${row.name} ${row.class} ${chalk.blue(row.type)}`, row.data)
                        }
                    }
                }
            }
            else {
                console.log(chalk.red(rcode),`for ${output.query.type} ${output.query.name}`)
                exitcode=2
            }
        }
    return exitcode
}

function handleOutput(output, exitcode = 0) {
    switch (format) {
        case "string": console.log(JSON.stringify(output)); break
        case "basic": exitcode = basicOutput(output); break
        default: console.dir(output, { depth: null }); break
    }
    process.exit(exitcode)
}

async function start() {
    var query
    try {
        if (argv.version) { console.log(package.version); process.exit(0) }
        let started = Date.now()
        doValidation()
        if (argv._.length !== 1) showUsage()
        query = {
            name: argv._[0],
            hostname,
            path,
            method: method.toUpperCase(),
            userAgent: argv.useragent ? argv.useragent : 'ns3-doh-client',
            type: rtype,
            port,
            klass: 'IN',
            useHttps
        }
        const dnsResponse = await promiseTimeout(timeoutQuery * 1000, doh.query(query))
        const output = {
            query,
            spent: Date.now() - started,
            dohServer:
                dnsResponse
        }
        handleOutput(output)
    } catch (err) {
        // error handling
        const output = { err, query }
        handleOutput(output, 1)
    }
}

start()