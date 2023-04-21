import process from '../src/compiler';
import { File } from 'atma-io';

let file = new File('./test.ts');
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

UTest({
    async 'compile' () {
        let source = `
        async function logMe() {
            let foo = await get();
        }
        let foo = async () => {
            await get();
        };
        await logMe();
        `;

        let result = process(source, file, compiler);
        console.log(result.content);
    }
})
