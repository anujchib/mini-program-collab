# 🌟 Mini Programming Language Playground

![Node.js](https://img.shields.io/badge/Node.js-14%2B-green?logo=node.js)
![Express](https://img.shields.io/badge/Express-Web%20Server-lightgrey?logo=express)
![JavaScript](https://img.shields.io/badge/JavaScript-ES6%2B-yellow?logo=javascript)
![WebApp](https://img.shields.io/badge/Web%20App-HTML%2FCSS%2FJS-orange?logo=html5)

---

> **A beautiful, interactive web-based playground for learning how programming languages work!**

---

## 🚀 What is This Project?

Welcome to the **Mini Programming Language Playground**! This project is a modern, browser-based environment for writing, running, and visualizing code in a custom-designed language. With a gorgeous interface and instant feedback, you can:

- ✍️ **Write code** in a live editor
- ⚡ **Run code** and see output instantly
- 🌳 **Visualize the Abstract Syntax Tree (AST)**
- 🎨 **Enjoy a clean, responsive UI**

Whether you're a student, teacher, or just curious about interpreters and compilers, this project is for you!

---

## ✨ Features

- 🖥️ **Intuitive Web GUI:** Write, edit, and run code in your browser—no command-line needed.
- 🔥 **Live Output:** See results instantly as you run your code.
- 🌳 **AST Visualization:** Click a button to see your code's structure as a tree.
- 🎯 **Simple, Educational Syntax:** Great for learning and teaching.
- 📱 **Responsive Design:** Works on desktops and tablets.
- 🧩 **Modular Codebase:** Easy to extend and customize.

---

## 🛠️ Getting Started

### 1. Prerequisites
- [Node.js](https://nodejs.org/) (v14 or higher recommended)
- A modern web browser (Chrome, Firefox, Edge, Safari)

### 2. Installation
```bash
git clone <repo-url>
cd mini-program-collab-master
npm install
```

### 3. Start the Web Server
```bash
node server.js
```

### 4. Open the Web App
Open your browser and go to:
```
http://localhost:3000
```

---

## 📝 How to Use

1. **Write your code** in the editor panel on the left.
2. **Run your code** by clicking the **Run Code** button. The output will appear below the editor.
3. **Visualize the AST** by clicking **Show AST**. The right panel will display a tree diagram representing your code's structure.
4. **Experiment!** Try different expressions, assignments, and print statements to see how the interpreter and AST visualization respond.

> 💡 **Tip:** The more you experiment, the more you'll learn about how programming languages parse and execute code!

---

## 🧑‍💻 Language Syntax

The mini programming language is designed to be simple and approachable. Here’s what you can do:

- **Variables:** Assign values using `=`
- **Arithmetic:** Use `+`, `-`, `*`, `/` for calculations
- **Print:** Output values with `print(expression)`

#### Example Program
```plaintext
x = 5
y = 10
z = x + y * 2
print(z)
```

#### Example Output
```plaintext
25
```

---

## 🌳 AST Visualization

The AST (Abstract Syntax Tree) panel shows how your code is broken down by the parser. Each node represents an operation, assignment, variable, or literal. This is a great way to learn about language parsing and interpretation!

- 🟩 **Green nodes:** Program root
- 🟧 **Orange nodes:** Assignments
- 🟥 **Red nodes:** Print statements
- 🟦/**🟪** Blue/Purple nodes: Variables and numbers
- 🎨 **Other colors:** Arithmetic operations

> 📚 **Why ASTs?**
> 
> ASTs are a core concept in compilers and interpreters. Visualizing them helps you understand how code is structured and executed under the hood!

---

## 📁 Project Structure

| File            | Purpose                                      |
|-----------------|----------------------------------------------|
| `lexer.js`      | Tokenizes your code into meaningful pieces   |
| `parser.js`     | Turns tokens into an AST                     |
| `interpreter.js`| Walks the AST and executes your code         |
| `server.js`     | Express server for the web GUI               |
| `app.js`        | Handles frontend logic for running code and AST visualization |
| `style.css`     | Styles for the web interface                 |
| `main.js`       | (No longer used for CLI; see code comments)  |

---

## 📦 Dependencies

![Express](https://img.shields.io/badge/Express-5.x-lightgrey?logo=express)
![Body-Parser](https://img.shields.io/badge/body--parser-2.x-blue)
![Readline-Sync](https://img.shields.io/badge/readline--sync-1.x-yellow)

---

## ❓ FAQ

**Q: Can I use this project from the command line?**  
A: No, all command-line functionality has been removed. Please use the web interface for all features.

**Q: Can I add new features or syntax?**  
A: Absolutely! The codebase is clean and modular. Check out `lexer.js`, `parser.js`, and `interpreter.js` to extend the language.

**Q: Is this project suitable for teaching?**  
A: Yes! The visual AST and simple syntax make it perfect for classrooms and workshops.

---

## 🤝 Contributors & Support

- **Project Maintainer:** Anuj Chib
- **Contributions:** PRs and suggestions are welcome! Feel free to fork and improve.
- **Need Help?** Open an issue or start a discussion.

---

## 📜 License

MIT

---

> *Created for educational and demonstration purposes. Have fun exploring and visualizing your own mini programs!* 
