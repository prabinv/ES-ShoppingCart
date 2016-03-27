var eventstore = require('geteventstore-promise');

module.exports = function() {
    return eventstore.tcp({
                hostname: 'localhost',
                port: 1113,
                credentials: {
                    username: 'admin',
                    password: 'changeit'
                }
            });
}
