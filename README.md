# jsonQL

1. First, create a repository on GitHub or add this function to an existing repository.

2. Store your JSON data in a variable or load it from a file. For example, assuming you have a JSON file named `data.json`, you can read it using Node.js:

```javascript
const fs = require('fs');

// Read JSON data
const jsonData = fs.readFileSync('data.json', 'utf8');
```

3. Now, you can query your JSON data using the jsonQL function:

```javascript
const obj = { say: { message: 'hello' }, say2: { message: 'hello2' } };

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
undefined*/
```

This code queries your JSON data in various ways and prints the results to the console. To share this code on GitHub, create a JavaScript file, add this code to your file, and upload it to your GitHub repository. Then, you can share the repository URL for others to view.

1. **INDEX:**
   - **Definition**: This lexer type is used to index arrays in JSON objects. For example, in a query like `array[0]`, the `[0]` part is an INDEX.
   - **Example**: `jsonQL(obj, 'say[0].message')`
   - **Description**: This query accesses the first element (0 index) of the `say` array and then accesses the `message` property.

2. **REGEX (Regular Expression):**
   - **Definition**: This lexer type is used to select properties in JSON objects based on regular expressions. Specifically, a regular expression enclosed between `<` and `>` characters is used.
   - **Example**: `jsonQL(obj, '<say.*>.message')`
   - **Description**: This query selects any property that starts with `say` and accesses the `message` property of those selected properties.

3. **KEY:**
   - **Definition**: This lexer type is used to directly access properties in JSON objects using their key names.
   - **Example**: `jsonQL(obj, 'say.message')`
   - **Description**: This query directly accesses the `message` property inside the `say` property.

4. **Function:**
   - **Definition**: Represents a special function used to process and transform JSON data. It is called at the end of your query to perform operations on a property.
   - **Example**: `jsonQL(obj, 'say.message(this.length > 5)')`
   - **Description**: This query accesses the `message` property inside the `say` property and calls a function on this property. The function checks the length of the message and returns true if it's longer than 5 characters.

Each lexer type exhibits different behaviors when applying your queries to JSON data and helps you access specific properties of JSON objects.
