var orm = require('orm');

var connectionString;

if (process.env.SQLITE == 'true')
    connectionString = 'sqlite://' + __dirname + '/db.sqlite';
else
    connectionString = 'postgres://cote:ohgath2ig8eoP8@pg/cote';

var db = orm.connect(connectionString, function onConnect(err) {
    if (err) {
        console.log('Error', err);
        process.exit(1);
    }
});

db.settings.set('instance.cache', false);

var Product = db.define('product', {
    name: String,
    price: Number,
    stock: Number
});

var Purchase = db.define('purchase', {});

var User = db.define('user', {
    balance: { type: 'number', defaultValue: 30 }
});

Purchase.hasOne('product', Product, {
    autoFetch: true
});
Purchase.hasOne('owner', User, {
    autoFetch: true,
    reverse: 'purchases'
});

function init(callback) {
    console.log('Dropping db.');

    db.drop(function() {
        console.log('Initializing db.');

        db.sync(callback);
    });
}

module.exports = {
    Product: Product,
    Purchase: Purchase,
    User: User,
    init: init
};
