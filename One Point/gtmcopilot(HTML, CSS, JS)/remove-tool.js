#!/usr/bin/env node

/**
 * GTM Copilot - Remove Tool Script
 * 
 * This script automates the process of removing a tool from the GTM Copilot application.
 * It updates the HTML and JavaScript files to remove the tool.
 * 
 * Usage:
 *   node remove-tool.js "Tool Name"
 *   node remove-tool.js "Tool Name *"
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');

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
 * Check if file exists
 * @param {string} filePath - Path to check
 * @returns {boolean} - True if file exists
 */
function fileExists(filePath) {
    try {
        return fs.existsSync(filePath);
    } catch {
        return false;
    }
}

/**
 * Check if tool exists in HTML
 * @param {string} toolName - Tool name to check
 * @returns {boolean} - True if tool exists
 */
function toolExists(toolName) {
    try {
        const htmlPath = path.join(__dirname, 'index.html');
        const htmlContent = fs.readFileSync(htmlPath, 'utf8');
        return htmlContent.includes(`data-tool="${toolName}"`);
    } catch {
        return false;
    }
}

/**
 * Parse command line arguments
 */
function parseArguments() {
    const args = process.argv.slice(2);
    
    if (args.length < 1) {
        console.error(`${colors.red}Error: Missing required argument${colors.reset}`);
        console.log(`\n${colors.bold}Usage:${colors.reset}`);
        console.log(`  node remove-tool.js "Tool Name"`);
        console.log(`  node remove-tool.js "Tool Name *"`);
        process.exit(1);
    }
    
    const toolName = args.join(' ').trim();
    
    // Validate input
    if (!toolName || toolName.length === 0) {
        throw new Error('Tool name cannot be empty');
    }
    
    // Check if tool exists
    if (!toolExists(toolName)) {
        throw new Error(`Tool "${toolName}" not found in the application`);
    }
    
    return { toolName };
}

/**
 * Create a backup of a file
 * @param {string} filePath - Path to the file to backup
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
 * Remove tool card from welcome page in index.html
 * @param {string} toolName - Name of the tool to remove
 */
function removeToolCardFromHTML(toolName) {
    const htmlPath = path.join(__dirname, 'index.html');
    let htmlContent;
    
    try {
        htmlContent = fs.readFileSync(htmlPath, 'utf8');
    } catch (error) {
        throw new Error(`Failed to read HTML file: ${error.message}`);
    }
    
    // Find and remove the tool card
    const toolCardRegex = new RegExp(
        `\\s*<div class="tool-card" data-tool="${toolName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}">\\s*<h3>${toolName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}<\\/h3>\\s*<p>Click to open ${toolName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}<\\/p>\\s*<\\/div>`,
        'g'
    );
    
    // Check if tool exists first
    if (!toolCardRegex.test(htmlContent)) {
        throw new Error(`Tool card "${toolName}" not found in HTML`);
    }
    
    // Reset regex and perform replacement
    toolCardRegex.lastIndex = 0;
    htmlContent = htmlContent.replace(toolCardRegex, '');
    
    try {
        fs.writeFileSync(htmlPath, htmlContent, 'utf8');
        console.log(`${colors.green}✓${colors.reset} Tool card removed from welcome page`);
    } catch (error) {
        throw new Error(`Failed to write HTML file: ${error.message}`);
    }
}

/**
 * Remove navigation item from sidebar in index.html
 * @param {string} toolName - Name of the tool to remove
 */
function removeNavItemFromHTML(toolName) {
    const htmlPath = path.join(__dirname, 'index.html');
    let htmlContent;
    
    try {
        htmlContent = fs.readFileSync(htmlPath, 'utf8');
    } catch (error) {
        throw new Error(`Failed to read HTML file: ${error.message}`);
    }
    
    // Find and remove the nav item
    const navItemRegex = new RegExp(
        `\\s*<li class="nav-item">\\s*<a href="#" class="nav-link" data-src="[^"]*">${toolName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}<\\/a>\\s*<\\/li>`,
        'g'
    );
    
    // Check if nav item exists first
    if (!navItemRegex.test(htmlContent)) {
        throw new Error(`Navigation item "${toolName}" not found in HTML`);
    }
    
    // Reset regex and perform replacement
    navItemRegex.lastIndex = 0;
    htmlContent = htmlContent.replace(navItemRegex, '');
    
    try {
        fs.writeFileSync(htmlPath, htmlContent, 'utf8');
        console.log(`${colors.green}✓${colors.reset} Navigation item removed from sidebar`);
    } catch (error) {
        throw new Error(`Failed to write HTML file: ${error.message}`);
    }
}

