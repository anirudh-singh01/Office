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
 * Check if tool exists in HTML (handles both escaped and unescaped versions)
 */
function toolExists(toolName) {
    try {
        const htmlContent = readFile(PATHS.html);
        // Check for both escaped and unescaped versions
        const escapedName = escapeHtml(toolName);
        return htmlContent.includes(`data-tool="${toolName}"`) || htmlContent.includes(`data-tool="${escapedName}"`);
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
    
    if (!toolName) {
        throw new Error('Tool name cannot be empty');
    }
    
    if (!toolExists(toolName)) {
        throw new Error(`Tool "${toolName}" not found in the application`);
    }
    
    return { toolName };
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
 * Remove tool card from welcome page in index.html
 */
function removeToolCardFromHTML(toolName) {
    const htmlContent = readFile(PATHS.html);
    
    // Try both escaped and unescaped versions
    const escapedName = escapeHtml(toolName);
    const toolCardRegex = new RegExp(
        `\\s*<div class="tool-card" data-tool="(?:${toolName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}|${escapedName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})">\\s*<h3>(?:${toolName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}|${escapedName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})<\\/h3>\\s*<p>Click to open (?:${toolName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}|${escapedName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})<\\/p>\\s*<\\/div>`,
        'g'
    );
    
    if (!toolCardRegex.test(htmlContent)) {
        throw new Error(`Tool card "${toolName}" not found in HTML`);
    }
    
    toolCardRegex.lastIndex = 0;
    const newContent = htmlContent.replace(toolCardRegex, '');
    writeFile(PATHS.html, newContent);
    console.log(`${colors.green}✓${colors.reset} Tool card removed from welcome page`);
}

/**
 * Remove navigation item from sidebar in index.html
 */
function removeNavItemFromHTML(toolName) {
    const htmlContent = readFile(PATHS.html);
    
    // Try both escaped and unescaped versions
    const escapedName = escapeHtml(toolName);
    const navItemRegex = new RegExp(
        `\\s*<li class="nav-item">\\s*<a href="#" class="nav-link" data-src="[^"]*">(?:${toolName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}|${escapedName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})<\\/a>\\s*<\\/li>`,
        'g'
    );
    
    if (!navItemRegex.test(htmlContent)) {
        throw new Error(`Navigation item "${toolName}" not found in HTML`);
    }
    
    navItemRegex.lastIndex = 0;
    const newContent = htmlContent.replace(navItemRegex, '');
    writeFile(PATHS.html, newContent);
    console.log(`${colors.green}✓${colors.reset} Navigation item removed from sidebar`);
}

/**
 * Remove tool from MENU_CONFIG in script.js
 */
function removeFromMenuConfig(toolName) {
    const scriptContent = readFile(PATHS.script);
    
    const menuConfigRegex = new RegExp(
        `\\s*'${toolName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}': '[^']*',?\\n`,
        'g'
    );
    
    if (!menuConfigRegex.test(scriptContent)) {
        throw new Error(`Tool "${toolName}" not found in MENU_CONFIG`);
    }
    
    menuConfigRegex.lastIndex = 0;
    const newContent = scriptContent.replace(menuConfigRegex, '\n');
    writeFile(PATHS.script, newContent);
    console.log(`${colors.green}✓${colors.reset} Tool removed from MENU_CONFIG`);
}

/**
 * Remove tool from URL_ROUTES in script.js
 */
function removeFromURLRoutes(toolName) {
    const scriptContent = readFile(PATHS.script);
    
    const urlRoutesRegex = new RegExp(
        `\\s*'[^']+': '${toolName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}',?\\n`,
        'g'
    );
    
    if (!urlRoutesRegex.test(scriptContent)) {
        console.log(`${colors.yellow}⚠${colors.reset} Tool "${toolName}" not found in URL_ROUTES (may have been removed already)`);
        return;
    }
    
    urlRoutesRegex.lastIndex = 0;
    const newContent = scriptContent.replace(urlRoutesRegex, '\n');
    writeFile(PATHS.script, newContent);
    console.log(`${colors.green}✓${colors.reset} Tool removed from URL_ROUTES`);
}

/**
 * Clean up CSS animation rules for removed tool cards
 */
function cleanupCSSAnimationRules() {
    const htmlContent = readFile(PATHS.html);
    const cssContent = readFile(PATHS.css);
    
    const toolCardMatches = htmlContent.match(/class="tool-card"/g);
    const toolCardCount = toolCardMatches ? toolCardMatches.length : 0;
    
    if (toolCardCount === 0) {
        console.log(`${colors.yellow}⚠${colors.reset} No tool cards found in HTML`);
        return;
    }
    
    const animationPattern = /\.tool-card:nth-child\((\d+)\)\s*{\s*animation-delay:\s*[\d.]+s;\s*}\n?/g;
    const matches = [...cssContent.matchAll(animationPattern)];
    
    if (matches.length === 0) {
        console.log(`${colors.yellow}⚠${colors.reset} No animation rules found in CSS`);
        return;
    }
    
    const childIndices = matches.map(m => parseInt(m[1]));
    const maxIndex = Math.max(...childIndices);
    
    if (maxIndex > toolCardCount) {
        let removedCount = 0;
        let updatedCssContent = cssContent;
        
        for (let i = toolCardCount + 1; i <= maxIndex; i++) {
            const rulePattern = new RegExp(`\\.tool-card:nth-child\\(${i}\\)\\s*{\\s*animation-delay:\\s*[\\d.]+s;\\s*}\\n?`, 'g');
            
            if (rulePattern.test(updatedCssContent)) {
                rulePattern.lastIndex = 0;
                updatedCssContent = updatedCssContent.replace(rulePattern, '');
                removedCount++;
            }
        }
        
        writeFile(PATHS.css, updatedCssContent);
        console.log(`${colors.green}✓${colors.reset} Cleaned up ${removedCount} unused CSS animation rule(s)`);
    } else {
        console.log(`${colors.blue}ℹ${colors.reset} CSS animation rules are already optimized`);
    }
}

/**
 * Ask for user confirmation
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
        const { toolName } = parseArguments();
        
        console.log(`Tool to remove: ${colors.bold}${toolName}${colors.reset}\n`);
        
        const confirmed = await askConfirmation(`${colors.yellow}Are you sure you want to remove this tool? (y/n): ${colors.reset}`);
        
        if (!confirmed) {
            console.log(`\n${colors.yellow}Operation cancelled${colors.reset}\n`);
            process.exit(0);
        }
        
        console.log();
        
        // Create backups
        createBackup(PATHS.html);
        createBackup(PATHS.script);
        createBackup(PATHS.css);
        
        console.log();
        
        // Remove tool from all places
        removeToolCardFromHTML(toolName);
        removeNavItemFromHTML(toolName);
        removeFromMenuConfig(toolName);
        removeFromURLRoutes(toolName);
        cleanupCSSAnimationRules();
        
        displaySuccess(toolName);
        
    } catch (error) {
        console.error(`\n${colors.red}${colors.bold}Error:${colors.reset} ${error.message}`);
        console.error(`\n${colors.yellow}Tip: Restore from .backup files if something went wrong${colors.reset}\n`);
        process.exit(1);
    }
}

// Run the script
main();