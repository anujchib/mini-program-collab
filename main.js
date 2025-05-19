const fs = require('fs');
const path = require('path');
const Interpreter = require('./interpreter');

function main() {
    const interpreter = new Interpreter();
    console.log('Mini Programming Language (Node.js Version)');
    console.log('Reading from example.txt...\n');

    try {
        // Read the example.txt file
        const filePath = path.join(__dirname, 'example.txt');
        const fileContent = fs.readFileSync(filePath, 'utf8');
        const lines = fileContent.split('\n');

        // Process each line
        for (const line of lines) {
            const text = line.trim();
            if (!text) continue;

            console.log('Source:', text);
            const result = interpreter.interpret(text);
            if (result !== undefined) {
                if (result.toString().startsWith('print(')) {
                    console.log('Output:', result);
                }
            }
            console.log();
        }
    } catch (error) {
        if (error.code === 'ENOENT') {
            console.error('Error: example.txt file not found');
        } else {
            console.error('Error:', error.message);
        }
    }
}

if (require.main === module) {
    main();
} 