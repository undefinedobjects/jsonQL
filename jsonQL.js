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
                    value: regex
                };
            } else {
                lexerObject = {
                    type: lexerType.KEY.name,
                    value: property
                };
            }

            let detectFunction = property.split(/([^()]+)(\(.+?\))/g).filter(item => item !== '');

            if(detectFunction.length > 1) {
                lexerObject.function = detectFunction.slice(1).join('');
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
                value = Function(`return this !== globalThis && ${lexer.function}`).call(value)
            }
        }

        return value;
    }

    return parser(jsonObject, lexer(stringPath));
}