var gState = {
  accountName: false,
  custodianAccountName: false,
  pubkey: false,
  esr: ''
};
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
          gState.accountName = true;
          $('#eosinabox_countAccountLen').html('Account is available');
        }else{
          // alert('Account is already taken, please try another name');
          gState.accountName = false;
          $('#eosinabox_countAccountLen').html('Account is already taken, please try another name');
        }
      });
    }
    checkIfAllConditionsMet();
  });
  $('#esinabox_check_availability').on('click', (event)=>{
    event.preventDefault();
    checkIfAccountNameIsAvailable( $('#eosinabox_accountName').val(), res => {
      if(res.accountAvailable){
        // alert('Account is available');
        gState.accountName = true;
        $('#eosinabox_countAccountLen').html('Account is available');
      }else{
        // alert('Account is already taken, please try another name');
        gState.accountName = false;
        $('#eosinabox_countAccountLen').html('Account is already taken, please try another name');
      }
      checkIfAllConditionsMet();
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
          gState.custodianAccountName = false;
          $('#eosinabox_countCustodianAccountLen').html('Custodian Account does not exist, please try again');
        }else{
          // alert('Custodian account found');
          gState.custodianAccountName = true;
          $('#eosinabox_countCustodianAccountLen').html('Custodian account found');
        }
      });
    }
    checkIfAllConditionsMet();
  });
  const checkIfAllConditionsMet = () => {
    // if there's a new account name, an existing custodian name and a public key, hide the create key button and show the prepareEsr key
    if(gState.accountName && gState.custodianAccountName && gState.pubkey){
      $('#eosinbox_createKeys' ).hide();
      // $('#eosinabox_prepareEsr').show();
      $('#eosinabox_share').show();
    }else{
      $('#eosinbox_createKeys' ).show();
      // $('#eosinabox_prepareEsr').hide();
      $('#eosinabox_share').hide();
    }
  }
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
    // AMIHDEBUG TODO: generate random string on server and manage it in a session,
    // Perhaps this is not needed, not worried about replay attacks, discuss...
    const randomStringFromServer = 'sadfjhkjwebrkbwfekjbf';
    const rp = {
      name: "Ami Heines",
      id: "amiheines.com", // AMIHDEBUG TODO: update this when installing on another web site, e.g. eosinabox.com (move out to a config .json file?)
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
        // TODO: discuss, perhaps this is not needed, it's up to the user to keep his security level,
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
    // // TODO: discuss, perhaps there is no need to do this on the server side, we can do most
    // // of the processing on the front end.
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
      gState.pubkey = true;
      $('#eosinabox_pubkey').html(data.pubkey);
      checkIfAllConditionsMet();
      await consoleLog( data );
    })
    .catch( err => {
      gState.pubkey = false;
      checkIfAllConditionsMet();
      consoleLog(err);
    });
  });
  // $('#eosinabox_prepareEsr').on('click', (event)=>{
  //   event.preventDefault();
  //   fetch('/prepareEsr', {
  //     method: 'POST',
  //     headers: { 'Content-Type': 'application/json' },
  //     body: JSON.stringify({
  //       custodianAccountName: $('#eosinabox_custodianAccountName').val(),
  //       accountName:          $('#eosinabox_accountName').val(),
  //       pubkey:               $('#eosinabox_pubkey').html(),
  //     })
  //   })
  //   .then(response => response.json())
  //   .then(async data => {
  //     // $('#eosinabox_pubkey').html(data.pubkey);
  //     gState.esr = data.esr;
  //     gState.cleos = [
  //       `cleos -u https://jungle3.cryptolions.io:443 system newaccount`,
  //       `__CREATOR_ACCOUNT__ ${$('#eosinabox_accountName').val()}`,
  //       `${$('#eosinabox_custodianAccountName').val()}@active ${$('#eosinabox_pubkey').html()}`,
  //       `--stake-net "0.0010 EOS" --stake-cpu "0.0010 EOS" --buy-ram-bytes 3200`,
  //     ].join(' ');
  //     $('#eosinabox_prepareEsr').hide();
  //     $('#eosinabox_share').show();
  //     $('#eosinabox_shareCleos').show();
  //     await consoleLog( { data, stage: 'amihDebug create ESR response in client...' } );
  //   })
  //   .catch( err => {
  //     consoleLog(err);
  //   });
  // });
  $('#eosinabox_share').on('click', (e)=>{
    gState.shareEssentials = {
      custodianAccountName: $('#eosinabox_custodianAccountName').val(),
      accountName:          $('#eosinabox_accountName').val(),
      pubkey:               $('#eosinabox_pubkey').html(),
    };

    // navigator.share({ text: gState.esr })
    navigator.share({ url: `https://eosinabox.amiheines.com/#sharedInfo?action=createAccount&chain=jungle3&accountName=${gState.shareEssentials.accountName}` +
      `&custodianAccountName=${gState.shareEssentials.custodianAccountName}&pubkey=${gState.shareEssentials.pubkey}`
    });
    // navigator.share({ text: `<a href="${gState.esr}">Create EOS in a Box account</a>` })
  });
  // $('#eosinabox_shareCleos').on('click', (e)=>{
  //   navigator.share({ text: gState.cleos })
  //   // navigator.share({ text: `<a href="${gState.esr}">Create EOS in a Box account</a>` })
  // });
  $('nav li a.nav-link').on('click', (e) => {
    e.preventDefault();
    $('.navbar-collapse').collapse('hide');
    $('.eosinabox_page').hide();
    const href = e.target.href.split('#')[1];
    $(`.eosinabox_page_${href}`).show();
    console.log('menu element:::', href);
  });
  $('.eosinabox_dropdown_blockchain a.dropdown-item').on('click', (e)=>{
    console.log('data-chain:', $(e.target).data('chain'));
    console.log('text: ', $(e.target).text());
    $('.eosinabox_dropdown_blockchain>button').html(`Blockchain: ${$(e.target).text()} <i class="bi bi-check-circle-fill"></i>`);
  });
  // onLoad
  $('.eosinabox_page').hide();
  // if url has #sharedInfo in it, get the parameters and navigate to the right page.
  if(window.location.href.split('#')[1].substr(0,10) == 'sharedInfo'){
    const params = window.location.href.split('#')[1].split('?')[1].split('&');
    var o = {};
    for(var i=0; i<params.length; i++){
      var param = params[i].split('=');
      o[param[0]] = param[1];
      $(`.eosinabox_sharedinfo_${param[0]}`).html(param[1]);
    }
    const cleosCommand = [
      `cleos -u https://jungle3.cryptolions.io:443 system newaccount`,
      `##-CREATOR-ACCOUNT-## ${o.accountName} ${o.custodianAccountName}@active ${o.pubkey}`,
      `--stake-net "0.0010 EOS" --stake-cpu "0.0010 EOS" --buy-ram-bytes 3200`,
    ].join(' ');
    $(`.eosinabox_sharedinfo_cleos`).html(cleosCommand);
    $(`.eosinabox_page_sharedInfo`).show();
  }else{
    $(`.eosinabox_page_myAccount`).show();
  }
});
