import fs from 'fs';

import properties from './properties.js';
import values from './values.js';

const tester = async function () {
    const output = fs.createWriteStream('output.txt');
    const total = properties.length;
    let count = 0;

    for (const property of properties) {
        const result = await values({ property, test: true });
        output.write(`${property}\n`);
        output.write(`${result.join('\n')}\n\n`);
        console.log(`${count += 1}/${total} ${property} 处理完成`);
    }

    output.end();
}

tester();