document.addEventListener('DOMContentLoaded', () => {
    const codeInput = document.getElementById('codeInput');
    const runBtn = document.getElementById('runBtn');
    const showASTBtn = document.getElementById('showASTBtn');
    const output = document.getElementById('output');
    const astVisualization = document.getElementById('astVisualization');

    function convertASTToTreeData(node) {
        if (!node) return null;
        
        const treeData = {
            name: node.type || 'Unknown',
            children: []
        };

        // Add node-specific information based on node type
        switch (node.type) {
            case 'BinOp':
                treeData.name = `${node.op.type} (${node.op.value})`;
                treeData.children.push(convertASTToTreeData(node.left));
                treeData.children.push(convertASTToTreeData(node.right));
                break;
            case 'Num':
                treeData.name = `Number (${node.value || node.token.value})`;
                break;
            case 'Var':
                treeData.name = `Variable (${node.value || node.token.value})`;
                break;
            case 'Assign':
                treeData.name = 'Assignment';
                treeData.children.push(convertASTToTreeData(node.left));
                treeData.children.push(convertASTToTreeData(node.right));
                break;
            case 'Print':
                treeData.name = 'Print';
                treeData.children.push(convertASTToTreeData(node.expr));
                break;
            case 'Program':
                treeData.name = 'Program';
                if (Array.isArray(node.statements)) {
                    node.statements.forEach(statement => {
                        treeData.children.push(convertASTToTreeData(statement));
                    });
                }
                break;
            case 'StringLiteral':
                treeData.name = `String Literal ("${node.value}")`;
                break;
            case 'CharLiteral':
                treeData.name = `Char Literal ('${node.value}')`;
                break;
            case 'GetInput':
                treeData.name = 'GetInput';
                treeData.children.push(convertASTToTreeData(node.prompt));
                break;
            default:
                treeData.name = `Unknown (${node.type})`;
        }

        return treeData;
    }

    function visualizeAST(ast) {
        // Clear previous visualization
        astVisualization.innerHTML = '';
        
        // For debugging
        console.log('AST to visualize:', ast);
        
        const treeData = convertASTToTreeData(ast);
        if (!treeData) {
            output.textContent = 'Error: Unable to parse AST data';
            return;
        }

        // Get actual container dimensions
        const containerWidth = astVisualization.clientWidth;
        const containerHeight = astVisualization.clientHeight || 500;
        
        // Create SVG
        const svg = d3.select('#astVisualization')
            .append('svg')
            .attr('width', '100%')
            .attr('height', '100%')
            .attr('viewBox', `0 0 ${containerWidth} ${containerHeight}`)
            .attr('preserveAspectRatio', 'xMidYMid meet')
            .append('g')
            .attr('transform', `translate(${40},${20})`);

        // Calculate margins and usable space
        const margin = { top: 20, right: 40, bottom: 40, left: 40 };
        const width = containerWidth - margin.left - margin.right;
        const height = containerHeight - margin.top - margin.bottom;

        // Define tree layout with more space for larger area
        const tree = d3.tree()
            .size([width, height])
            .nodeSize([100, 100]); // Increase spacing for larger area

        // Resolve overlapping by adding a separation function
        function separation(a, b) {
            return a.parent === b.parent ? 1.8 : 2.5; // Increase separation for larger area
        }
        
        // Apply separation
        tree.separation(separation);

        // Create root hierarchy
        const root = d3.hierarchy(treeData);
        
        // Calculate tree layout
        tree(root);

        // Center the tree horizontally
        const maxDepth = root.height;
        const centerX = width / 2;
        const centerY = margin.top + 40;

        // Create links
        svg.selectAll('.link')
            .data(root.links())
            .enter()
            .append('path')
            .attr('class', 'link')
            .attr('d', d3.linkHorizontal()
                .x(d => d.y)
                .y(d => d.x));

        // Create nodes
        const nodes = svg.selectAll('.node')
            .data(root.descendants())
            .enter()
            .append('g')
            .attr('class', 'node')
            .attr('transform', d => `translate(${d.y},${d.x})`);

        // Add circles to nodes
        nodes.append('circle')
            .attr('r', 10)
            .style('fill', d => {
                // Custom colors for different node types
                switch (d.data.name.split(' ')[0]) {
                    case 'Program': return '#4CAF50';
                    case 'Assignment': return '#FFA000';
                    case 'Print': return '#F44336';
                    case 'Variable': return '#2196F3';
                    case 'Number': return '#9C27B0';
                    case 'PLUS': return '#FF5722';
                    case 'MINUS': return '#FF9800';
                    case 'MULTIPLY': return '#3F51B5';
                    case 'DIVIDE': return '#00BCD4';
                    default: return '#607D8B';
                }
            });

        // Add text labels
        nodes.append('text')
            .attr('dy', '.35em')
            .attr('x', d => d.children ? -13 : 13)
            .attr('y', d => {
                // Adjust text position for Print and certain operation nodes
                if (d.data.name === 'Print') {
                    return -15; // Move Print label up
                } else if (d.data.name.includes('MULTIPLY')) {
                    return 15; // Move MULTIPLY label down
                }
                return 0;
            })
            .style('text-anchor', d => d.children ? 'end' : 'start')
            .text(d => d.data.name)
            // Add a background rectangle to make text more readable
            .each(function(d) {
                const text = d3.select(this);
                const bbox = this.getBBox();
                const padding = 2;
                
                d3.select(this.parentNode)
                    .insert('rect', 'text')
                    .attr('x', bbox.x - padding)
                    .attr('y', bbox.y - padding)
                    .attr('width', bbox.width + (padding * 2))
                    .attr('height', bbox.height + (padding * 2))
                    .attr('rx', 3)
                    .attr('fill', '#272727')
                    .attr('fill-opacity', 0.7);
            });

        // Add zoom behavior
        const zoom = d3.zoom()
            .scaleExtent([0.3, 3])
            .on('zoom', (event) => {
                svg.attr('transform', event.transform);
            });

        // Calculate the best position to center the tree
        const initialTransform = () => {
            // Set initial scale based on tree complexity
            const scale = Math.min(1, 800 / (root.height * 180));
            
            // Calculate position to center tree
            const xOffset = width / 4;
            return d3.zoomIdentity
                .translate(xOffset, height / 2)
                .scale(scale);
        };

        d3.select(astVisualization).select('svg')
            .call(zoom)
            .call(zoom.transform, initialTransform());
    }

    async function handleInput(prompt) {
        // Create input dialog
        const inputDialog = document.createElement('div');
        inputDialog.className = 'input-dialog';
        inputDialog.innerHTML = `
            <div class="input-content">
                <p>${prompt}</p>
                <input type="text" id="userInput">
                <button id="submitInput">Submit</button>
            </div>
        `;
        document.body.appendChild(inputDialog);

        // Focus the input field
        const inputField = inputDialog.querySelector('#userInput');
        inputField.focus();

        // Return promise that resolves with user input
        return new Promise((resolve) => {
            inputDialog.querySelector('#submitInput').addEventListener('click', async () => {
                const input = inputField.value;
                document.body.removeChild(inputDialog);
                
                // Send input to server
                const response = await fetch('/input', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ input })
                });
                const data = await response.json();
                
                if (data.error) {
                    output.textContent = `Error: ${data.error}`;
                    output.className = 'error';
                } else {
                    output.textContent = data.output || 'Input processed successfully.';
                    output.className = 'success';
                }
                
                resolve(input);
            });

            // Also handle Enter key
            inputField.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    inputDialog.querySelector('#submitInput').click();
                }
            });
        });
    }

    runBtn.addEventListener('click', async () => {
        try {
            output.textContent = 'Running code...';
            output.className = 'info';
            
            const text = codeInput.value;
            const response = await fetch('/run', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ code: text })
            });
            const data = await response.json();
            
            if (data.error) {
                output.textContent = `Error: ${data.error}`;
                output.className = 'error';
            } else if (data.status === 'input_required') {
                output.textContent = data.prompt;
                output.className = 'info';
                await handleInput(data.prompt);
            } else {
                output.textContent = data.output || 'Code executed successfully.';
                output.className = 'success';
            }
        } catch (error) {
            console.error('Error running code:', error);
            output.textContent = `Connection Error: ${error.message}. Make sure the server is running.`;
            output.className = 'error';
        }
    });

    showASTBtn.addEventListener('click', async () => {
        try {
            output.textContent = 'Generating AST visualization...';
            output.className = 'info';
            
            const text = codeInput.value;
            const response = await fetch('/ast', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ code: text })
            });
            const data = await response.json();
            
            if (data.error) {
                output.textContent = `Error: ${data.error}`;
                output.className = 'error';
            } else if (!data.ast) {
                output.textContent = 'Error: No AST data received';
                output.className = 'error';
            } else {
                output.textContent = 'AST visualization generated';
                output.className = 'success';
                visualizeAST(data.ast);
            }
        } catch (error) {
            console.error('Error generating AST:', error);
            output.textContent = `Connection Error: ${error.message}. Make sure the server is running.`;
            output.className = 'error';
        }
    });
});