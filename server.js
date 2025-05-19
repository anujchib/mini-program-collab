const express = require('express');
const { Lexer } = require('./lexer');
const { Parser } = require('./parser');
const Interpreter = require('./interpreter');

const app = express();
app.use(express.json());
app.use(express.static('.'));

app.post('/run', (req, res) => {
    try {
        const { code } = req.body;
        const lexer = new Lexer(code);
        const parser = new Parser(lexer);
        const interpreter = new Interpreter();
        const ast = parser.parse();
        const result = interpreter.visit(ast);
        res.json({ output: result });
    } catch (error) {
        res.json({ error: error.message });
    }
});

function serializeAST(node) {
    if (!node) return null;

    // Start with a basic object with the type
    const result = { type: node.constructor.name };

    // Add properties based on node type
    if (result.type === 'BinOp') {
        result.left = serializeAST(node.left);
        result.op = { type: node.op.type, value: node.op.value };
        result.right = serializeAST(node.right);
    } else if (result.type === 'Num') {
        result.value = node.value;
    } else if (result.type === 'Var') {
        result.value = node.value;
    } else if (result.type === 'Assign') {
        result.left = serializeAST(node.left);
        result.op = { type: node.op.type, value: node.op.value };
        result.right = serializeAST(node.right);
    } else if (result.type === 'Print') {
        result.expr = serializeAST(node.expr);
    } else if (result.type === 'Program') {
        result.statements = node.statements.map(serializeAST);
    }

    return result;
}

app.post('/ast', (req, res) => {
    try {
        const { code } = req.body;
        const lexer = new Lexer(code);
        const parser = new Parser(lexer);
        const ast = parser.parse();
        
        // Serialize the AST
        const serializedAST = serializeAST(ast);
        
        // For debugging
        console.log('Serialized AST:', JSON.stringify(serializedAST, null, 2));
        
        res.json({ ast: serializedAST });
    } catch (error) {
        console.error('Error parsing AST:', error);
        res.json({ error: error.message });
    }
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});