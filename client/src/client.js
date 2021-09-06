const consoleLog = async (logObj) => {
  await fetch('/consoleLog', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(logObj)
  });
}
$(() => {
  window.onerror = function errorHandler(msg, url, line) {
    consoleLog(arguments);
    // Just let default handler run.
    return false;
  }
  $('.eosinabox_help_header').on('click', ()=>{
    console.log('AMIHDEBUG toggle visibility?');
    consoleLog( { consoleLog: 'AMIHDEBUG toggle visibility?' });
    $('.eosinabox_help').toggle();
  })
  $('#eosinabox_accountName').on('input', (e) => {
    $('#eosinabox_accountName').val( $('#eosinabox_accountName').val().toLowerCase() );
    const len = $('#eosinabox_accountName').val().length;
    if(len > 12){
      $('#eosinabox_accountName').val( $('#eosinabox_accountName').val().substr(0,12) );
      len = $('#eosinabox_accountName').val().length;
    }
    $('#eosinabox_countAccountLen').html( (12-len) + ' more characters' );
    if(len == 12){
      $('#eosinabox_countAccountLen').html('Checking if the account name is available...');
      checkIfAccountNameIsAvailable( $('#eosinabox_accountName').val(), res => {
        if(res.accountAvailable){
          // alert('Account is available');
          $('#eosinabox_countAccountLen').html('Account is available');
        }else{
          // alert('Account is already taken, please try another name');
          $('#eosinabox_countAccountLen').html('Account is already taken, please try another name');
        }
      });
    }
  });
  $('#esinabox_check_availability').on('click', (event)=>{
    event.preventDefault();
    checkIfAccountNameIsAvailable( $('#eosinabox_accountName').val(), res => {
      if(res.accountAvailable){
        // alert('Account is available');
        $('#eosinabox_countAccountLen').html('Account is available');
      }else{
        // alert('Account is already taken, please try another name');
        $('#eosinabox_countAccountLen').html('Account is already taken, please try another name');
      }
    });
  });
  $('#eosinabox_custodianAccountName').on('input', (e) => {
    $('#eosinabox_custodianAccountName').val( $('#eosinabox_custodianAccountName').val().toLowerCase() );
    const len = $('#eosinabox_custodianAccountName').val().length;
    if(len > 12){
      $('#eosinabox_custodianAccountName').val( $('#eosinabox_custodianAccountName').val().substr(0,12) );
      len = $('#eosinabox_custodianAccountName').val().length;
    }
    $('#eosinabox_countCustodianAccountLen').html( (12-len) + ' more characters' );
    if(len == 12){
      $('#eosinabox_countCustodianAccountLen').html('Checking if the custodian account name exists...');
      checkIfAccountNameIsAvailable( $('#eosinabox_custodianAccountName').val(), res => {
        if(res.accountAvailable){
          // alert('Custodian Account does not exist, please try again');
          $('#eosinabox_countCustodianAccountLen').html('Custodian Account does not exist, please try again');
        }else{
          // alert('Custodian account found');
          $('#eosinabox_countCustodianAccountLen').html('Custodian account found');
        }
      });
    }
  });
  const checkIfAccountNameIsAvailable = (accToCheck, callback) => {
    if(accToCheck.length != 12){
      alert(`Account name should be 12 characters long, it is ${accToCheck.length}, try again`);
      consoleLog( { consoleLog: 'account length failed', accToCheck });
      return;
    }else if(!/^[a-z1-5]{12}$/.test(accToCheck)){
      alert('The account name contains illegal characters. Characters should be in the range: a-z or 1-5, please fix and try again.');
      consoleLog( { consoleLog: 'account validation failed', accToCheck });
      return;
    }
    consoleLog( { consoleLog: 'check if account name is available', accToCheck });
    fetch('/checkAvailability/' + accToCheck)
    .then(response => response.json())
    .then(data => {
      console.log('AMIHDEBUG res--data::', data);
      callback({ accountAvailable: !!data.available });
    })
    .catch((error) => {
      console.error('Error in FETCH:', error);
    });
  }
  $('#eosinbox_createKeys').on('click', async (event) => {
    event.preventDefault();
    const randomStringFromServer = 'sadfjhkjwebrkbwfekjbf'; // AMIHDEBUG TODO: generate random string on server and manage it in a session
    const rp = {
      name: "Ami Heines",
      id: "amiheines.com", // AMIHDEBUG TODO: update this when installing on another web site, e.g. eosinabox.com
    };
    const accName = $('#eosinabox_accountName').val();
    const publicKeyCredentialCreationOptions = {
      challenge: Uint8Array.from( randomStringFromServer, c => c.charCodeAt(0) ),
      rp: rp,
      user: {
        id: Uint8Array.from(
          accName, c => c.charCodeAt(0)),
        name: accName,
        displayName: accName,
      },
      pubKeyCredParams: [{alg: -7, type: "public-key"}],
      authenticatorSelection: {
        authenticatorAttachment: "platform", // cross-platform or platform or comment out for both
        // warning: we want to require AttestationFlags.attestedCredentialPresent - only works with platform
      },
      timeout: 60000,
      attestation: "none" // "direct" is not needed, why bother reading all the different types of attestations?
      // the authData contains the pubKey and we will *maybe* check the attestation later, in a future version
    };
    const credential = await navigator.credentials.create({
        publicKey: publicKeyCredentialCreationOptions
    });
    console.log('credential', credential);
    /////////////////////////////////////////
    // take the credentials and make an object to send to the server!
    // helper: eosjs_serialize.arrayToHex([12,32,11])
    const credForServer = {
      rpid: rp.id,
      id: eosjs_serialize.arrayToHex(new Uint8Array(credential.rawId)),
      attestationObject: eosjs_serialize.arrayToHex(new Uint8Array(credential.response.attestationObject)),
      clientDataJSON: eosjs_serialize.arrayToHex(new Uint8Array(credential.response.clientDataJSON)),
    }
    // // decode the clientDataJSON into a utf-8 string
    // const utf8Decoder = new TextDecoder('utf-8');
    // const decodedClientData = utf8Decoder.decode( credential.response.clientDataJSON );
    // const clientDataObj = JSON.parse(decodedClientData);
    // const decodedAttestationObj = CBOR.decode( credential.response.attestationObject );
    // const {authData} = decodedAttestationObj;
    // // get the length of the credential ID
    // const dataView = new DataView( new ArrayBuffer(2) );
    // const idLenBytes = authData.slice(53, 55);
    // idLenBytes.forEach( (value, index) => dataView.setUint8( index, value ) );
    // const credentialIdLength = dataView.getUint16();
    // const credentialId = authData.slice( 55, 55 + credentialIdLength); // get the credential ID
    // const publicKeyBytes = authData.slice( 55 + credentialIdLength ); // get the public key object
    // const publicKeyObject = CBOR.decode( publicKeyBytes.buffer ); // the publicKeyBytes are encoded again as CBOR
    // consoleLog({ msg: 'AMIHDEBUG credForServer:', credForServer });
    fetch('/getNewPubKey', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credForServer)
    })
    .then(response => response.json())
    .then(async data => {
      console.log('AMIHDEBUG did we get back the Pubkey from the server?', data);
      $('#eosinabox_pubkey').html(data.pubkey);
      await consoleLog( data );
    })
    .catch( err => {
      consoleLog(err);
    });
  });
  $('#eosinabox_prepareEsr').on('click', (event)=>{
    event.preventDefault();
    fetch('/prepareEsr', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        custodianAccountName: $('#eosinabox_custodianAccountName').val(),
        accountName:          $('#eosinabox_accountName').val(),
        pubkey:               $('#eosinabox_pubkey').html(),
      })
    })
    .then(response => response.json())
    .then(async data => {
      // $('#eosinabox_pubkey').html(data.pubkey);
      await consoleLog( { data, stage: 'amihDebug create ESR response in client...' } );
    })
    .catch( err => {
      consoleLog(err);
    });
  });
});
