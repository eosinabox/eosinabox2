/**
 * Required External Modules
 */
const express = require("express");
const path = require("path");
const { Api, JsonRpc, Serialize } = require('eosjs');
const fetch = require("node-fetch");
/**
 * App Variables
 */
const app = express();
const port = process.env.PORT || "8000";

/**
 *  App Configuration
 */

/**
 * Routes Definitions
 */
app.get("/client/src/client.js", (req, res) => {
  var p = path.join(__dirname, 'client/src', 'client.js');
  console.log('[AMIHDEBUG] PATH:::', p);
  res.sendFile(p);
});
app.get("/", (req, res) => {
  var p = path.join(__dirname, 'client/src', 'index.html');
  console.log('[AMIHDEBUG] PATH:::', p);
  res.sendFile(p);
  // res.status(200).send("WHATABYTE: Food For Devs");
});
app.get("/checkAvailability/:name", (req, res) => {
	const rpc = new JsonRpc('http://jungle3.cryptolions.io:80', { fetch }); // http://jungle3.cryptolions.io:80 https://jungle3.cryptolions.io:443
  // const api = new Api({ rpc, signatureProvider, textDecoder: new TextDecoder(), textEncoder: new TextEncoder() });
  console.log('AMIHDEBUG [checkAvail][name]', req.params.name);
  (async () => {
    try{
      console.log('AMIHDEBUG [checkAvail][name]-====>>>', req.params.name);
      var acc = await rpc.get_account(req.params.name);
      console.log('ACCOUNT:::', acc);
      res.status(200).send({ available: false });
    }
    catch(err){
      if(!!err.details && !!err.details[0].message && err.details[0].message.substr(0,11) == 'unknown key'){
        console.log('Account nt found - great news!!');
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
