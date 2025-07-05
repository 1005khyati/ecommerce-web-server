const fs = require('fs')
const repl = require('node:repl');
const msg = 'message';

repl.start('> ').context.m = msg; 
const hello = "Hello, World!";
console.log(hello)