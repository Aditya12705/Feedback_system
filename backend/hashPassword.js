const bcrypt = require('bcryptjs');
bcrypt.hash('admin123', 10, (err, hash) => {
    if (err) console.error(err);
    console.log(hash);
});