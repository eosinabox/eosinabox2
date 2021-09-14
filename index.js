/**
 * Required External Modules
 */
const express = require("express");
const path = require("path");
const cbor = require("cbor");
const { Api, JsonRpc, Serialize, Numeric } = require('eosjs');
const fetch = require("node-fetch");
const bodyParser = require('body-parser');
const { SigningRequest } = require("eosio-signing-request");
const zlib = require('zlib');
/**
 * App Variables
 */
const app = express();

app.use( bodyParser.json() );                       // to support JSON-encoded bodies
// app.use(bodyParser.urlencoded({ extended: true })); // to support URL-encoded bodies 

const port = process.env.PORT || "8000";

/**
 *  App Configuration
 */

/**
 * Routes Definitions
 */
app.get("/client/src/eosjs/dist-web/:filename", (req, res) => {
  res.sendFile( path.join(__dirname, 'client/src/eosjs/dist-web', req.params.filename) );
});
app.get("/client/src/:filename", (req, res) => {
  res.sendFile( path.join(__dirname, 'client/src', req.params.filename) );
});
app.post("/consoleLog", (req, res) => {
  console.log('[consoleLog]:::', JSON.stringify(req.body, null, 2));
  console.log('[consoleLog][headers]:', JSON.stringify(req.headers, null, 2));
  res.status(200).send("ok");
});
app.post("/getNewPubKey", async (req, res) => {
  try {
    console.log('AMIHDEBUG getNewPubKey [0] req.body.rpid:', req.body.rpid);
    console.log('AMIHDEBUG getNewPubKey [0] req.body.id:', req.body.id);
    console.log('AMIHDEBUG getNewPubKey [0] req.body.attestationObject.substr(0,80):', req.body.attestationObject.substr(0,180));
    console.log('AMIHDEBUG getNewPubKey [0] req.body.clientDataJSON.substr(0,80):', req.body.clientDataJSON.substr(0,180));
    // // decode the clientDataJSON into a utf-8 string
    // https://medium.com/webauthnworks/verifying-fido2-responses-4691288c8770
    const utf8Decoder = new TextDecoder('utf-8');
    const decodedClientData = utf8Decoder.decode( Serialize.hexToUint8Array(req.body.clientDataJSON) );
    const clientDataObj = JSON.parse(decodedClientData);
    console.log('AMIHDEBUG getNewPubKey [1] clientDataObj:', clientDataObj);
    const decodedAttestationObj = cbor.decode( req.body.attestationObject );
    console.log('AMIHDEBUG getNewPubKey [2] attestationObj:', decodedAttestationObj );
    const {authData} = decodedAttestationObj;
    ////////////////////////////////////////
    const flags = authData.slice(33,34);
    console.log('AMIHDEBUG flags: ', flags);
    const uint8AuthData = new Uint8Array(authData);
    console.log('AMIHDEBUG uint8AuthData: ', uint8AuthData);
    const uint8Flags = new Uint8Array(authData.slice(32,33));
    console.log('AMIHDEBUG uint8Flags: ', uint8Flags);
    console.log('AMIHDEBUG uint8Flags[0]: ', uint8Flags[0]);
    // console.log('AMIHDEBUG flags BINARY: ', (flags).toString(2));
    ////////////////////////////////////////
    // get the length of the credential ID
    const dataView = new DataView( new ArrayBuffer(2) );
    const idLenBytes = authData.slice(53, 55);
    idLenBytes.forEach( (value, index) => dataView.setUint8( index, value ));
    const credentialIdLength = dataView.getUint16();
    const credentialId = authData.slice( 55, 55 + credentialIdLength); // get the credential ID
    const publicKeyBytes = authData.slice( 55 + credentialIdLength ); // get the public key object
    const pubKey = cbor.decode( publicKeyBytes); // the publicKeyBytes are encoded again as CBOR
    console.log('AMIHDEBUG getNewPubKey [5] pubKey:', pubKey);
    if (pubKey.get(1) !== 2){
      throw new Error('Public key is not EC2');
    }
    if (pubKey.get(3) !== -7){
      throw new Error('Public key is not ES256');
    }
    if (pubKey.get(-1) !== 1){
      throw new Error('Public key has unsupported curve');
    }
    const x = pubKey.get(-2);
    const y = pubKey.get(-3);
    if (x.length !== 32 || y.length !== 32){
      throw new Error('Public key has invalid X or Y size');
    }
    const ser = new Serialize.SerialBuffer({textEncoder: new TextEncoder(), textDecoder: new TextDecoder()});
    ser.push((y[31] & 1) ? 3 : 2);
    ser.pushArray(x);
    ser.push( 1); // enum UserPresence {none = 0,present = 1,verified = 2}
    ser.pushString(req.body.rpid);
    const compact = ser.asUint8Array();
    const key = Numeric.publicKeyToString({
        type: Numeric.KeyType.wa,
        data: compact,
    });
    console.log('AMIHDEBUG [6] key: ', key)
    res.status(200).send({pubkey: key, x: JSON.stringify(x), y: JSON.stringify(y)});
    ////////////////////////////////////////////////////////////////////////////////
    // var AttestationFlags;
    // (function (AttestationFlags) {
    ////////////////////////////////////////////////////////////////////////////////
  } catch (error) {
    console.log('error in [getNewPubKey]', error)
    res.status(200).send({ msg: 'error in getNewPubKey' });
  }
});
app.get("/", (req, res) => {
  var p = path.join(__dirname, 'client/src', 'index.html');
  console.log('[AMIHDEBUG] PATH:::', p);
  res.sendFile(p);
  // res.status(200).send("WHATABYTE: Food For Devs");
});
const jungle3testnet = '2a02a0053e5a8cf73a56ba0fda11e4d92e0238a4a2aa74fccf46d5a910746840';
app.post("/prepareEsr", (req, res) => {
  try{
    const rpc = new JsonRpc('http://jungle3.cryptolions.io:80', { fetch }); // http://jungle3.cryptolions.io:80 https://jungle3.cryptolions.io:443
    const textEncoder = new TextEncoder();
    const textDecoder = new TextDecoder();
    const api = new Api({ rpc, textDecoder, textEncoder });
    const opts = {
      textEncoder,
      textDecoder,
      zlib: {
        deflateRaw: (data) => new Uint8Array(zlib.deflateRawSync(Buffer.from(data))),
        inflateRaw: (data) => new Uint8Array(zlib.inflateRawSync(Buffer.from(data))),
      },
      abiProvider: {
        getAbi: async (account) => (await api.getAbi(account))
      }
    }
    console.log('AMIHDEBUG esr, req body::', req.body);
    /////////////////////////////////////////////////////////////////////////////////
    async function main() {
      console.log('[main][0]');
      const actions = [
        {
          "account": "eosio",
          "name": "newaccount",
          "authorization": [{
            "actor": "............1",
            "permission": "............2"
          }],
          "data": {
            "creator": "............1",
            "name": req.body.accountName,
            "owner": {
              "threshold": 1,
              "keys": [],
              "accounts": [{
              "permission": {
                "actor": req.body.custodianAccountName,
                "permission": "active"
              },
              "weight": 1
              }],
              "waits": []
            },
            "active": {
              "threshold": 1,
              "keys": [{
                // "key": "EOS59RyoSWy4Gq8GJQYEVABj974cYaVo7Z7UcL8AK4Hsjg9p2Gu2i",// TODO: AMIHDEBUG temporary replaced with old type of pubkey just for testing...//req.body.pubkey,
                "key": req.body.pubkey,
                "weight": 1
              }],
              "accounts": [],
              "waits": []
            }
            },
          },
          {
            "account": "eosio",
            "name": "buyrambytes",
            "authorization": [{
            "actor": "............1",
            "permission": "............2"
          }],
          "data": {
            "payer": "............1",
            "receiver": req.body.accountName,
            "bytes": 3200
          },
        },
        {
          "account": "eosio",
          "name": "delegatebw",
          "authorization": [{
            "actor": "............1",
            "permission": "............2"
          }],
          "data": {
            "from": "............1",
            "receiver": req.body.accountName,
            "stake_net_quantity": "0.0100 EOS",
            "stake_cpu_quantity": "0.0100 EOS",
            "transfer": 0
          },
        }
        // ,
        // {
        //   "account": "eosio.token",
        //   "name": "transfer",
        //   "authorization": [{
        //   "actor": "............1",
        //   "permission": "............2"
        // }],
        // "data": {
        //   "from": "............1",
        //   "to": req.params.accountname,
        //   "quantity": req.params.initialamount + ' EOS',
        //   "memo": configFile.siteHeader
        // }
        // }
      ];
      console.log('[main][1] actions:::', JSON.stringify(actions, null, 2));
      const request = await SigningRequest.create({ actions, chainId: '2a02a0053e5a8cf73a56ba0fda11e4d92e0238a4a2aa74fccf46d5a910746840' }, opts);
      const uri = request.encode();
      console.log(`\n[AMIHDEBUG][request ESR:::][URI]: ${ uri }`)
      res.status(200).send({ esr: uri });
    }
    main().catch(console.error)  
    /////////////////////////////////////////////////////////////////////////////////
  } catch(err){
    console.log('Err in server_prepareEsr:', err);
  }
});
app.get("/checkAvailability/:name", (req, res) => {
  const rpc = new JsonRpc('http://jungle3.cryptolions.io:80', { fetch }); // http://jungle3.cryptolions.io:80 https://jungle3.cryptolions.io:443
  // const api = new Api({ rpc, signatureProvider, textDecoder: new TextDecoder(), textEncoder: new TextEncoder() });
  (async () => {
    try{
      console.log('AMIHDEBUG [checkAvail][name]-====>>>', req.params.name);
      var acc = await rpc.get_account(req.params.name);
      console.log('ACCOUNT:::', acc);
      res.status(200).send({ available: false });
    }
    catch(err){
      if(!!err.details && !!err.details[0].message && err.details[0].message.substr(0,11) == 'unknown key'){
        console.log('Account not found - great news!!');
        res.status(200).send({ available: true });
      }else{
        console.log('AMIHDEBUG error, account not found??', err);
        res.status(200).send({ available: false });
      }
    }
  })();
});
/**
 * Server Activation
 */
app.listen(port, () => {
  console.log(`Listening to requests on http://localhost:${port}`);
});
