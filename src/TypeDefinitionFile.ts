
export function createVirtualFile (File) {
    return class TypeDefinitionFile extends File {
        read(opts) {
            if (this.exists('mapOnly'))
                return super.read(opts)

            var path = this.getSourcePath();
            if (path == null)
                return null;

            var file = new File(path);
            file.read({
                ...(opts ?? {}),
                foo: {
                    bar: 1
                }
            });
            return (this.content = file.sourceMap);
        }

        readAsync(opts): Promise<string | Buffer> {
            if (this.exists('mapOnly'))
                return super.readAsync(opts)

            var path = this.getSourcePath();
            if (path == null) {
                return Promise.reject({
                    code: 404,
                    filename: this.uri.toLocalFile(),
                    message: 'Path equals original'
                }) as any;
            }

            let file = new File(path, {
                cached: false,
                'atma-loader-ts': {
                    dtsOnly: true,
                }
            });
            let prom = file.readAsync({
                ...(opts ?? {}),
                cached: false
            });
            return prom.then(() => {
                return (this.content = file.content);
            }) as any;
        }
        exists(check?) {
            if (super.exists())
                return true;
            if (check === 'mapOnly')
                return false;

            var path = this.getSourcePath();
            return path != null
                ? File.exists(path)
                : false;
        }

        getSourcePath() {
            var path = this.uri.toString(),
                source = path.replace(/\.d\.ts$/i, '.ts');
            return path === source
                ? null
                : source;
        }
    };

}

