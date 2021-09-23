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
 // TODO: add dotEnv for external config items
 // http://jungle3.cryptolions.io:80 https://jungle3.cryptolions.io:443
 // from https://cryptolions.io/bp.json
 // http://api.eos.cryptolions.io", "ssl_endpoint": "https://api.eos.cryptolions.io",
const chain = {
  jungle3: 'http://jungle3.cryptolions.io:80',
  eos    : 'http://api.eos.cryptolions.io',
}

/**
 * Routes Definitions
 */
app.get("/", (req, res) => {
  res.sendFile( path.join(__dirname, 'client/src', 'index.html') );
});
app.get("/client/src/:filename", (req, res) => {
  res.sendFile( path.join(__dirname, 'client/src', req.params.filename) );
});
app.get("/client/src/eosjs/dist-web/:filename", (req, res) => {
  res.sendFile( path.join(__dirname, 'client/src/eosjs/dist-web', req.params.filename) );
});
app.post("/consoleLog", (req, res) => {
  console.log('[consoleLog][headers]:', req.headers['x-real-ip'] + '; ' + req.headers['user-agent'] + '; ' +   req.headers['referer'] + '; ' +   req.headers['origin'] + '; ');
  console.log('[consoleLog]:::', JSON.stringify(req.body, null, 2));
  res.status(200).send("ok");
});
app.post("/getNewPubKey", async (req, res) => {
  try {
    console.log('AMIHDEBUG getNewPubKey [0] req.body.rpid, req.body.id:', req.body.rpid, req.body.id);
    // https://medium.com/webauthnworks/verifying-fido2-responses-4691288c8770
    // User information is stored in authData. AuthData is a rawBuffer struct:
    // len / runningTotal
    //  32 / 32: RPID hash, hash of the rpId which is basically the effective domain or host
    //   1 / 33: flags, State of authenticator during authentication. Bits 0 and 2 are User Presence and User Verification flags. Bit 6 is AT(Attested Credential Data). Must be set when attestedCredentialData is presented. Bit 7 must be set if extension data is presented.
    //   4 / 37: counter
    //        AttestedCredentialData:
    //  16 / 53: AAGUID
    //   2 / 55: CredID Len
    //   X / 55+X: CredID
    //  77: COSE PubKey
    const utf8Decoder = new TextDecoder('utf-8');
    const decodedClientData = utf8Decoder.decode( Serialize.hexToUint8Array(req.body.clientDataJSON) );
    const clientDataObj = JSON.parse(decodedClientData);
    console.log('AMIHDEBUG getNewPubKey [1] clientDataObj:', clientDataObj);
    const decodedAttestationObj = cbor.decode( req.body.attestationObject );
    console.log('AMIHDEBUG getNewPubKey [2] attestationObj:', decodedAttestationObj );
    const {authData} = decodedAttestationObj;
    const flagsFromAuthData = (new Uint8Array(authData.slice(32,33)))[0];
    const AttestationFlags = {
      userPresent: 0x01,
      userVerified: 0x04,
      attestedCredentialPresent: 0x40,
      extensionDataPresent: 0x80,
    }
    const flagsToPresence = (flags) => {
      if (flags & AttestationFlags.userVerified)
        return 2; // UserPresence.verified
      else if (flags & AttestationFlags.userPresent)
        return 1; // UserPresence.present
      else
        return 0; // UserPresence.none
    }
    const flagsToPresenceResult = flagsToPresence(flagsFromAuthData);
    console.log('AMIHDEBUG flagsToPresenceResult:', flagsToPresenceResult);
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
    ser.push(flagsToPresenceResult); // enum UserPresence {none = 0,present = 1,verified = 2}
    ser.pushString(req.body.rpid);
    const compact = ser.asUint8Array();
    const key = Numeric.publicKeyToString({
        type: Numeric.KeyType.wa,
        data: compact,
    });
    console.log('AMIHDEBUG [6] key: ', key)
    // res.status(200).send({pubkey: key, x: JSON.stringify(x), y: JSON.stringify(y)});
    res.status(200).send({ pubkey: key });
  } catch (error) {
    console.log('error in [getNewPubKey]', error)
    res.status(200).send({ msg: 'error in getNewPubKey' });
  }
});
// const jungle3testnet = '2a02a0053e5a8cf73a56ba0fda11e4d92e0238a4a2aa74fccf46d5a910746840';
// app.post("/prepareEsr", (req, res) => {
//   try{
//     const rpc = new JsonRpc(chain[req.params.chain], { fetch });
//     const textEncoder = new TextEncoder();
//     const textDecoder = new TextDecoder();
//     const api = new Api({ rpc, textDecoder, textEncoder });
//     const opts = {
//       textEncoder,
//       textDecoder,
//       zlib: {
//         deflateRaw: (data) => new Uint8Array(zlib.deflateRawSync(Buffer.from(data))),
//         inflateRaw: (data) => new Uint8Array(zlib.inflateRawSync(Buffer.from(data))),
//       },
//       abiProvider: {
//         getAbi: async (account) => (await api.getAbi(account))
//       }
//     }
//     console.log('AMIHDEBUG esr, req body::', req.body);
//     /////////////////////////////////////////////////////////////////////////////////
//     async function main() {
//       console.log('[main][0]');
//       const actions = [
//         {
//           "account": "eosio",
//           "name": "newaccount",
//           "authorization": [{
//             "actor": "............1",
//             "permission": "............2"
//           }],
//           "data": {
//             "creator": "............1",
//             "name": req.body.accountName,
//             "owner": {
//               "threshold": 1,
//               "keys": [],
//               "accounts": [{
//               "permission": {
//                 "actor": req.body.custodianAccountName,
//                 "permission": "active"
//               },
//               "weight": 1
//               }],
//               "waits": []
//             },
//             "active": {
//               "threshold": 1,
//               "keys": [{
//                 // "key": "EOS59RyoSWy4Gq8GJQYEVABj974cYaVo7Z7UcL8AK4Hsjg9p2Gu2i",// TODO: AMIHDEBUG temporary replaced with old type of pubkey just for testing...//req.body.pubkey,
//                 "key": req.body.pubkey,
//                 "weight": 1
//               }],
//               "accounts": [],
//               "waits": []
//             }
//             },
//           },
//           {
//             "account": "eosio",
//             "name": "buyrambytes",
//             "authorization": [{
//             "actor": "............1",
//             "permission": "............2"
//           }],
//           "data": {
//             "payer": "............1",
//             "receiver": req.body.accountName,
//             "bytes": 3200
//           },
//         },
//         {
//           "account": "eosio",
//           "name": "delegatebw",
//           "authorization": [{
//             "actor": "............1",
//             "permission": "............2"
//           }],
//           "data": {
//             "from": "............1",
//             "receiver": req.body.accountName,
//             "stake_net_quantity": "0.0100 EOS",
//             "stake_cpu_quantity": "0.0100 EOS",
//             "transfer": 0
//           },
//         }
//         // ,
//         // {
//         //   "account": "eosio.token",
//         //   "name": "transfer",
//         //   "authorization": [{
//         //   "actor": "............1",
//         //   "permission": "............2"
//         // }],
//         // "data": {
//         //   "from": "............1",
//         //   "to": req.params.accountname,
//         //   "quantity": req.params.initialamount + ' EOS',
//         //   "memo": configFile.siteHeader
//         // }
//         // }
//       ];
//       console.log('[main][1] actions:::', JSON.stringify(actions, null, 2));
//       const request = await SigningRequest.create({ actions, chainId: '2a02a0053e5a8cf73a56ba0fda11e4d92e0238a4a2aa74fccf46d5a910746840' }, opts);
//       const uri = request.encode();
//       console.log(`\n[AMIHDEBUG][request ESR:::][URI]: ${ uri }`)
//       res.status(200).send({ esr: uri });
//     }
//     main().catch(console.error)  
//     /////////////////////////////////////////////////////////////////////////////////
//   } catch(err){
//     console.log('Err in server_prepareEsr:', err);
//   }
// });
// app.get("/checkAvailability/:chain/:name", (req, res) => {
//   const rpc = new JsonRpc(chain[req.params.chain], { fetch });
//   // const api = new Api({ rpc, signatureProvider, textDecoder: new TextDecoder(), textEncoder: new TextEncoder() });
//   (async () => {
//     try{
//       var acc = await rpc.get_account(req.params.name);
//       console.log('ACCOUNT:::', acc);
//       res.status(200).send({ available: false });
//     }
//     catch(err){
//       if(!!err.details && !!err.details[0].message && err.details[0].message.substr(0,11) == 'unknown key'){
//         console.log('Account not found - great news!!');
//         res.status(200).send({ available: true });
//       }else{
//         console.log('AMIHDEBUG error, account not found??', err);
//         res.status(200).send({ available: false });
//       }
//     }
//   })();
// });
app.get("/getCurrencyBalance/:chain/:code/:account/:symbol", (req, res) => {
  const rpc = new JsonRpc(chain[req.params.chain], { fetch });
  (async () => {
    try{
      var response = await rpc.get_currency_balance(req.params.code, req.params.account, req.params.symbol);
      console.log('ACCOUNT:::', response);
      res.status(200).send(response);
    }
    catch(err){
      console.log('AMIHDEBUG [getCurrencyBalance] error', err);
      res.status(200).send({ errMsg: 'getCurrencyBalance', err });
    }
  })();
});
app.get("/getAccountInfo/:chain/:account", (req, res) => {
  const rpc = new JsonRpc(chain[req.params.chain], { fetch });
  (async () => {
    try{
      var response = await rpc.get_account(req.params.account);
      console.log('ACCOUNT[getAccountInfo]:::', response);
      res.status(200).send(response);
    }
    catch(err){
      console.log('AMIHDEBUG [getAccountInfo] error', err);
      res.status(200).send({ errMsg: 'getAccountInfo', err });
    }
  })();
});
/**
 * Server Activation
 */
app.listen(port, () => {
  console.log(`Listening to requests on http://localhost:${port}`);
});
