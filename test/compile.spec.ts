import process from '../src/compiler';
import { File } from 'atma-io';

let fileTs = new File('./test.ts');
let fileMap = new File('./test.ts.map');
let fileDefs = new File('./test.d.ts');

let compiler = <any> {
    getOption (key: 'typescript') {
        if (key !== 'typescript') {
            throw new Error(`Unknown option ${key}`);
        }
        return {
            compilerOptions: {
                target: 'es2020',
                module: 'amd'
            }
        };
    }
};

const source = `
    async function logMe() {
        let foo = await get();
    }
    let foo = async () => {
        await get();
    };
    await logMe();
`;

UTest({
    async 'compile' () {
        let result = process(source, fileTs, compiler);
        has_(result.content, 'define(["require", "exports"], async function (require, exports) {');
    },
    async 'mapping' () {
        let result = process(source, fileMap, compiler);
        has_(result.content, `"sources":["test.ts.map"]`);
    },
    async 'definitions' () {
        let result = process(source, fileDefs, compiler);
        has_(result.content, `declare let foo:`);
    }
})
