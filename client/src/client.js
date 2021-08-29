$(() => {
  $('.eosinabox_help_header').on('click', ()=>{
    console.log('AMIHDEBUG toggle visibility?');
    $('.eosinabox_help').toggle();
  })
  $('#esinabox_check_availability').on('click', (event)=>{
    event.preventDefault();
    var accName = $('#eosinabox_accountName').val();
    if(accName.length != 12){
      console.log(`Account name should be 12 characters long, it is ${accName.length}, try again`);
      return;
    }else if(!/^[a-z1-5]{12}$/.test(accName)){
      // it is 12 chars long, check if they are all [a-z1-5]
      console.log('contains illegal chars! try again!');
      return;
    }
    console.log('AMIHDEBUG check is account name is available --->>', $('#eosinabox_accountName').val());
    fetch('/checkAvailability/' + $('#eosinabox_accountName').val())
    .then(response => response.json())
    .then(data => console.log('AMIHDEBUG res--data::', data))
    .catch((error) => {
      console.error('Error in FETCH:', error);
    });
  })
});