/**
 * Remove tool from MENU_CONFIG in script.js
 * @param {string} toolName - Name of the tool to remove
 */
function removeFromMenuConfig(toolName) {
    const scriptPath = path.join(__dirname, 'assets', 'js', 'script.js');
    let scriptContent;
    
    try {
        scriptContent = fs.readFileSync(scriptPath, 'utf8');
    } catch (error) {
        throw new Error(`Failed to read script file: ${error.message}`);
    }
    
    // Find and remove the entry from MENU_CONFIG
    const menuConfigRegex = new RegExp(
        `\\s*'${toolName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}': '[^']*',?\\n`,
        'g'
    );
    
    // Check if tool exists first
    if (!menuConfigRegex.test(scriptContent)) {
        throw new Error(`Tool "${toolName}" not found in MENU_CONFIG`);
    }
    
    // Reset regex and perform replacement
    menuConfigRegex.lastIndex = 0;
    scriptContent = scriptContent.replace(menuConfigRegex, '\n');
    
    try {
        fs.writeFileSync(scriptPath, scriptContent, 'utf8');
        console.log(`${colors.green}✓${colors.reset} Tool removed from MENU_CONFIG`);
    } catch (error) {
        throw new Error(`Failed to write script file: ${error.message}`);
    }
}

/**
 * Remove tool from URL_ROUTES in script.js
 * @param {string} toolName - Name of the tool to remove
 */
function removeFromURLRoutes(toolName) {
    const scriptPath = path.join(__dirname, 'assets', 'js', 'script.js');
    let scriptContent;
    
    try {
        scriptContent = fs.readFileSync(scriptPath, 'utf8');
    } catch (error) {
        throw new Error(`Failed to read script file: ${error.message}`);
    }
    
    // Find and remove the entry from URL_ROUTES
    const urlRoutesRegex = new RegExp(
        `\\s*'[^']+': '${toolName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}',?\\n`,
        'g'
    );
    
    // Check if tool exists first
    if (!urlRoutesRegex.test(scriptContent)) {
        console.log(`${colors.yellow}⚠${colors.reset} Tool "${toolName}" not found in URL_ROUTES (may have been removed already)`);
        return;
    }
    
    // Reset regex and perform replacement
    urlRoutesRegex.lastIndex = 0;
    scriptContent = scriptContent.replace(urlRoutesRegex, '\n');
    
    try {
        fs.writeFileSync(scriptPath, scriptContent, 'utf8');
        console.log(`${colors.green}✓${colors.reset} Tool removed from URL_ROUTES`);
    } catch (error) {
        throw new Error(`Failed to write script file: ${error.message}`);
    }
}

/**
 * Clean up CSS animation rules for removed tool cards
 */
