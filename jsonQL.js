                           function jsonQL(jsonObject, stringPath) {
    const lexerType = {
        INDEX: {
            name: 'index',
            regex: /\[[0-9]+\]/
        },
        REGEX: {
            name: 'regex',
            regex: /\<.*\>/
        },
        KEY: {
            name: 'key',
            regex: null
        }
    };

    function lexer(stringProperties) {
        let splittedProperties = stringProperties.split(/\.(?![^\(]*\))(?![^<]*>)/g);

        let lexers = [];
        for (const property of splittedProperties) {
            let lexerObject = {};

            if(lexerType.INDEX.regex.test(property)) {
                const index = parseInt(property.replace(/[\[\]]/g, ''), 10);

                lexerObject = {
                    type: lexerType.INDEX.name,
                    value: index
                };
            } else if(lexerType.REGEX.regex.test(property)) {
                const regex = property.substring(1, property.length - 1);

                lexerObject = {
                    type: lexerType.REGEX.name,
                    value: new RegExp(regex, 'g')
                };
            } else {
                lexerObject = {
                    type: lexerType.KEY.name,
                    value: property
                };
            }

            let detectFuntion = property.split(/([^()]+)(\(.+?\))/g).filter(item => item !== '')

            if(detectFuntion.length > 1) {
                lexerObject.function = Function(`return this !== globalThis && ${detectFuntion.slice(1).join('')}`);
            } else {
                lexerObject.function = null;
            }

            lexers.push(lexerObject);
        }

        return lexers;
    }

    function parser(jsonObject, lexerObject) {
        if(typeof jsonObject === 'string') {
            jsonObject = JSON.parse(jsonObject);
        }

        let value = jsonObject;
        for (const lexer of lexerObject) {
            if(lexer.type === lexerType.INDEX.name) {
                const getKey = Object.keys(value)[lexer.value];
                value = value[getKey];
            } else if(lexer.type === lexerType.REGEX.name) {
                const getKeys = Object.keys(value).filter(key => new RegExp(lexer.value).test(key));
                value = getKeys.map(key => value[key]);
            } else {
                if(Array.isArray(value)) {
                    value = value.filter(key => key[lexer.value]);
                } else {
                    value = value[lexer.value];
                }
            }

            if(lexer.function != null) {
                lexer.function.call(value);
            }
        }

        return value;
    }

    return parser(jsonObject, lexer(stringPath));
}

let obj = {say: { message: 'hello' }, say2: { message: 'hello2' }};

let getObj1 = jsonQL(obj, 'say.message');
let getObj2 = jsonQL(obj, '<say.*>.message');
let getObj3 = jsonQL(obj, '<say.*>.[1](this.message.length > 10)');
let getObj4 = jsonQL(obj, '<say.*>.[1](this.message.length < 4)');
let getObj5 = jsonQL(obj, '<say.*>.[0].message()');
let getObj6 = jsonQL(obj, '<say.*>.[0].message');
let getObj7 = jsonQL(obj, '<say.*>.[0].message()');
console.log(getObj1, ...getObj2, getObj3, getObj4, getObj5, getObj6, getObj7);
