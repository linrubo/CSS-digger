import { writeFile } from 'fs/promises';

import properties from './properties.js';
import values from './values.js';

const digger = async function () {
    console.time('digger');
    const result = {};
    const total = properties.length;
    let count = 0;

    for (const property of properties) {
        const data = await values({ property });
        result[property] = data;
        console.log(`${count += 1}/${total} ${property} 处理完成`);
    }

    await writeFile('output.json', JSON.stringify(result, null, 4));
    console.timeEnd('digger');
}

digger();