function cleanupCSSAnimationRules() {
    const htmlPath = path.join(__dirname, 'index.html');
    const cssPath = path.join(__dirname, 'assets', 'css', 'styles.css');
    
    // Count existing tool cards in HTML
    let htmlContent;
    try {
        htmlContent = fs.readFileSync(htmlPath, 'utf8');
    } catch (error) {
        throw new Error(`Failed to read HTML file: ${error.message}`);
    }
    
    const toolCardMatches = htmlContent.match(/class="tool-card"/g);
    const toolCardCount = toolCardMatches ? toolCardMatches.length : 0;
    
    if (toolCardCount === 0) {
        console.log(`${colors.yellow}⚠${colors.reset} No tool cards found in HTML`);
        return;
    }
    
    // Read CSS file
    let cssContent;
    try {
        cssContent = fs.readFileSync(cssPath, 'utf8');
    } catch (error) {
        throw new Error(`Failed to read CSS file: ${error.message}`);
    }
    
    // Find all animation rules for tool-card:nth-child
    const animationPattern = /\.tool-card:nth-child\((\d+)\)\s*{\s*animation-delay:\s*[\d.]+s;\s*}\n?/g;
    const matches = [...cssContent.matchAll(animationPattern)];
    
    if (matches.length === 0) {
        console.log(`${colors.yellow}⚠${colors.reset} No animation rules found in CSS`);
        return;
    }
    
    // Find the highest child index
    const childIndices = matches.map(m => parseInt(m[1]));
    const maxIndex = Math.max(...childIndices);
    
    // Remove animation rules that exceed the current tool count
    if (maxIndex > toolCardCount) {
        let removedCount = 0;
        
        // Remove rules from toolCardCount+1 to maxIndex
        for (let i = toolCardCount + 1; i <= maxIndex; i++) {
            const rulePattern = new RegExp(`\\.tool-card:nth-child\\(${i}\\)\\s*{\\s*animation-delay:\\s*[\\d.]+s;\\s*}\\n?`, 'g');
            
            // Check if rule exists first
            if (rulePattern.test(cssContent)) {
                // Reset regex and perform replacement
                rulePattern.lastIndex = 0;
                cssContent = cssContent.replace(rulePattern, '');
                removedCount++;
            }
        }
        
        // Write back to CSS file
        try {
            fs.writeFileSync(cssPath, cssContent, 'utf8');
            console.log(`${colors.green}✓${colors.reset} Cleaned up ${removedCount} unused CSS animation rule(s)`);
        } catch (error) {
            throw new Error(`Failed to write CSS file: ${error.message}`);
        }
    } else {
        console.log(`${colors.blue}ℹ${colors.reset} CSS animation rules are already optimized`);
    }
}

/**
 * Ask for user confirmation
 * @param {string} question - Question to ask
 * @returns {Promise<boolean>}
 */
function askConfirmation(question) {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });
    
    return new Promise((resolve) => {
        rl.question(question, (answer) => {
            rl.close();
            resolve(answer.toLowerCase() === 'y' || answer.toLowerCase() === 'yes');
        });
    });
}

/**
 * Display success message
 * @param {string} toolName - Name of removed tool
 */
function displaySuccess(toolName) {
    console.log(`\n${colors.bold}${colors.green}✓ Successfully removed tool!${colors.reset}\n`);
    console.log(`${colors.bold}Removed:${colors.reset} ${toolName}`);
    console.log(`\n${colors.yellow}Note: Backups were created with .backup extension${colors.reset}\n`);
}

/**
 * Main execution function
 */
async function main() {
    console.log(`\n${colors.bold}${colors.blue}GTM Copilot - Remove Tool${colors.reset}\n`);
    
    try {
        // Parse arguments
        const { toolName } = parseArguments();
        
        console.log(`Tool to remove: ${colors.bold}${toolName}${colors.reset}\n`);
        
        // Ask for confirmation
        const confirmed = await askConfirmation(`${colors.yellow}Are you sure you want to remove this tool? (y/n): ${colors.reset}`);
        
        if (!confirmed) {
            console.log(`\n${colors.yellow}Operation cancelled${colors.reset}\n`);
            process.exit(0);
        }
        
        console.log();
        
        // Create backups
        createBackup('index.html');
        createBackup(path.join('assets', 'js', 'script.js'));
        createBackup(path.join('assets', 'css', 'styles.css'));
        
        console.log();
        
        // Remove tool from all places
        removeToolCardFromHTML(toolName);
        removeNavItemFromHTML(toolName);
        removeFromMenuConfig(toolName);
        removeFromURLRoutes(toolName);
        cleanupCSSAnimationRules();
        
        // Display success message
        displaySuccess(toolName);
        
    } catch (error) {
        console.error(`\n${colors.red}${colors.bold}Error:${colors.reset} ${error.message}`);
        console.error(`\n${colors.yellow}Tip: Restore from .backup files if something went wrong${colors.reset}\n`);
        process.exit(1);
    }
}

// Run the script
main();

