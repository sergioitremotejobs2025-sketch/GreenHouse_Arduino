const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3005;

app.use(cors());
app.use('/images', express.static(path.join(__dirname, '../public/images')));

// Growth stages configuration
const STAGES = [
    { id: 1, name: 'seedling', file: 'stage_1.png', duration_min: 1 },
    { id: 2, name: 'young_plant', file: 'stage_2.png', duration_min: 2 },
    { id: 3, name: 'flowering', file: 'stage_3.png', duration_min: 2 },
    { id: 4, name: 'green_fruit', file: 'stage_4.png', duration_min: 3 },
    { id: 5, name: 'ripe_fruit', file: 'stage_5.png', duration_min: 5 }
];

const START_TIME = Date.now();

app.get('/camera/latest', (req, res) => {
    const elapsedMinutes = (Date.now() - START_TIME) / (1000 * 60);

    let currentStage = STAGES[0];
    let rollingTime = 0;

    for (const stage of STAGES) {
        rollingTime += stage.duration_min;
        if (elapsedMinutes < rollingTime) {
            currentStage = stage;
            break;
        }
        currentStage = stage; // Last stage stays
    }

    // Return info and the image URL
    res.json({
        stage: currentStage.name,
        stage_id: currentStage.id,
        elapsed_minutes: elapsedMinutes.toFixed(2),
        image_url: `http://localhost:${PORT}/images/${currentStage.file}`
    });
});

// Compatibility endpoint for standard polling
app.get('/temperature', (req, res) => {
    const elapsedMinutes = (Date.now() - START_TIME) / (1000 * 60);
    let stageId = 1;
    let rollingTime = 0;
    for (const stage of STAGES) {
        rollingTime += stage.duration_min;
        if (elapsedMinutes < rollingTime) {
            stageId = stage.id;
            break;
        }
        stageId = stage.id;
    }
    // Return the stage ID as the 'temperature' value
    res.json({ temperature: stageId * 10 });
});

// To simplify, just redirect to the actual image
app.get('/camera/image', (req, res) => {
    const elapsedMinutes = (Date.now() - START_TIME) / (1000 * 60);
    let currentStage = STAGES[0];
    let rollingTime = 0;
    for (const stage of STAGES) {
        rollingTime += stage.duration_min;
        if (elapsedMinutes < rollingTime) {
            currentStage = stage;
            break;
        }
        currentStage = stage;
    }
    res.sendFile(path.join(__dirname, `../public/images/${currentStage.file}`));
});

app.listen(PORT, () => {
    console.log(`Fake Arduino Camera Service at http://localhost:${PORT}`);
    console.log(`- Latest stats: http://localhost:${PORT}/camera/latest`);
    console.log(`- Latest image: http://localhost:${PORT}/camera/image`);
});
