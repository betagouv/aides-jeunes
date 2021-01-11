import path from 'path';
import webpack from 'webpack';
import memoryfs from 'memory-fs';
import requireFromString from 'require-from-string';

const compile = (options = {}) => {

    const compiler = webpack({
        context: __dirname,
        entry: './example.js',
        output: {
            path: path.resolve(__dirname),
            filename: 'bundle.js',
        },
        module: {
            rules: [{
                test: require.resolve('world-countries'),
                use: {
                    loader: path.resolve(__dirname, '../../app/js/loaders/worldCountriesLoader.js'),
                    options
                }
            }]
        }
    });

    compiler.outputFileSystem = new memoryfs();

    return new Promise((resolve, reject) => {
        compiler.run((err, stats) => {

            if (err) reject(err);
            if (stats.hasErrors()) reject(new Error(stats.toJson().errors));

            resolve(stats);
        });
    });
};

xtest('include returns filtered object', async () => {

    const stats = await compile({ include: ['cca2', 'translations.fra'] });

    const source = stats.toJson().modules[1].source;

    const data = requireFromString(source);

    expect(data).toContainEqual(
        expect.objectContaining({
            cca2: expect.any(String),
            translations: expect.any(Object)
        })
    );
    expect(data).toContainEqual(
        expect.not.objectContaining({
            name: expect.any(String)
        })
    );

}, 10000);
