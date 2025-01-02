# npm-license-tool

Check license information of NPM packages from package-lock.json input file and write to CSV output file.

# Compilation

```
npm i
npm run build
```

# Usage

```
Usage:
        npm start -- [[options]...] <input_file> <output_file>

Or
        node ./dist/index [[options]...] <input_file> <output_file>

Options:
        --help                  Print this help.
        --skip-dev <true|false> Skip checking for dev dependencies. Default is true.
```

License information sometimes missing from the report because not all the packages are well inventoried. It is required to manually check for the information either by following the repository or by reviewing information on https://www.npmjs.com/.
