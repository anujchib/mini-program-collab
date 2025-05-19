const { Lexer } = require('./lexer');
const { Parser, BinOp, Num, Var, Assign, Print, Program, StringLiteral, CharLiteral, GetInput } = require('./parser');

class NodeVisitor {
    visit(node) {
        const methodName = `visit${node.constructor.name}`;
        const visitor = this[methodName] || this.genericVisit;
        return visitor.call(this, node);
    }

    genericVisit(node) {
        throw new Error(`No visit${node.constructor.name} method`);
    }
}

class Interpreter extends NodeVisitor {
    constructor() {
        super();
        this.variables = {};
        this.inputCallback = null;
    }

    setInputCallback(callback) {
        this.inputCallback = callback;
    }

    visitProgram(node) {
        let result = '';
        for (const statement of node.statements) {
            const value = this.visit(statement);
            if (value !== undefined) {
                result += value + '\n';
            }
        }
        return result.trim();
    }

    visitBinOp(node) {
        const left = this.visit(node.left);
        const right = this.visit(node.right);

        if (node.op.type === 'PLUS') {
            // String concatenation
            if (typeof left === 'string' || typeof right === 'string') {
                return String(left) + String(right);
            }
            return left + right;
        } else if (node.op.type === 'MINUS') {
            return left - right;
        } else if (node.op.type === 'MULTIPLY') {
            // String multiplication
            if (typeof left === 'string' && typeof right === 'number') {
                return left.repeat(right);
            } else if (typeof right === 'string' && typeof left === 'number') {
                return right.repeat(left);
            }
            return left * right;
        } else if (node.op.type === 'DIVIDE') {
            return left / right;
        }
    }

    visitNum(node) {
        return node.value;
    }

    visitVar(node) {
        const varName = node.value;
        if (!(varName in this.variables)) {
            throw new Error(`Variable ${varName} is not defined`);
        }
        return this.variables[varName];
    }

    visitAssign(node) {
        const varName = node.left.value;
        this.variables[varName] = this.visit(node.right);
        return this.variables[varName];
    }

    visitPrint(node) {
        const value = this.visit(node.expr);
        return `print(${value})`;
    }

    visitStringLiteral(node) {
        return node.value;
    }

    visitCharLiteral(node) {
        return node.value;
    }

    visitGetInput(node) {
        const prompt = this.visit(node.prompt);
        if (this.inputCallback) {
            return this.inputCallback(prompt);
        }
        throw new Error('Input callback not set');
    }

    interpret(text) {
        const lexer = new Lexer(text);
        const parser = new Parser(lexer);
        const tree = parser.parse();
        return this.visit(tree);
    }
}

module.exports = Interpreter; 