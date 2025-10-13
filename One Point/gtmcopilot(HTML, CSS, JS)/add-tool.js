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

/**
 * Generate a product ID from tool name
 * @param {string} toolName - The name of the tool
 * @returns {string} - Generated product ID
 */
function generateProductId(toolName) {
    return toolName
        .toLowerCase()
        .replace(/[^a-z0-9\s]/g, '') // Remove special characters
        .trim()
        .replace(/\s+/g, '_') // Replace all spaces with underscores
        .replace(/__+/g, '_'); // Replace multiple underscores with single
}

/**
 * Parse command line arguments
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
    
    const toolName = args[0];
    const toolUrl = args[1];
    const hasWA = args.includes('--wa');
    const isCopilot = args.includes('--copilot');
    
    // Add appropriate suffix
    let displayName = toolName;
    if (hasWA) {
        displayName += ' *';
    } else if (isCopilot) {
        displayName += ' **';
    }
    
    const productId = generateProductId(toolName);
    
    return { toolName, displayName, toolUrl, productId, hasWA, isCopilot };
}

/**
 * Create a backup of a file
 * @param {string} filePath - Path to the file to backup
 */
function createBackup(filePath) {
    const backupPath = `${filePath}.backup`;
    fs.copyFileSync(filePath, backupPath);
    console.log(`${colors.blue}✓${colors.reset} Backup created: ${backupPath}`);
}

/**
 * Add tool card to welcome page in index.html
 * @param {string} displayName - Display name of the tool
 */
function addToolCardToHTML(displayName) {
    const htmlPath = path.join(__dirname, 'index.html');
    let htmlContent = fs.readFileSync(htmlPath, 'utf8');
    
    // Create tool card HTML with proper indentation (24 spaces)
    const toolCard = `                        <div class="tool-card" data-tool="${displayName}">
                            <h3>${displayName}</h3>
                            <p>Click to open ${displayName}</p>
                        </div>`;
    
    // Find the closing tag of tools-grid (20 spaces before </div>)
    // Use \r\n for Windows line endings
    const toolsGridEndMarker = '                    </div>\r\n                </div>';
    const toolsGridEndIndex = htmlContent.indexOf(toolsGridEndMarker);
    
    if (toolsGridEndIndex === -1) {
        throw new Error('Could not find tools grid section in HTML');
    }
    
    // Insert the new tool card before the closing div of tools-grid
    htmlContent = htmlContent.slice(0, toolsGridEndIndex) + toolCard + '\n' + htmlContent.slice(toolsGridEndIndex);
    
    fs.writeFileSync(htmlPath, htmlContent, 'utf8');
    console.log(`${colors.green}✓${colors.reset} Tool card added to welcome page`);
}

/**
 * Add navigation item to sidebar in index.html
 * @param {string} displayName - Display name of the tool
 * @param {string} toolUrl - URL of the tool
 */
function addNavItemToHTML(displayName, toolUrl) {
    const htmlPath = path.join(__dirname, 'index.html');
    let htmlContent = fs.readFileSync(htmlPath, 'utf8');
    
    // Create nav item HTML with proper indentation (20 spaces for <li>)
    const navItem = `                    <li class="nav-item">
                        <a href="#" class="nav-link" data-src="${toolUrl}">${displayName}</a>
                    </li>`;
    
    // Find the closing </ul> tag in the sidebar (16 spaces before </ul>)
    const navListEndMarker = '                </ul>';
    const navListEndIndex = htmlContent.indexOf(navListEndMarker);
    
    if (navListEndIndex === -1) {
        throw new Error('Could not find navigation list end in HTML');
    }
    
    // Insert the new nav item before the closing </ul>
    htmlContent = htmlContent.slice(0, navListEndIndex) + navItem + '\n' + htmlContent.slice(navListEndIndex);
    
    fs.writeFileSync(htmlPath, htmlContent, 'utf8');
    console.log(`${colors.green}✓${colors.reset} Navigation item added to sidebar`);
}

/**
 * Add tool to MENU_CONFIG in script.js
 * @param {string} displayName - Display name of the tool
 * @param {string} toolUrl - URL of the tool
 */
