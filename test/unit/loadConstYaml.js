import expect from 'expect.js';

import loadConstYaml from '../../lib/loadConstYaml';


describe('loadConstYaml', () => {
    let subject = loadConstYaml('test/data/example');

    it('should load a YAML file', () => {
        expect(subject[0]).to.equal('exampleValue');
    });

    it('should prevent extensions', () => {
        expect(() => { subject.push('someValue') }).to.throwException();
    });
});
