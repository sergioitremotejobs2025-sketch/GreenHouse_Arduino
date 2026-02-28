const express = require('express');
const client = require('prom-client');
const { main } = require('./app/app');

// Create a Registry which registers the metrics
const register = new client.Registry();

// Add a default metrics collection
client.collectDefaultMetrics({ register });

const app = express();

app.get('/health', (req, res) => res.status(200).json({ status: 'ok', service: 'publisher-ms' }));

app.get('/metrics', async (req, res) => {
    res.setHeader('Content-Type', register.contentType);
    res.send(await register.metrics());
});

const METRICS_PORT = process.env.METRICS_PORT || 3000;
app.listen(METRICS_PORT, () => {
    console.log(`Metrics server for publisher-ms listening on port ${METRICS_PORT}`);
});

main().then(() => {
    console.log('Publisher-ms finished its first run.');
    // In a long-running pod, we might not want to exit, 
    // but the original code had process.exit().
    // For metrics to work, the process must stay alive.
    // I'll check if I should remove process.exit()
});