function addToMenuConfig(displayName, toolUrl) {
    const scriptPath = path.join(__dirname, 'assets', 'js', 'script.js');
    let scriptContent = fs.readFileSync(scriptPath, 'utf8');
    
    // Find MENU_CONFIG and add the new entry
    const menuConfigStart = scriptContent.indexOf('const MENU_CONFIG = {');
    const menuConfigEnd = scriptContent.indexOf('};', menuConfigStart);
    
    if (menuConfigStart === -1 || menuConfigEnd === -1) {
        throw new Error('Could not find MENU_CONFIG in script.js');
    }
    
    // Ensure the last entry has a comma
    // Find all lines between { and }
    const configContent = scriptContent.slice(menuConfigStart, menuConfigEnd);
    const lines = configContent.split('\n');
    
    // Find the last non-empty line that's not just whitespace
    let lastEntryLineIndex = -1;
    for (let i = lines.length - 1; i >= 0; i--) {
        const trimmedLine = lines[i].trim();
        if (trimmedLine && trimmedLine !== '{' && !trimmedLine.startsWith('const')) {
            lastEntryLineIndex = i;
            break;
        }
    }
    
    // Check if the last entry line ends with a comma
    if (lastEntryLineIndex !== -1) {
        const lastEntryLine = lines[lastEntryLineIndex].trimEnd();
        if (!lastEntryLine.endsWith(',')) {
            // Need to add comma - find position in original content
            const linesBefore = lines.slice(0, lastEntryLineIndex).join('\n');
            const positionOfLastLine = menuConfigStart + linesBefore.length + (lastEntryLineIndex > 0 ? 1 : 0);
            const positionAfterLastLine = positionOfLastLine + lines[lastEntryLineIndex].length;
            
            // Insert comma at the end of the last entry line (before any trailing whitespace/newline)
            const beforeLastLine = scriptContent.slice(0, positionOfLastLine);
            const lastLineContent = scriptContent.slice(positionOfLastLine, positionAfterLastLine).trimEnd();
            const afterLastLine = scriptContent.slice(positionAfterLastLine);
            
            scriptContent = beforeLastLine + lastLineContent + ',' + afterLastLine;
        }
    }
    
    const newEntry = `    '${displayName}': '${toolUrl}',`;
    const updatedMenuConfigEnd = scriptContent.indexOf('};', menuConfigStart);
    
    // Insert before the closing brace
    scriptContent = scriptContent.slice(0, updatedMenuConfigEnd) + newEntry + '\n' + scriptContent.slice(updatedMenuConfigEnd);
    
    fs.writeFileSync(scriptPath, scriptContent, 'utf8');
    console.log(`${colors.green}✓${colors.reset} Tool added to MENU_CONFIG`);
}

/**
 * Add tool to URL_ROUTES in script.js
 * @param {string} displayName - Display name of the tool
 * @param {string} productId - Product ID for URL routing
 */
function addToURLRoutes(displayName, productId) {
    const scriptPath = path.join(__dirname, 'assets', 'js', 'script.js');
    let scriptContent = fs.readFileSync(scriptPath, 'utf8');
    
    // Find URL_ROUTES and add the new entry
    const urlRoutesStart = scriptContent.indexOf('const URL_ROUTES = {');
    const urlRoutesEnd = scriptContent.indexOf('};', urlRoutesStart);
    
    if (urlRoutesStart === -1 || urlRoutesEnd === -1) {
        throw new Error('Could not find URL_ROUTES in script.js');
    }
    
    // Ensure the last entry has a comma
    // Find all lines between { and }
    const routesContent = scriptContent.slice(urlRoutesStart, urlRoutesEnd);
    const lines = routesContent.split('\n');
    
    // Find the last non-empty line that's not just whitespace
    let lastEntryLineIndex = -1;
    for (let i = lines.length - 1; i >= 0; i--) {
        const trimmedLine = lines[i].trim();
        if (trimmedLine && trimmedLine !== '{' && !trimmedLine.startsWith('const')) {
            lastEntryLineIndex = i;
            break;
        }
    }
    
    // Check if the last entry line ends with a comma
    if (lastEntryLineIndex !== -1) {
        const lastEntryLine = lines[lastEntryLineIndex].trimEnd();
        if (!lastEntryLine.endsWith(',')) {
            // Need to add comma - find position in original content
            const linesBefore = lines.slice(0, lastEntryLineIndex).join('\n');
            const positionOfLastLine = urlRoutesStart + linesBefore.length + (lastEntryLineIndex > 0 ? 1 : 0);
            const positionAfterLastLine = positionOfLastLine + lines[lastEntryLineIndex].length;
            
            // Insert comma at the end of the last entry line (before any trailing whitespace/newline)
            const beforeLastLine = scriptContent.slice(0, positionOfLastLine);
            const lastLineContent = scriptContent.slice(positionOfLastLine, positionAfterLastLine).trimEnd();
            const afterLastLine = scriptContent.slice(positionAfterLastLine);
            
            scriptContent = beforeLastLine + lastLineContent + ',' + afterLastLine;
        }
    }
    
    const newEntry = `    '${productId}': '${displayName}',`;
    const updatedUrlRoutesEnd = scriptContent.indexOf('};', urlRoutesStart);
    
    // Insert before the closing brace
    scriptContent = scriptContent.slice(0, updatedUrlRoutesEnd) + newEntry + '\n' + scriptContent.slice(updatedUrlRoutesEnd);
    
    fs.writeFileSync(scriptPath, scriptContent, 'utf8');
    console.log(`${colors.green}✓${colors.reset} Tool added to URL_ROUTES`);
}

