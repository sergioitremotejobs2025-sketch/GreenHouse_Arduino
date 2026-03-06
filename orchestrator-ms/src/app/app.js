const cors = require('cors');
const express = require('express');
const rateLimit = require('express-rate-limit');

const client = require('prom-client');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');

const app = express();

// Rate limiting
const globalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per `window`
    message: 'Too many requests from this IP, please try again after 15 minutes'
});

const authLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 10, // Limit each IP to 10 login requests per hour
    message: 'Too many login attempts from this IP, please try again after an hour'
});

app.use(globalLimiter);
app.use('/login', authLimiter);
app.use('/register', authLimiter);


const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Orchestrator MS API',
            version: '1.0.0',
            description: 'API documentation for the Orchestrator microservice',
        },
        servers: [
            {
                url: 'http://localhost:3000',
                description: 'Local server',
            },
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                },
            },
        },
    },
    apis: ['./src/app/routes/*.js'], // Path to the API docs
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Create a Registry which registers the metrics
const register = new client.Registry();

// Add a default metrics collection
client.collectDefaultMetrics({ register });

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Simple request logger
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    next();
});

app.get('/health', (req, res) => res.status(200).json({ status: 'ok', service: 'orchestrator-ms' }))

app.get('/metrics', async (req, res) => {
    res.setHeader('Content-Type', register.contentType);
    res.send(await register.metrics());
});

app.use(require('./routes/orchestrator.routes'))


app.disable('x-powered-by');

module.exports = app;
