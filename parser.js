const { Token, Lexer } = require('./lexer');

class AST {
    constructor() {}
}

class Program extends AST {
    constructor(statements) {
        super();
        this.statements = statements;
    }
}

class BinOp extends AST {
    constructor(left, op, right) {
        super();
        this.left = left;
        this.token = this.op = op;
        this.right = right;
    }
}

class Num extends AST {
    constructor(token) {
        super();
        this.token = token;
        this.value = token.value;
    }
}

class Var extends AST {
    constructor(token) {
        super();
        this.token = token;
        this.value = token.value;
    }
}

class Assign extends AST {
    constructor(left, op, right) {
        super();
        this.left = left;
        this.token = this.op = op;
        this.right = right;
    }
}

class Print extends AST {
    constructor(expr) {
        super();
        this.expr = expr;
    }
}

class StringLiteral extends AST {
    constructor(token) {
        super();
        this.token = token;
        this.value = token.value;
    }
}

class CharLiteral extends AST {
    constructor(token) {
        super();
        this.token = token;
        this.value = token.value;
    }
}

class GetInput extends AST {
    constructor(prompt) {
        super();
        this.prompt = prompt;
    }
}

class Parser {
    constructor(lexer) {
        this.lexer = lexer;
        this.currentToken = this.lexer.getNextToken();
    }

    error(message) {
        throw new Error(`Parser error: ${message}`);
    }

    eat(tokenType) {
        if (this.currentToken.type === tokenType) {
            this.currentToken = this.lexer.getNextToken();
        } else {
            this.error(`Expected ${tokenType}, got ${this.currentToken.type}`);
        }
    }

    program() {
        // program : statement*
        const statements = [];
        while (this.currentToken.type !== 'EOF') {
            statements.push(this.statement());
        }
        return new Program(statements);
    }

    statement() {
        // statement : assignment_statement | print_statement
        const token = this.currentToken;
        let node;
        if (token.type === 'PRINT') {
            node = this.printStatement();
        } else {
            node = this.assignmentStatement();
        }
        return node;
    }

    printStatement() {
        // print_statement : PRINT LPAREN expr RPAREN
        this.eat('PRINT');
        this.eat('LPAREN');
        const node = new Print(this.expr());
        this.eat('RPAREN');
        return node;
    }

    assignmentStatement() {
        // assignment_statement : variable ASSIGN expr
        const left = this.variable();
        const token = this.currentToken;
        this.eat('ASSIGN');
        const right = this.expr();
        const node = new Assign(left, token, right);
        return node;
    }

    variable() {
        // variable : ID
        const node = new Var(this.currentToken);
        this.eat('ID');
        return node;
    }

    expr() {
        // expr : term ((PLUS | MINUS) term)*
        let node = this.term();

        while (this.currentToken.type === 'PLUS' || this.currentToken.type === 'MINUS') {
            const token = this.currentToken;

            if (token.type === 'PLUS') {
                this.eat('PLUS');
            } else if (token.type === 'MINUS') {
                this.eat('MINUS');
            }

            node = new BinOp(node, token, this.term());
        }

        return node;
    }

    term() {
        // term : factor ((MULTIPLY | DIVIDE) factor)*
        let node = this.factor();

        while (this.currentToken.type === 'MULTIPLY' || this.currentToken.type === 'DIVIDE') {
            const token = this.currentToken;

            if (token.type === 'MULTIPLY') {
                this.eat('MULTIPLY');
            } else if (token.type === 'DIVIDE') {
                this.eat('DIVIDE');
            }

            node = new BinOp(node, token, this.factor());
        }

        return node;
    }

    factor() {
        // factor : NUMBER | STRING | CHAR | LPAREN expr RPAREN | variable | getinput
        const token = this.currentToken;
        let node;

        if (token.type === 'NUMBER') {
            this.eat('NUMBER');
            node = new Num(token);
        } else if (token.type === 'STRING') {
            this.eat('STRING');
            node = new StringLiteral(token);
        } else if (token.type === 'CHAR') {
            this.eat('CHAR');
            node = new CharLiteral(token);
        } else if (token.type === 'LPAREN') {
            this.eat('LPAREN');
            node = this.expr();
            this.eat('RPAREN');
        } else if (token.type === 'GETINPUT') {
            this.eat('GETINPUT');
            this.eat('LPAREN');
            const prompt = this.expr();
            this.eat('RPAREN');
            node = new GetInput(prompt);
        } else {
            node = this.variable();
        }

        return node;
    }

    parse() {
        return this.program();
    }
}

module.exports = { AST, Program, BinOp, Num, Var, Assign, Print, StringLiteral, CharLiteral, GetInput, Parser }; 