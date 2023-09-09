# jsonQL
 
```js
let obj = {say: { message: 'hello' }, say2: { message: 'hello2' }};

console.log(jsonQL(obj, 'say.message'));
console.log(...jsonQL(obj, '<say.*>.message'));
console.log(jsonQL(obj, '<say.*>.[1]'));
console.log(jsonQL(obj, '<say.*>.[1](this.message == "hello2")'));
console.log(jsonQL(obj, 'say.message'));
console.log(jsonQL(obj, '<say.*>.[0].[0].(this)'));
console.log(jsonQL(obj, '<say.*>.[0].message(this)'));
console.log(jsonQL(obj, '<say.*>.[0].message'));
console.log(jsonQL(obj, '<say.*>.[0].message()'));
/*
outputs:
hello
{message: 'hello'} {message: 'hello2'}
{message: 'hello2'}
true
hello
undefined
false
hello
undefined
```
