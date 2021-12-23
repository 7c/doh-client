const chalk = require('chalk')
const rtypes = {'65':"HTTPS",'1':"A",'38':"A6",'28':"AAAA",'65400':"ADDR",'18':"AFSDB",'65401':"ALIAS",'255':"ANY",'252':"AXFR",'257':"CAA",'60':"CDNSKEY",'59':"CDS",'37':"CERT",'5':"CNAME",'49':"DHCID",'32769':"DLV",'39':"DNAME",'48':"DNSKEY",'43':"DS",'108':"EUI48",'109':"EUI64",'13':"HINFO",'45':"IPSECKEY",'251':"IXFR",'25':"KEY",'36':"KX",'29':"LOC",'254':"MAILA",'253':"MAILB",'14':"MINFO",'9':"MR",'15':"MX",'35':"NAPTR",'2':"NS",'47':"NSEC",'50':"NSEC3",'51':"NSEC3PARAM",'61':"OPENPGPKEY",'41':"OPT",'12':"PTR",'57':"RKEY",'17':"RP",'46':"RRSIG",'24':"SIG",'6':"SOA",'99':"SPF",'33':"SRV",'44':"SSHFP",'249':"TKEY",'52':"TLSA",'250':"TSIG",'16':"TXT",'256':"URI",'11':"WKS"}


const promiseTimeout = function (ms, promise) {
    // Create a promise that rejects in <ms> milliseconds
    let timeout = new Promise((resolve, reject) => {
        let id = setTimeout(() => {
            clearTimeout(id);
            reject('TIMEDOUT')
        }, ms)
    })

    // Returns a race between our timeout and the passed in promise
    return Promise.race([
        promise,
        timeout
    ])
}

function validRType(rtype) {
    for(let code of Object.keys(rtypes))
        if (rtypes[code].toLowerCase()===rtype.toLowerCase()) return parseInt(code)
    return false
}

function showUsage() {
    console.log(chalk.yellow.inverse('Usage:'))
    console.log(chalk.bold(`doh <hostname> [...parameters...]`))
    console.log(chalk.gray(`\t--type <rtype>\t\tresource type to query, default 'A'`))
    console.log(chalk.gray(`\t--method <method>\trequest method,default 'POST'`))
    console.log(chalk.gray(`\t--server <url>\t\tdoh server,default 'https://ns3.com'`))
    console.log(chalk.gray(`\t--format <fmt>\toutput format, default 'json', available:'string','basic'`))
    console.log(chalk.gray(`\t--timeout <seconds>\tquery timeout, default:5`))
    console.log(chalk.gray(`\t--useragent <ua>\tsets user-agent, default:'ns3-doh-client'`))
    process.exit(0)
}


function sorry(msg) {
    console.log(`sorry: ${msg}`)
    process.exit(1)
}

module.exports = {
    promiseTimeout,
    sorry,
    validRType,
    showUsage
}