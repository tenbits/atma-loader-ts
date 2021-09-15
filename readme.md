[TypeScript Compiler](http://www.typescriptlang.org) (Atma Plugin)
-----
[![Build Status](https://travis-ci.com/tenbits/atma-loader-ts.png?branch=master)](https://travis-ci.com/tenbits/atma-loader-ts)

- supports proper stacktrace line numbers
- supports custom `ts` transformers

The Plugin extends:
- [`IncludeJS`](https://github.com/atmajs/IncludeJS) with a custom loader
- [`atma-io`](https://github.com/atmajs/atma-io) with a custom middleware to compile the TypeScript files on file read
- [`atma-server`](https://github.com/atmajs/atma-server) and [`Atma Toolkit`](https://github.com/atmajs/Atma.Toolkit) with a `HTTPHandler` to serve compiled sources (with **sourceMap** support)


##### Usage

###### Embed into the Project

+ `npm i atma-loader-ts`

    Update `package.json` with:
    ```json
        {
            "dependencies": {
                "atma-loader-ts"
            },
            "atma": {
                "plugins": [
                    "atma-loader-ts"
                ],
                "settings": {
                    "atma-loader-ts": {
                        "extensions" : [ "ts" ],
                        "typescript": {
                            "compilerOptions": {
                                // typescript compiler options
                            },
                            // Optionaly transformers
                            "transformers": {
                                "before": ["foo"],
                                "after": ["bar"]
                            }
                        }
                    }
                }
            }
        }
    ```
+ That's it. Now, you are ready to use TypeScript in your project

##### Quick Try

+ install atma: `$ npm install atma -g`
+ install plugin: `$ atma plugin install atma-loader-ts --save`
+ add `test.html` to the directory

    ```html
    <!DOCTYPE html>
    <script src='test.ts'></script>
    ```
+ add `test.ts`

    ```ts
    function log(msg: string) {
        console.log(msg.toUpperCase());
    }
    setInterval(() => log('works'), 200);
    ```
+ start the server: `$ atma server`
+ open the browser: `http://localhost:5777/test.html`



#### Transformers example

For the example, we will use `nameof` transformer: [ts-nameof](https://github.com/dsherret/ts-nameof/tree/main/packages/ts-nameof)

1. Install the transformer
```bash
npm install ts-nameof @types/ts-nameof --save-dev
```

2. Locate your `ts` configuration and add to the root
```json
{
    "compilerOptions": {

    },
    "transformers": {
        "before": ["ts-nameof"]
    }
}
```


----
The MIT License
