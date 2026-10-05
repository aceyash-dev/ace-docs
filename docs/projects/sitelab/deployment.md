# Deployment

## Requirements

Node.js 22+, npm, and outbound DNS plus HTTP(S) access.

## Run

~~~bash
npm install
npm start
~~~

## Test

~~~bash
npm test
~~~

The core scanner does not require a database. The short scan cache is process-local.

Production should run behind HTTPS with server-side rate limiting enabled. Monitor request latency, timeouts and crawler errors.
