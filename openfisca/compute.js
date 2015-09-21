import loadConstYaml from '../lib/loadConstYaml';


const AIDES = loadConstYaml('config/aides');

export default function compute(situation, callback) {
    let result = [];

    for (let id in AIDES)
        if (Math.random() > .5)
            result.push(Object.assign({ amount: 233 }, AIDES[id]));

    process.nextTick(callback.bind(null, 'Mockup computation', result));
}
