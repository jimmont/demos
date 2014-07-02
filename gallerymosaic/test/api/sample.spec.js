var frisby = require('frisby');

frisby.create('a test')
.get('http://localhost:3000/')
.expectStatus(200)
.expectHeaderContains('content-type','text/html')
.toss();
