function jsonQL(jsonObject, stringPath) {
    function lexer(stringProperties) {
        let splittedProperties = stringProperties.split(/\.(?![^\(].*\))(?![^\<].*\>)/g);

        let lexers = [];
        for (const property of splittedProperties) {
            if(/\[[0-9]+\]/.test(property)) {
                const index = parseInt(property.replace(/[\[\]]/g, ''), 10);
                lexers.push({
                    type: 'index',
                    value: index
                });
            } else if(/\<.*\>/.test(property)) {
                const regex = property.substring(1, property.length - 1);
                lexers.push({
                    type: 'regex',
                    value: new RegExp(regex, 'g')
                });
            } else if(/\(.*\)/.test(property)) {
                const index = property.indexOf('(');
                let thisKey = property.substring(0,  index);
                thisKey = property.substring(thisKey.lastIndexOf('.') + 1, index);
                const func =  property.substring(index + 1, property.length - 1);

                lexers.push({
                    type: 'function',
                    value: {
                        this: thisKey,
                        function: func
                    }
                });
            } else {
                lexers.push({
                    type: 'key',
                    value: property
                });
            }
        }
        return lexers;
    }

    function parser(jsonObject, lexerObject) {
        if(typeof jsonObject === 'string') {
            jsonObject = JSON.parse(jsonObject);
        }

        let value = jsonObject;
        for (const lexer of lexerObject) {
            if(lexer.type === 'index') {
                const getKey = Object.keys(value)[lexer.value];
                value = value[getKey];
            } else if(lexer.type === 'regex') {
                const getKeys = Object.keys(value).filter(key => new RegExp(lexer.value).test(key));
                value = getKeys.map(key => value[key]);
            } else if(lexer.type === 'function') {
               //TODO: add function filter
            } else {
                if(Array.isArray(value)) {
                    value = value.filter(key => key[lexer.value]);
                } else {
                    value = value[lexer.value];
                }
            }
        }

        return value;
    }

    return parser(jsonObject, lexer(stringPath));
}

let obj = {say: { message: 'hello' }, say2: { message: 'hello' }};
//TODO:
//let getObj = jsonQL(obj, 'say.message(this.length > 10)');
let getObj1 = jsonQL(obj, 'say.message');
let getObj2 = jsonQL(obj, '<say.*>.message');
console.log(getObj1, getObj2);