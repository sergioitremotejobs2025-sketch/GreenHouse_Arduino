const { main } = require('./app/app');

main().then(() => {
    console.log('Publisher-ms finished its run.');
    process.exit(0);
}).catch(err => {
    console.error(err);
    process.exit(1);
});
