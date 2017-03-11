[TypeScript Compiler](http://www.typescriptlang.org) (Atma Plugin)
-----
[![Build Status](https://travis-ci.org/atmajs/atma-loader-ts.png?branch=master)](https://travis-ci.org/atmajs/atma-loader-ts)

_with proper stacktrace support_

The Plugin extends:
- [`IncludeJS`](https://github.com/atmajs/IncludeJS) with a custom loader
- [`atma-io`](https://github.com/atmajs/atma-io) with a custom middleware to read ES6 files
- [`atma-server`](https://github.com/atmajs/atma-server) and [`Atma Toolkit`](https://github.com/atmajs/Atma.Toolkit) with a `HTTPHandler` to serve compiled sources (with **sourceMap** support)



##### How to use

###### Embed into the Project

+ `atma plugin install atma-loader-ts`

	This adds `atma-loader-babel` npm dependency and the `package.json` would look like:
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
						"extensions" : [ "ts" ]
						"typescript": {} // typescript compiler options
					}
                }
            }
        }
    ```
+ That's all. Now, you are ready to use TypeScript in your project

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



----
The MIT License