import https from 'https';

import alternate from './alternate.js';

const retries = new Map();

const picker = function (input, result) {
    const pattern = /(?:<code>)(?<lt>&lt;)?(?<name>[a-z\-\s]+)/g;

    while (true) {
        const matched = pattern.exec(input);

        if (matched === null) {
            break;
        }

        const { lt, name } = matched.groups;

        if (!lt) {
            result.push(name)
        } else {
            result.push(...alternate[name] ?? [`<${name}>`]);
        }
    }
};

const values = function ({ property, test, draft = true }) {
    return new Promise((resolve, reject) => {
        const url = `https://developer.mozilla.org/en-US/docs/Web/CSS/${property}`;

        const options = {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.55 Safari/537.36 Edg/96.0.1054.43'
            }
        };

        const request = https.get(url, options);

        request.setTimeout(5000);
        request.on('error', reject);

        request.on('timeout', () => {
            const count = retries.get(property) ?? 0;

            request.destroy();

            if (count < 5) {
                resolve(values(...arguments));
            } else {
                resolve([]);
            }

            retries.set(property, count + 1);
        });

        request.on('response', response => {
            let body = '';

            if (response.statusCode !== 200) {
                resolve([]);
                return;
            }

            response.setEncoding('utf8');
            response.on('data', chunk => body += chunk);

            response.on('end', () => {
                const result = [];
                let list = body.match(/<dt>[\s\S]+?<\/dt>/g) ?? [];

                list = list.filter(item => item.includes('<code>'));

                if (draft === false) {
                    list = list.filter(item => !item.includes('<svg '));
                }

                if (test) {
                    resolve([...new Set(list)]);
                } else {
                    list.forEach(item => picker(item, result));
                    resolve([...new Set(result)]);
                }
            });
        });
    });
};

export default values;