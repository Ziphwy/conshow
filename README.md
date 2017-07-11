# Conshow 

## Introduction
A util help to output a log that can be updated, support styles such as table, progress, tree .etc

## Install
```
npm install conshow --save-dev
```

## Quick Start
```js
// index.js
const conshow = require('conshow');
conshow.out('test');

// output
test
```

## Usage
### API
#### out(String, id)
print a string to stdout without '\n'.
```js
conshow.out('test');
```
<div style="background: #333;color:#eee">test<span style="background: #eee;color: #eee">1</span></div>

#### outln(String, id)
print a string to stdout without '\n'.
```js
conshow.outln('test');
```
<div style="background: #333;color:#eee;padding:0.3em;">test<br><span style="background: #eee;color: #eee">1</span></div>
### Directives

#### @underline() / @u()
```js
conshow.out('@underline(test)');
conshow.out('@u(test)');
```
<div style="background: #333;color:#eee;padding:0.3em;"><u>test</u><span style="background: #eee;color: #eee">1</span></div>


#### @inverse() / @i()
```js
conshow.out('@underline(test)');
conshow.out('@u(test)');
```
<div style="background-color:#333; color: #eee;padding:0.3em;"><span style="background-color:#eee; color:#333">test</span><span style="background: #eee;color: #eee">1</span></div>

#### @hide() / @h()
```js
conshow.out('@hide(test)');
conshow.out('@h(test)');
```
<div style="background-color:#333; color: #eee;padding:0.3em;">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style="background: #eee;color: #eee">1</span></div>

#### @f_red() / @f_r()
```js
conshow.out('@f_red(test)');
conshow.out('@f(test)');
```
<div style="background: #333;color:red;padding:0.3em;">test<span style="background: #eee;color: #eee">1</span></div>

## LICENSE
MIT