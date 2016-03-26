var eventstore = require('geteventstore-promise');

module.exports = function() {
    return eventstore.http({
                hostname: 'localhost',
                port: 2113,
                credentials: {
                    username: 'admin',
                    password: 'changeit'
                }
            });
}