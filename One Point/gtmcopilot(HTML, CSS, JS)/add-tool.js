#!/usr/bin/env node

/**
 * GTM Copilot - Add New Tool Script
 * 
 * This script automates the process of adding a new tool to the GTM Copilot application.
 * It updates the HTML and JavaScript files to include the new tool.
 * 
 * Usage:
 *   node add-tool.js "Tool Name" "https://tool-url.com"
 *   node add-tool.js "Tool Name" "https://tool-url.com" --wa  (for Workflow Assistant tools)
 *   node add-tool.js "Tool Name" "https://tool-url.com" --copilot  (for Copilot-specific tools)
 */

const fs = require('fs');
const path = require('path');

// ANSI color codes for terminal output
const colors = {
    reset: '\x1b[0m',
    green: '\x1b[32m',
    red: '\x1b[31m',
    yellow: '\x1b[33m',
    blue: '\x1b[36m',
    bold: '\x1b[1m'
};

// File paths
const PATHS = {
    html: path.join(__dirname, 'index.html'),
    script: path.join(__dirname, 'assets', 'js', 'script.js'),
    css: path.join(__dirname, 'assets', 'css', 'styles.css')
};

/**
 * Escape HTML special characters to prevent injection
 */
function escapeHtml(text) {
    const map = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
    return text.replace(/[&<>"']/g, (m) => map[m]);
}

/**
 * Validate URL format
 */
function isValidUrl(url) {
    try {
        new URL(url);
        return url.startsWith('http://') || url.startsWith('https://');
    } catch {
        return false;
    }
}

/**
 * Check if file exists
 */
function fileExists(filePath) {
    try {
        return fs.existsSync(filePath);
    } catch {
        return false;
    }
}

/**
 * Safely read file content with error handling
 */
function readFile(filePath) {
    try {
        return fs.readFileSync(filePath, 'utf8');
    } catch (error) {
        throw new Error(`Failed to read ${path.basename(filePath)}: ${error.message}`);
    }
}

/**
 * Safely write file content with error handling
 */
function writeFile(filePath, content) {
    try {
        fs.writeFileSync(filePath, content, 'utf8');
    } catch (error) {
        throw new Error(`Failed to write ${path.basename(filePath)}: ${error.message}`);
    }
}

/**
 * Check if tool already exists in HTML
 */
function toolExists(displayName) {
    try {
        const htmlContent = readFile(PATHS.html);
        return htmlContent.includes(`data-tool="${displayName}"`);
    } catch {
        return false;
    }
}

/**
 * Check if product ID already exists in URL_ROUTES
 */
function productIdExists(productId) {
    try {
        const scriptContent = readFile(PATHS.script);
        return scriptContent.includes(`'${productId}':`);
    } catch {
        return false;
    }
}

/**
 * Generate a unique product ID from tool name
 */
function generateProductId(toolName) {
    let baseId = toolName
        .toLowerCase()
        .replace(/[^a-z0-9\s]/g, '')
        .trim()
        .replace(/\s+/g, '_')
        .replace(/__+/g, '_');
    
    let productId = baseId;
    let suffix = 1;
    
    while (productIdExists(productId)) {
        productId = `${baseId}_${suffix}`;
        suffix++;
    }
    
    return productId;
}

/**
 * Parse and validate command line arguments
 */
function parseArguments() {
    const args = process.argv.slice(2);
    
    if (args.length < 2) {
        console.error(`${colors.red}Error: Missing required arguments${colors.reset}`);
        console.log(`\n${colors.bold}Usage:${colors.reset}`);
        console.log(`  node add-tool.js "Tool Name" "https://tool-url.com"`);
        console.log(`  node add-tool.js "Tool Name" "https://tool-url.com" --wa`);
        console.log(`  node add-tool.js "Tool Name" "https://tool-url.com" --copilot`);
        console.log(`\n${colors.bold}Flags:${colors.reset}`);
        console.log(`  --wa       Add * suffix (includes Workflow Assistant)`);
        console.log(`  --copilot  Add ** suffix (Copilot-specific tool)`);
        process.exit(1);
    }
    
    const toolName = args[0].trim();
    const toolUrl = args[1].trim();
    const hasWA = args.includes('--wa');
    const isCopilot = args.includes('--copilot');
    
    // Validate inputs
    if (!toolName) throw new Error('Tool name cannot be empty');
    if (!toolUrl) throw new Error('Tool URL cannot be empty');
    if (!isValidUrl(toolUrl)) throw new Error('Invalid URL format. Must start with http:// or https://');
    if (hasWA && isCopilot) throw new Error('Cannot use both --wa and --copilot flags together');
    
    // Add appropriate suffix
    let displayName = toolName;
    if (hasWA) displayName += ' *';
    else if (isCopilot) displayName += ' **';
    
    // Check if tool already exists
    if (toolExists(displayName)) {
        throw new Error(`Tool "${displayName}" already exists`);
    }
    
    const productId = generateProductId(toolName);
    
    return { toolName, displayName, toolUrl, productId, hasWA, isCopilot };
}

/**
 * Create a backup of a file
 */
function createBackup(filePath) {
    if (!fileExists(filePath)) {
        throw new Error(`File not found: ${filePath}`);
    }
    
    const backupPath = `${filePath}.backup`;
    fs.copyFileSync(filePath, backupPath);
    console.log(`${colors.blue}✓${colors.reset} Backup created: ${backupPath}`);
}

/**
 * Add tool card to welcome page in index.html
 */
function addToolCardToHTML(displayName) {
    const htmlContent = readFile(PATHS.html);
    const escapedDisplayName = escapeHtml(displayName);
    
    const toolCard = `                        <div class="tool-card" data-tool="${escapedDisplayName}">
                            <h3>${escapedDisplayName}</h3>
                            <p>Click to open ${escapedDisplayName}</p>
                        </div>`;
    
    // Find the closing tag of tools-grid (handle both Unix and Windows line endings)
    const toolsGridEndMarkers = [
        '                    </div>\n                </div>',
        '                    </div>\r\n                </div>'
    ];
    
    let toolsGridEndIndex = -1;
    for (const marker of toolsGridEndMarkers) {
        toolsGridEndIndex = htmlContent.indexOf(marker);
        if (toolsGridEndIndex !== -1) break;
    }
    
    if (toolsGridEndIndex === -1) {
        throw new Error('Could not find tools grid section in HTML');
    }
    
    const newContent = htmlContent.slice(0, toolsGridEndIndex) + toolCard + '\n' + htmlContent.slice(toolsGridEndIndex);
    writeFile(PATHS.html, newContent);
    console.log(`${colors.green}✓${colors.reset} Tool card added to welcome page`);
}

/**
 * Add navigation item to sidebar in index.html
 */
function addNavItemToHTML(displayName, toolUrl) {
    const htmlContent = readFile(PATHS.html);
    const escapedDisplayName = escapeHtml(displayName);
    const escapedToolUrl = escapeHtml(toolUrl);
    
    const navItem = `                    <li class="nav-item">
                        <a href="#" class="nav-link" data-src="${escapedToolUrl}">${escapedDisplayName}</a>
                    </li>`;
    
    const navListEndMarker = '                </ul>';
    const navListEndIndex = htmlContent.indexOf(navListEndMarker);
    
    if (navListEndIndex === -1) {
        throw new Error('Could not find navigation list end in HTML');
    }
    
    const newContent = htmlContent.slice(0, navListEndIndex) + navItem + '\n' + htmlContent.slice(navListEndIndex);
    writeFile(PATHS.html, newContent);
    console.log(`${colors.green}✓${colors.reset} Navigation item added to sidebar`);
}

/**
 * Add entry to JavaScript configuration object
 */
function addToConfig(configName, key, value) {
    const scriptContent = readFile(PATHS.script);
    
    const configStart = scriptContent.indexOf(`const ${configName} = {`);
    const configEnd = scriptContent.indexOf('};', configStart);
    
    if (configStart === -1 || configEnd === -1) {
        throw new Error(`Could not find ${configName} in script.js`);
    }
    
    // Ensure the last entry has a comma
    const configContent = scriptContent.slice(configStart, configEnd);
    const lines = configContent.split('\n');
    
    let lastEntryLineIndex = -1;
    for (let i = lines.length - 1; i >= 0; i--) {
        const trimmedLine = lines[i].trim();
        if (trimmedLine && trimmedLine !== '{' && !trimmedLine.startsWith('const')) {
            lastEntryLineIndex = i;
            break;
        }
    }
    
    // Add comma to last entry if needed
    if (lastEntryLineIndex !== -1) {
        const lastEntryLine = lines[lastEntryLineIndex].trimEnd();
        if (!lastEntryLine.endsWith(',')) {
            const linesBefore = lines.slice(0, lastEntryLineIndex).join('\n');
            const positionOfLastLine = configStart + linesBefore.length + (lastEntryLineIndex > 0 ? 1 : 0);
            const positionAfterLastLine = positionOfLastLine + lines[lastEntryLineIndex].length;
            
            const beforeLastLine = scriptContent.slice(0, positionOfLastLine);
            const lastLineContent = scriptContent.slice(positionOfLastLine, positionAfterLastLine).trimEnd();
            const afterLastLine = scriptContent.slice(positionAfterLastLine);
            
            scriptContent = beforeLastLine + lastLineContent + ',' + afterLastLine;
        }
    }
    
    const newEntry = `    '${key}': '${value}',`;
    const updatedConfigEnd = scriptContent.indexOf('};', configStart);
    
    const newContent = scriptContent.slice(0, updatedConfigEnd) + newEntry + '\n' + scriptContent.slice(updatedConfigEnd);
    writeFile(PATHS.script, newContent);
    console.log(`${colors.green}✓${colors.reset} Tool added to ${configName}`);
}

/**
 * Add tool to MENU_CONFIG in script.js
 */
function addToMenuConfig(displayName, toolUrl) {
    addToConfig('MENU_CONFIG', displayName, toolUrl);
}

/**
 * Add tool to URL_ROUTES in script.js
 */
function addToURLRoutes(displayName, productId) {
    addToConfig('URL_ROUTES', productId, displayName);
}

/**
 * Add CSS animation rule for the new tool card
 */
function addToolCardAnimation() {
    const htmlContent = readFile(PATHS.html);
    const cssContent = readFile(PATHS.css);
    
    const toolCardMatches = htmlContent.match(/class="tool-card"/g);
    const toolCardCount = toolCardMatches ? toolCardMatches.length : 0;
    
    if (toolCardCount === 0) {
        console.log(`${colors.yellow}⚠${colors.reset} No tool cards found in HTML`);
        return;
    }
    
    const animationPattern = /\.tool-card:nth-child\((\d+)\)\s*{\s*animation-delay:\s*([\d.]+)s;\s*}/g;
    const matches = [...cssContent.matchAll(animationPattern)];
    
    if (matches.length === 0) {
        console.log(`${colors.yellow}⚠${colors.reset} No existing animation rules found in CSS`);
        return;
    }
    
    const lastMatch = matches[matches.length - 1];
    const lastChildIndex = parseInt(lastMatch[1]);
    const lastDelay = parseFloat(lastMatch[2]);
    
    if (toolCardCount > lastChildIndex) {
        const newChildIndex = lastChildIndex + 1;
        const newDelay = (lastDelay + 0.1).toFixed(1);
        const newRule = `.tool-card:nth-child(${newChildIndex}) { animation-delay: ${newDelay}s; }`;
        
        const lastRuleEnd = lastMatch.index + lastMatch[0].length;
        const newContent = cssContent.slice(0, lastRuleEnd) + '\n' + newRule + cssContent.slice(lastRuleEnd);
        
        writeFile(PATHS.css, newContent);
        console.log(`${colors.green}✓${colors.reset} CSS animation rule added for tool card #${newChildIndex}`);
    } else {
        console.log(`${colors.blue}ℹ${colors.reset} CSS animation rules already sufficient`);
    }
}

/**
 * Display success message with usage instructions
 */
function displaySuccess(toolInfo) {
    console.log(`\n${colors.bold}${colors.green}✓ Successfully added new tool!${colors.reset}\n`);
    console.log(`${colors.bold}Tool Details:${colors.reset}`);
    console.log(`  Name:       ${toolInfo.displayName}`);
    console.log(`  URL:        ${toolInfo.toolUrl}`);
    console.log(`  Product ID: ${toolInfo.productId}`);
    console.log(`\n${colors.bold}Access the tool at:${colors.reset}`);
    console.log(`  ${colors.blue}?product=${toolInfo.productId}${colors.reset}`);
    console.log(`\n${colors.yellow}Note: Backups were created with .backup extension${colors.reset}`);
}

/**
 * Main execution function
 */
function main() {
    console.log(`\n${colors.bold}${colors.blue}GTM Copilot - Add New Tool${colors.reset}\n`);
    
    try {
        const toolInfo = parseArguments();
        
        console.log(`Adding tool: ${colors.bold}${toolInfo.displayName}${colors.reset}\n`);
        
        // Create backups
        createBackup(PATHS.html);
        createBackup(PATHS.script);
        createBackup(PATHS.css);
        
        console.log();
        
        // Add tool to all necessary places
        addToolCardToHTML(toolInfo.displayName);
        addNavItemToHTML(toolInfo.displayName, toolInfo.toolUrl);
        addToMenuConfig(toolInfo.displayName, toolInfo.toolUrl);
        addToURLRoutes(toolInfo.displayName, toolInfo.productId);
        addToolCardAnimation();
        
        displaySuccess(toolInfo);
        
    } catch (error) {
        console.error(`\n${colors.red}${colors.bold}Error:${colors.reset} ${error.message}`);
        console.error(`\n${colors.yellow}Tip: Restore from .backup files if something went wrong${colors.reset}\n`);
        process.exit(1);
    }
}

// Run the script
main();