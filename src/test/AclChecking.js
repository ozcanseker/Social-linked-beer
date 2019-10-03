const fileClient = require('solid-file-client');
const solid = require('solid-auth-client');

let credentials = solid.getCredentials().then(credential => {
    console.log(credential);
})