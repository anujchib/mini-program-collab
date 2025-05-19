class Token {
    constructor(type, value) {
        this.type = type;
        this.value = value;
    }
}

class Lexer {
    constructor(text) {
        this.text = text;
        this.pos = 0;
        this.currentChar = this.text[this.pos] || null;
        this.tokens = [];
        
        // Token types
        this.TOKEN_TYPES = {
            'PLUS': '+',
            'MINUS': '-',
            'MULTIPLY': '*',
            'DIVIDE': '/',
            'LPAREN': '(',
            'RPAREN': ')',
            'ASSIGN': '=',
            'PRINT': 'print',
            'ID': null,  // Will be determined by is_identifier
            'NUMBER': null,  // Will be determined by is_number
            'EOF': null
        };
    }

    error() {
        throw new Error('Invalid character');
    }

    advance() {
        this.pos++;
        this.currentChar = this.text[this.pos] || null;
    }

    skipWhitespace() {
        while (this.currentChar && /\s/.test(this.currentChar)) {
            this.advance();
        }
    }

    number() {
        let result = '';
        while (this.currentChar && (/[0-9.]/.test(this.currentChar))) {
            result += this.currentChar;
            this.advance();
        }
        return new Token('NUMBER', parseFloat(result));
    }

    identifier() {
        let result = '';
        while (this.currentChar && (/[a-zA-Z0-9_]/.test(this.currentChar))) {
            result += this.currentChar;
            this.advance();
        }
        
        // Check if identifier is a keyword
        if (result === 'print') {
            return new Token('PRINT', result);
        }
        return new Token('ID', result);
    }

    getNextToken() {
        while (this.currentChar) {
            if (/\s/.test(this.currentChar)) {
                this.skipWhitespace();
                continue;
            }

            if (/[0-9]/.test(this.currentChar)) {
                return this.number();
            }

            if (/[a-zA-Z]/.test(this.currentChar)) {
                return this.identifier();
            }

            if (this.currentChar === '+') {
                this.advance();
                return new Token('PLUS', '+');
            }

            if (this.currentChar === '-') {
                this.advance();
                return new Token('MINUS', '-');
            }

            if (this.currentChar === '*') {
                this.advance();
                return new Token('MULTIPLY', '*');
            }

            if (this.currentChar === '/') {
                this.advance();
                return new Token('DIVIDE', '/');
            }

            if (this.currentChar === '(') {
                this.advance();
                return new Token('LPAREN', '(');
            }

            if (this.currentChar === ')') {
                this.advance();
                return new Token('RPAREN', ')');
            }

            if (this.currentChar === '=') {
                this.advance();
                return new Token('ASSIGN', '=');
            }

            this.error();
        }

        return new Token('EOF', null);
    }
}

module.exports = { Token, Lexer }; 