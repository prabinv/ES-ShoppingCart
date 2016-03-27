var eventstore = require('geteventstore-promise');
var uuid = require('node-uuid');

var client = eventstore.http({
                hostname: 'localhost',
                port: 2113,
                credentials: {
                    username: 'admin',
                    password: 'changeit'
                }
            });

var tcpClient = eventstore.tcp({
                hostname: 'localhost',
                port: 1113,
                credentials: {
                    username: 'admin',
                    password: 'changeit'
                }
            });

var testStream = 'TestStream-' + uuid.v4();

client.writeEvent(testStream, 'TestEventType', { something: '123' }).then(function() {
    console.log('This is printed');
    tcpClient.getEvents(testStream, 0, 100, 'forward').then(function(events){
        console.log('This is not printed');
        console.log('Events ', JSON.stringify(events));
    });
});
