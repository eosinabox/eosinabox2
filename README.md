# EOS in a Box

clean(er) version of the web wallet with webauthn tech.

dead simple project with one client file and one server file.
starting with jQuery on the client and node.js with express on the server.

There is no database and no sessions, All info will be saved on the user's phone since the private key is there anyway.

localStorage will have the blockchain and account name.

# Server code

    ./index.js

# Client code

    ./client/src/index.html
    ./client/src/client.js

# TODO

choose between Jungle3 and EOS main net
PWA install, capture and let install internally?
PWA update, click to reload?
Manage accounts to send money to
powerup, display simple gauge
https://codepen.io/xgh/pen/ExaXgbb
share invite friend to create account
external link to block explorer


cleos -u https://jungle3.cryptolions.io:443 get currency balance eosdtsttoken grayfox12345 EOSDT -j >> ["1997.975627679 EOSDT"]
cleos -u https://jungle3.cryptolions.io:443 get currency balance eosdtsttoken ${anaccount} EOSDT -j >> ["1234.123456789 EOSDT"]


