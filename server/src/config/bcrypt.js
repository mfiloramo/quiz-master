const bcrypt = require('bcrypt');

const password = 'hashedpassword1';
const hashed = bcrypt.hash(password, 10).then(response => console.log(response));

// bcrypt.compare('hashedpassword1', '').then(res => console.log(res));
