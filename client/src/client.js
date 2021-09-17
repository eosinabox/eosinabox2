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
const detectOs = () => {
  var userAgent = navigator.userAgent || navigator.vendor || window.opera;
  // Windows Phone must come first because its UA also contains "Android"
  if (/windows phone/i.test(userAgent)) {
    return "windowsphone";
  }
  if (/android/i.test(userAgent)) {
    return "android";
  }
  // iOS detection from: http://stackoverflow.com/a/9039885/177710
  if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
    return "ios";
  }
}
$(() => {
  window.onerror = function errorHandler(msg, url, line) {
    consoleLog({ logMsg: 'clientSideError', arguments });
    return false; // Just let default handler run.
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
          gState.accountName = true;
          $('#eosinabox_countAccountLen').html('Account is available');
        }else{
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
        gState.accountName = true;
        $('#eosinabox_countAccountLen').html('Account is available');
      }else{
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
          gState.custodianAccountName = false;
          $('#eosinabox_countCustodianAccountLen').html('Custodian Account does not exist, please try again');
        }else{
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
      $('#eosinabox_share').show();
    }else{
      $('#eosinbox_createKeys' ).show();
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
  const getCurrencyBalance = async (code, account, symbol) => {
    const response = await fetch(`/getCurrencyBalance/${code}/${account}/${symbol}`);
    return response.json();
  }
  const getAccountInfo = async (chain, account) => {
    const response = await fetch(`/getAccountInfo/${chain}/${account}`);
    return response.json();
  }
  const updateBalance = async () => {
    const balance = await getCurrencyBalance( 'eosio.token', localStorage.currentAccount,'EOS' );
    const accountInfo = await getAccountInfo( 'jungle3', localStorage.currentAccount );
    // console.log('bal::', balance);
    consoleLog({ logMsg: 'getAccountInfo', accountInfo, balance });
    $('#eosinabox_balance').html( `${balance} <i class="bi bi-arrow-repeat h6"></i>` );
  };
  $('#eosinbox_createKeys').on('click', async (event) => {
    event.preventDefault();
    // AMIHDEBUG TODO: generate random string on server and manage it in a session,
    // Perhaps this is not needed, not worried about replay attacks, discuss...
    const randomStringFromServer = 'replayAttackProtectionRandomStringNotNeeded?';
    const rp = {
      name: "Ami Heines",
      id: "eosinabox.amiheines.com", // AMIHDEBUG TODO: update this when installing on another web site, e.g. eosinabox.com (move out to a config .json file?)
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
    const credential = await navigator.credentials.create({ publicKey: publicKeyCredentialCreationOptions });
    console.log('credential', credential);
    const credForServer = {
      rpid: rp.id,
      id: eosjs_serialize.arrayToHex(new Uint8Array(credential.rawId)),
      attestationObject: eosjs_serialize.arrayToHex(new Uint8Array(credential.response.attestationObject)),
      clientDataJSON: eosjs_serialize.arrayToHex(new Uint8Array(credential.response.clientDataJSON)),
    }
    // // TODO: discuss, perhaps there is no need to do this on the server side, we can do most
    // // of the processing on the front end.
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
      // save in localStorage
      let credentialIdHex = eosjs_serialize.arrayToHex(new Uint8Array(credential.rawId));
      console.log('pubkeyAsHex: ', credentialIdHex);
      if( !localStorage['eosinabox_pubkeys_jungle3'] ){
        localStorage['eosinabox_pubkeys_jungle3'] = JSON.stringify( [{ credentialId: credentialIdHex, key: data.pubkey }] );
      }else{
        let o = JSON.parse(localStorage['eosinabox_pubkeys_jungle3']);
        o.push({ credentialId: credentialIdHex, key: data.pubkey });
        localStorage['eosinabox_pubkeys_jungle3'] = JSON.stringify( o );
        // save just the new key, destroy the older ones!
        // localStorage['eosinabox_pubkeys_jungle3'] = JSON.stringify( [{ credentialId: credentialIdHex, key: data.pubkey }] );
      }
      checkIfAllConditionsMet();
      await consoleLog( data );
    })
    .catch( err => {
      gState.pubkey = false;
      checkIfAllConditionsMet();
      consoleLog(err);
    });
  });
  ///////////////////////////////////////////////////////////////////////////////////
  $('#eosinbox_declineTransaction').on('click', async (event) => {
    alert('Deleting this transaction.');
    localStorage.sharedInfo = '';
    $('.eosinabox_page').hide();
    $(`.eosinabox_page_myAccount`).show();
  });
  $('#eosinbox_approveThisTransaction').on('click', async (event) => {
    event.preventDefault();
    const signatureProvider = new eosjs_wasig.WebAuthnSignatureProvider();
    signatureProvider.keys.clear();
    const keys = JSON.parse( localStorage.eosinabox_pubkeys_jungle3 );
    for (const key of keys){
      signatureProvider.keys.set(key.key, key.credentialId);
    }
    const rpc = new eosjs_jsonrpc.JsonRpc('https://jungle3.cryptolions.io:443');
    const api = new eosjs_api.Api({ rpc, signatureProvider });
    console.log('[eosinbox_approveThisTransaction] [sharedInfo]' + localStorage.sharedInfo);
    let o = JSON.parse(localStorage.sharedInfo);
    // https://eosinabox.amiheines.com/#sharedInfo?
    // action=createAccount&
    // chain=jungle3&
    // accountName=cggdggffgyft&
    // custodianAccountName=webauthn1111&
    // pubkey=PUB_WA_AwTqYqJEwQ3B4bzNGyxHT25qZCxRfrjgYnshr97otStVYZJ7uA5EAkEey2RoKZCyu7pxaAStoGV1ieCc3tUk
    console.log('[eosinbox_approveThisTransaction] sharedInfo:', o);
    try {
      const result = await api.transact({
        // actions: [{
        //   account: 'eosio.token',
        //   name: 'transfer',
        //   data: { from, to, quantity, memo },
        //   authorization: [{ actor: from, permission: 'active' }],
        // }],
        actions: [{
          account: 'eosio',
          name: 'newaccount',
          authorization: [{
            actor: localStorage.currentAccount,
            permission: 'active',
          }],
          data: {
            creator: localStorage.currentAccount,
            name: o.accountName,
            owner: {
              threshold: 1,
              keys: [],
              accounts: [{
                permission: {
                  actor: o.custodianAccountName,
                  permission: 'active'
                },
                weight: 1
              }],
              waits: []
            },
            active: {
              threshold: 1,
              keys: [{
                key: o.pubkey,
                weight: 1
              }],
              accounts: [],
              waits: []
            },
          },
        },
        {
          account: 'eosio',
          name: 'buyrambytes',
          authorization: [{
            actor: localStorage.currentAccount,
            permission: 'active',
          }],
          data: {
            payer: localStorage.currentAccount,
            receiver: o.accountName,
            bytes: 3200,
          },
        },
        {
          account: 'eosio',
          name: 'delegatebw',
          authorization: [{
            actor: localStorage.currentAccount,
            permission: 'active',
          }],
          data: {
            from: localStorage.currentAccount,
            receiver: localStorage.currentAccount,
            stake_net_quantity: '0.0010 EOS',
            stake_cpu_quantity: '0.0010 EOS',
            transfer: false,
          }
        }]
      }, {
        blocksBehind: 3,
        expireSeconds: 60,
      });
      consoleLog( {logMsg: 'createdAccount!', result } );
      alert('Transaction sent, let the other person know you created their account');
      localStorage.sharedInfo = '';
      $('.eosinabox_page').hide();
      $(`.eosinabox_page_myAccount`).show();
    } catch (error) {
      consoleLog( {logMsg: 'transfer EOS error!', error } );
      alert('Transaction failed with error, ' + error.message);
    }
  });
  ///////////////////////////////////////////////////////////////////////////////////
  $('#eosinabox_transfer_transact').on('click', async (event) => {
    event.preventDefault();
    const signatureProvider = new eosjs_wasig.WebAuthnSignatureProvider();
    signatureProvider.keys.clear();
    const keys = JSON.parse( localStorage.eosinabox_pubkeys_jungle3 );
    consoleLog({ fromMsg:'eosinabox_transfer_transact [0]', keys });
    for (const key of keys){
      consoleLog({ fromMsg:'eosinabox_transfer_transact [1]', key });
      signatureProvider.keys.set(key.key, key.credentialId);
    }
    consoleLog({ fromMsg:'eosinabox_transfer_transact [2]' });
    const rpc = new eosjs_jsonrpc.JsonRpc('https://jungle3.cryptolions.io:443');
    consoleLog({ fromMsg:'eosinabox_transfer_transact [3]' });
    const api = new eosjs_api.Api({ rpc, signatureProvider });
    consoleLog({ fromMsg:'eosinabox_transfer_transact [4]' });
    console.log('[eosinbox_signTransaction] [click] [5]');
    const to       = $('#eosinabox_transfer_to'      ).val().toLowerCase();
    const quantity = $('#eosinabox_transfer_quantity').val().toUpperCase();
    const memo     = $('#eosinabox_transfer_memo'    ).val();
    console.log('from, to, quant, memo:', localStorage.currentAccount, to, quantity, memo);
    try {
      const result = await api.transact({
        actions: [{
          account: 'eosio.token',
          name: 'transfer',
          data: { from: localStorage.currentAccount, to, quantity, memo },
          authorization: [{ actor: localStorage.currentAccount, permission: 'active' }],
        }],
      }, {
        blocksBehind: 3,
        expireSeconds: 60,
      });
      consoleLog( {logMsg: 'transfer EOS!', result } );
      $('#eosinabox_transfer_to'      ).val('');
      $('#eosinabox_transfer_quantity').val('');
      $('#eosinabox_transfer_memo'    ).val('');
      try { await updateBalance(); } catch (error) { consoleLog({ msg: 'updateBalanceErr:327', error }); }
      alert('Transaction sent');
    } catch (error) {
      consoleLog( {logMsg: 'transfer EOS error!', error } );
      alert('Transaction failed with error, ' + error.message);
    }
  });
  $('#eosinabox_balance').on('click', updateBalance);
  ///////////////////////////////////////////////////////////////////////////////////
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
  //       `--stake-net "0.0010 EOS" --stake-cpu "0.0010 EOS" --buy-ram-kbytes 3`,
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
  $('#eosinabox_viewOnExplorer').on('click', (e)=>{
    // jungle only for now... TODO: AMIHDEBUG expand this!
    window.open('https://jungle3.bloks.io/account/' + localStorage.currentAccount, '_blank').focus();
  });
  $('#eosinabox_share_backup_debug').on('click', (e)=>{
    navigator.share({ text: JSON.stringify(localStorage) });
  });
  $('#eosinabox_share').on('click', (e)=>{
    gState.shareEssentials = {
      custodianAccountName: $('#eosinabox_custodianAccountName').val(),
      accountName:          $('#eosinabox_accountName').val(),
      pubkey:               $('#eosinabox_pubkey').html(),
    };
    localStorage.currentAccount = $('#eosinabox_accountName').val().toLowerCase();
    navigator.share({ url: `https://eosinabox.amiheines.com/#sharedInfo?action=createAccount&chain=jungle3&accountName=${gState.shareEssentials.accountName}` +
      `&custodianAccountName=${gState.shareEssentials.custodianAccountName}&pubkey=${gState.shareEssentials.pubkey}`
    });
  });
  $('#eosinabox_transfer_from').on('click', () => {
    $('#eosinabox_transfer_from').html('...');
    setTimeout(()=>{
      $('#eosinabox_transfer_from').html(localStorage.currentAccount);
    }, 500);
  });
  $('nav li a.nav-link').on('click', (e) => {
    e.preventDefault();
    $('#eosinabox_transfer_from').html(localStorage.currentAccount);
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
  try { updateBalance(); } catch (error) { consoleLog({ msg: 'updateBalanceErr:398', error }); }
  if(typeof(PublicKeyCredential)=='undefined'){
    const os = detectOs();
    if(os=='ios'){
      alert('Please use a modern browser, Safari on Apple.');
    }else{
      alert('Please use a modern browser, Google Chrome on Android.');
    }
    consoleLog({ errMsg: 'PublicKeyCredential_undefined', message: 'Please use a modern browser to use this app.' });
  }
  // if url has #sharedInfo in it, get the parameters and navigate to the right page.
  if(window.location.href.split('#').length>1 && window.location.href.split('#')[1].substr(0,10) == 'sharedInfo'){
    const params = window.location.href.split('#')[1].split('?')[1].split('&');
    var o = {};
    localStorage.sharedInfo = '';
    for(var i=0; i<params.length; i++){
      var param = params[i].split('=');
      o[param[0]] = param[1];
      $(`.eosinabox_sharedinfo_${param[0]}`).html(param[1]);
    }
    localStorage.sharedInfo = JSON.stringify(o);
    const cleosCommand = [
      `cleos -u https://jungle3.cryptolions.io:443 system newaccount`,
      `_CREATOR_ACCOUNT_ ${o.accountName} ${o.custodianAccountName}@active ${o.pubkey}`,
      `--stake-net "0.0010 EOS" --stake-cpu "0.0010 EOS" --buy-ram-kbytes 3`,
    ].join(' ');
    $(`.eosinabox_sharedinfo_cleos`).html(cleosCommand);
    $(`.eosinabox_page_sharedInfo`).show();
    history.pushState('', '', window.location.pathname); // delete the share info, so it won't go back again to that page.
  }else{
    $(`.eosinabox_page_myAccount`).show();
    $('#eosinabox_transfer_from').html(localStorage.currentAccount);
  }
});
