const fs = require('fs');
const { join } = require("path");

module.exports = (client) => {
	
    const eventDir = join(__dirname, 'events');
    const eventFiles = fs.readdirSync(eventDir).filter(file => file.endsWith('.js'));

    for(const eventFile of eventFiles) {
        const filePath = join(eventDir, eventFile);
		const event = require(filePath);
		if (event.once) {
			client.once(event.name, (...args) => event.execute(...args));
		} else {
			client.on(event.name, (...args) => event.execute(...args));
		}
	}
    client.events = eventFiles.length;
    console.log(`Loaded ${eventFiles.length} events !`);

	}