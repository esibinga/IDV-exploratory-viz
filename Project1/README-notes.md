(base) MacBook-Pro-5:IDV-exploratory-viz evasibinga$ npm init
This utility will walk you through creating a package.json file.
It only covers the most common items, and tries to guess sensible defaults.

See `npm help json` for definitive documentation on these fields
and exactly what they do.

Use `npm install <pkg>` afterwards to install a package and
save it as a dependency in the package.json file.

Press ^C at any time to quit.
package name: (idv-exploratory-viz) 
version: (1.0.0) 
description: 
entry point: (index.js) 
test command: 
git repository: (https://github.com/esibinga/IDV-exploratory-viz) 
keywords: 
author: 
license: (ISC) 
About to write to /Users/evasibinga/IDV-exploratory-viz/package.json:

{
  "name": "idv-exploratory-viz",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "directories": {
    "lib": "lib"
  },
  "dependencies": {
    "parse-gedcom": "^1.0.5"
  },
  "devDependencies": {},
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "repository": {
    "type": "git",
    "url": "git+https://github.com/esibinga/IDV-exploratory-viz.git"
  },
  "author": "",
  "license": "ISC",
  "bugs": {
    "url": "https://github.com/esibinga/IDV-exploratory-viz/issues"
  },
  "homepage": "https://github.com/esibinga/IDV-exploratory-viz#readme"
}


Is this OK? (yes) 

(base) MacBook-Pro-5:IDV-exploratory-viz evasibinga$ npm install --save parse-gedcom
npm WARN idv-exploratory-viz@1.0.0 No description

+ parse-gedcom@1.0.5
updated 1 package and audited 11 packages in 2.315s
found 0 vulnerabilities

(base) MacBook-Pro-5:IDV-exploratory-viz evasibinga$ parse-gedcom-d3 data/JGB_MHB.ged > output.json
bash: parse-gedcom: command not found
(base) MacBook-Pro-5:IDV-exploratory-viz evasibinga$ npm install -g parse-gedcom
npm ERR! code EACCES
npm ERR! syscall symlink
npm ERR! path ../lib/node_modules/parse-gedcom/bin/parse-gedcom
npm ERR! dest /usr/local/bin/parse-gedcom
npm ERR! errno -13
npm ERR! Error: EACCES: permission denied, symlink '../lib/node_modules/parse-gedcom/bin/parse-gedcom' -> '/usr/local/bin/parse-gedcom'
npm ERR!  [OperationalError: EACCES: permission denied, symlink '../lib/node_modules/parse-gedcom/bin/parse-gedcom' -> '/usr/local/bin/parse-gedcom'] {
npm ERR!   cause: [Error: EACCES: permission denied, symlink '../lib/node_modules/parse-gedcom/bin/parse-gedcom' -> '/usr/local/bin/parse-gedcom'] {
npm ERR!     errno: -13,
npm ERR!     code: 'EACCES',
npm ERR!     syscall: 'symlink',
npm ERR!     path: '../lib/node_modules/parse-gedcom/bin/parse-gedcom',
npm ERR!     dest: '/usr/local/bin/parse-gedcom'
npm ERR!   },
npm ERR!   stack: "Error: EACCES: permission denied, symlink '../lib/node_modules/parse-gedcom/bin/parse-gedcom' -> '/usr/local/bin/parse-gedcom'",
npm ERR!   errno: -13,
npm ERR!   code: 'EACCES',
npm ERR!   syscall: 'symlink',
npm ERR!   path: '../lib/node_modules/parse-gedcom/bin/parse-gedcom',
npm ERR!   dest: '/usr/local/bin/parse-gedcom'
npm ERR! }
npm ERR! 
npm ERR! The operation was rejected by your operating system.
npm ERR! It is likely you do not have the permissions to access this file as the current user
npm ERR! 
npm ERR! If you believe this might be a permissions issue, please double-check the
npm ERR! permissions of the file and its containing directories, or try running
npm ERR! the command again as root/Administrator.

npm ERR! A complete log of this run can be found in:
npm ERR!     /Users/evasibinga/.npm/_logs/2020-03-25T17_20_58_015Z-debug.log
(base) MacBook-Pro-5:IDV-exploratory-viz evasibinga$ sudo npm install -g parse-gedcom
Password:
/usr/local/bin/parse-gedcom -> /usr/local/lib/node_modules/parse-gedcom/bin/parse-gedcom
/usr/local/bin/parse-gedcom-d3 -> /usr/local/lib/node_modules/parse-gedcom/bin/parse-gedcom-d3
+ parse-gedcom@1.0.5
added 10 packages from 6 contributors in 1.069s
(base) MacBook-Pro-5:IDV-exploratory-viz evasibinga$ parse-gedcom-d3 < data/JGB_MHB.ged > JGB_MHB2.json
(base) MacBook-Pro-5:IDV-exploratory-viz evasibinga$ parse-gedcom-d3 < data/JGB_MHB.ged > JGB_MHB.json
(base) MacBook-Pro-5:IDV-exploratory-viz evasibinga$ 
