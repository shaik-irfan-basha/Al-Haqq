const fs = require('fs');
const path = require('path');
const https = require('https');

// Read .env.local to get the key
const envPath = path.join(__dirname, '../.env.local');
let apiKey = '';

try {
    const envContent = fs.readFileSync(envPath, 'utf8');
    const match = envContent.match(/GEMINI_API_KEY=(.+)/);
    if (match) {
        apiKey = match[1].trim();
    }
} catch (err) {
    console.error('Error reading .env.local:', err);
    process.exit(1);
}

if (!apiKey) {
    console.error('GEMINI_API_KEY not found in .env.local');
    process.exit(1);
}

console.log('Using API Key (last 4):', apiKey.slice(-4));

const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;

https.get(url, (res) => {
    let data = '';
    res.on('data', (chunk) => {
        data += chunk;
    });
    res.on('end', () => {
        if (res.statusCode !== 200) {
            console.error(`Error: ${res.statusCode} ${res.statusMessage}`);
            console.error(data);
            return;
        }
        try {
            const json = JSON.parse(data);
            log('Available Models:');
            if (json.models) {
                json.models.forEach(m => {
                    if (m.supportedGenerationMethods && m.supportedGenerationMethods.includes('generateContent')) {
                        log(`- ${m.name}`);
                    }
                });
            } else {
                log('No models found in response.');
                log(JSON.stringify(json, null, 2));
            }
        } catch (e) {
            console.error('Error parsing response:', e);
        }
    });
}).on('error', (err) => {
    console.error('Request error:', err);
});

function log(msg) {
    console.log(msg);
    fs.appendFileSync(path.join(__dirname, 'available_models.txt'), msg + '\n');
}