/**
 * Add CSS animation rule for the new tool card
 */
function addToolCardAnimation() {
    const htmlPath = path.join(__dirname, 'index.html');
    const cssPath = path.join(__dirname, 'assets', 'css', 'styles.css');
    
    // Count existing tool cards in HTML
    const htmlContent = fs.readFileSync(htmlPath, 'utf8');
    const toolCardMatches = htmlContent.match(/class="tool-card"/g);
    const toolCardCount = toolCardMatches ? toolCardMatches.length : 0;
    
    if (toolCardCount === 0) {
        console.log(`${colors.yellow}⚠${colors.reset} No tool cards found in HTML`);
        return;
    }
    
    // Read CSS file
    let cssContent = fs.readFileSync(cssPath, 'utf8');
    
    // Find the last animation rule for tool-card:nth-child
    const animationPattern = /\.tool-card:nth-child\((\d+)\)\s*{\s*animation-delay:\s*([\d.]+)s;\s*}/g;
    const matches = [...cssContent.matchAll(animationPattern)];
    
    if (matches.length === 0) {
        console.log(`${colors.yellow}⚠${colors.reset} No existing animation rules found in CSS`);
        return;
    }
    
    const lastMatch = matches[matches.length - 1];
    const lastChildIndex = parseInt(lastMatch[1]);
    const lastDelay = parseFloat(lastMatch[2]);
    
    // Check if we need to add a new rule
    if (toolCardCount > lastChildIndex) {
        const newChildIndex = lastChildIndex + 1;
        const newDelay = (lastDelay + 0.1).toFixed(1);
        const newRule = `.tool-card:nth-child(${newChildIndex}) { animation-delay: ${newDelay}s; }`;
        
        // Find position to insert (after the last animation rule)
        const lastRuleEnd = lastMatch.index + lastMatch[0].length;
        
        // Insert the new rule
        cssContent = cssContent.slice(0, lastRuleEnd) + '\n' + newRule + cssContent.slice(lastRuleEnd);
        
        // Write back to CSS file
        fs.writeFileSync(cssPath, cssContent, 'utf8');
        console.log(`${colors.green}✓${colors.reset} CSS animation rule added for tool card #${newChildIndex}`);
    } else {
        console.log(`${colors.blue}ℹ${colors.reset} CSS animation rules already sufficient`);
    }
}

/**
 * Display success message with usage instructions
 * @param {object} toolInfo - Tool information
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
        // Parse arguments
        const toolInfo = parseArguments();
        
        console.log(`Adding tool: ${colors.bold}${toolInfo.displayName}${colors.reset}\n`);
        
        // Create backups
        createBackup('index.html');
        createBackup(path.join('assets', 'js', 'script.js'));
        createBackup(path.join('assets', 'css', 'styles.css'));
        
        console.log();
        
        // Add tool to all necessary places
        addToolCardToHTML(toolInfo.displayName);
        addNavItemToHTML(toolInfo.displayName, toolInfo.toolUrl);
        addToMenuConfig(toolInfo.displayName, toolInfo.toolUrl);
        addToURLRoutes(toolInfo.displayName, toolInfo.productId);
        addToolCardAnimation();
        
        // Display success message
        displaySuccess(toolInfo);
        
    } catch (error) {
        console.error(`\n${colors.red}${colors.bold}Error:${colors.reset} ${error.message}`);
        console.error(`\n${colors.yellow}Tip: Restore from .backup files if something went wrong${colors.reset}\n`);
        process.exit(1);
    }
}

// Run the script
main();

