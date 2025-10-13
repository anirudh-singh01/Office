# GTM Copilot - Tool Management Scripts

## 📖 Overview

This repository contains automated scripts to manage tools in the GTM Copilot application. These scripts handle adding and removing tools from the HTML, JavaScript, and CSS files automatically.

---

## 📁 Project Structure

```
gtmcopilot/
├── index.html                 # Main HTML file
├── assets/
│   ├── css/
│   │   └── styles.css        # Styling and animations
│   ├── js/
│   │   └── script.js         # Application logic
│   └── images/
├── add-tool.js               # Script to add new tools
├── remove-tool.js            # Script to remove tools
└── README.md                 # This file
```

---

## 🚀 Quick Start

### Prerequisites
- Node.js installed on your system
- Access to command line/terminal/PowerShell

### Verify Node.js Installation
```bash
node --version
```

---

## ➕ Adding a New Tool

### Basic Usage

```bash
node add-tool.js "Tool Name" "https://tool-url.com"
```

### Examples

#### 1. Add a basic tool
```bash
node add-tool.js "IC Compiler II" "https://snpsai-copilot-gtm/?product=icc2"
```

**Result:**
- Display Name: `IC Compiler II`
- Product ID: `ic_compiler_ii`
- Access URL: `?product=ic_compiler_ii`

#### 2. Add tool with Workflow Assistant (adds `*` suffix)
```bash
node add-tool.js "Design Compiler" "https://snpsai-copilot-gtm/?product=dc" --wa
```

**Result:**
- Display Name: `Design Compiler *`
- Product ID: `design_compiler`
- Access URL: `?product=design_compiler`

#### 3. Add Copilot-specific tool (adds `**` suffix)
```bash
node add-tool.js "New Copilot" "https://snpsai-copilot-gtm/?product=new" --copilot
```

**Result:**
- Display Name: `New Copilot **`
- Product ID: `new_copilot`
- Access URL: `?product=new_copilot`

### Understanding the Flags

#### 🔹 **No Flag** - Regular Tool
Adds the tool with its plain name, no suffix.
```bash
node add-tool.js "IC Validator" "https://url.com"
```
**Result**: Tool name appears as `IC Validator`

#### 🔹 **--wa Flag** - Workflow Assistant Tool
Adds a `*` asterisk to indicate the tool supports Workflow Assistant (WA) for TCL code generation.
```bash
node add-tool.js "Custom Compiler" "https://url.com" --wa
```
**Result**: Tool name appears as `Custom Compiler *`  
**Meaning**: Users can use `/generate` command with this tool

#### 🔹 **--copilot Flag** - Copilot-Specific Tool
Adds `**` double asterisk to mark it as a Copilot-specific tool for use-model answers.
```bash
node add-tool.js "AI Helper" "https://url.com" --copilot
```
**Result**: Tool name appears as `AI Helper **`  
**Meaning**: For finding answers about Copilot's use-model only

### Flag Summary Table

| Flag | Suffix Added | When to Use | Example |
|------|-------------|-------------|---------|
| None | (none) | Regular tools | `IC Validator` |
| `--wa` | `*` | Tools with Workflow Assistant/TCL generation | `Custom Compiler *` |
| `--copilot` | `**` | Copilot use-model tools | `Synopsys.ai Copilot **` |

### What It Does

When you run `add-tool.js`, it automatically:

1. ✅ Creates backup files (`.backup` extension)
   - `index.html.backup`
   - `assets/js/script.js.backup`
   - `assets/css/styles.css.backup`

2. ✅ Adds tool card to welcome page (`index.html`)
   ```html
   <div class="tool-card" data-tool="Tool Name">
       <h3>Tool Name</h3>
       <p>Click to open Tool Name</p>
   </div>
   ```

3. ✅ Adds navigation item to sidebar (`index.html`)
   ```html
   <li class="nav-item">
       <a href="#" class="nav-link" data-src="url">Tool Name</a>
   </li>
   ```

4. ✅ Updates MENU_CONFIG (`assets/js/script.js`)
   - Adds tool entry
   - Auto-fixes missing commas

5. ✅ Updates URL_ROUTES (`assets/js/script.js`)
   - Adds product ID mapping
   - Auto-fixes missing commas

6. ✅ Adds CSS animation rule (`assets/css/styles.css`)
   - Adds staggered animation delay
   - Calculates next available delay

### Output Example

```
✓ Backup created: index.html.backup
✓ Backup created: assets/js/script.js.backup
✓ Backup created: assets/css/styles.css.backup

✓ Tool card added to welcome page
✓ Navigation item added to sidebar
✓ Tool added to MENU_CONFIG
✓ Tool added to URL_ROUTES
✓ CSS animation rule added for tool card #17

✓ Successfully added new tool!

Tool Details:
  Name:       Tool Name
  URL:        https://tool-url.com
  Product ID: tool_name

Access the tool at:
  ?product=tool_name

Note: Backups were created with .backup extension
```

---

## ➖ Removing a Tool

### Basic Usage

```bash
node remove-tool.js "Tool Name"
```

### Examples

#### 1. Remove a basic tool
```bash
node remove-tool.js "IC Compiler II"
```

#### 2. Remove tool with special characters
```bash
node remove-tool.js "Custom Compiler *"
```

#### 3. Remove Copilot tool
```bash
node remove-tool.js "Synopsys.ai Copilot **"
```

### What It Does

When you run `remove-tool.js`, it automatically:

1. ✅ Asks for confirmation
   ```
   Are you sure you want to remove this tool? (y/n):
   ```

2. ✅ Creates backup files (`.backup` extension)
   - `index.html.backup`
   - `assets/js/script.js.backup`
   - `assets/css/styles.css.backup`

3. ✅ Removes tool card from welcome page (`index.html`)

4. ✅ Removes navigation item from sidebar (`index.html`)

5. ✅ Removes from MENU_CONFIG (`assets/js/script.js`)

6. ✅ Removes from URL_ROUTES (`assets/js/script.js`)

7. ✅ Cleans up unused CSS animation rules (`assets/css/styles.css`)
   - Counts remaining tools
   - Removes excess animation delays
   - Keeps CSS optimized

### Output Example

```
Tool to remove: Tool Name

Are you sure you want to remove this tool? (y/n): y

✓ Backup created: index.html.backup
✓ Backup created: assets/js/script.js.backup
✓ Backup created: assets/css/styles.css.backup

✓ Tool card removed from welcome page
✓ Navigation item removed from sidebar
✓ Tool removed from MENU_CONFIG
✓ Tool removed from URL_ROUTES
✓ Cleaned up 1 unused CSS animation rule(s)

✓ Successfully removed tool!

Removed: Tool Name

Note: Backups were created with .backup extension
```

---

## 🔄 Product ID Generation

The scripts automatically generate URL-safe product IDs from tool names:

### Rules:
1. Convert to lowercase
2. Remove special characters (`*`, `**`, etc.)
3. Replace spaces with underscores
4. Remove duplicate underscores

### Examples:

| Tool Name | Generated Product ID |
|-----------|---------------------|
| `IC Validator` | `ic_validator` |
| `PrimeSim Pro` | `primesim_pro` |
| `Custom Compiler *` | `custom_compiler` |
| `Synopsys.ai Copilot **` | `synopsysai_copilot` |
| `VC SpyGlass` | `vc_spyglass` |

---

## 🛡️ Safety Features

### Automatic Backups
Both scripts create backup files before making any changes:
- `index.html.backup`
- `assets/js/script.js.backup`
- `assets/css/styles.css.backup`

### User Confirmation (remove-tool.js only)
The removal script asks for confirmation before proceeding, preventing accidental deletions.

### Error Handling
Both scripts include comprehensive error handling with helpful messages:
```
Error: Tool "XYZ" not found in HTML

Tip: Restore from .backup files if something went wrong
```

---

## 📝 Restoring from Backups

If something goes wrong, you can restore from backup files:

### Windows (PowerShell):
```powershell
Copy-Item index.html.backup index.html -Force
Copy-Item assets\js\script.js.backup assets\js\script.js -Force
Copy-Item assets\css\styles.css.backup assets\css\styles.css -Force
```

### Linux/Mac:
```bash
cp index.html.backup index.html
cp assets/js/script.js.backup assets/js/script.js
cp assets/css/styles.css.backup assets/css/styles.css
```

### After Successful Operation:
You can delete the backup files:
```bash
del *.backup
del assets\js\*.backup
del assets\css\*.backup
```

---

## 📊 Features Comparison

| Feature | add-tool.js | remove-tool.js |
|---------|-------------|----------------|
| **Files Modified** | 3 (HTML, JS, CSS) | 3 (HTML, JS, CSS) |
| **Backups Created** | 3 files | 3 files |
| **User Confirmation** | No | Yes (safety) |
| **Auto Comma Fix** | Yes | N/A |
| **CSS Animation** | Adds rules | Removes rules |
| **Error Recovery** | Backup instructions | Backup instructions |
| **Special Char Support** | Yes (--wa, --copilot) | Yes (regex escape) |

---

## 🎯 Common Use Cases

### Scenario 1: Adding a New Synopsys Tool
```bash
node add-tool.js "New Tool" "https://snpsai-copilot-gtm/?product=newtool"
```

### Scenario 2: Adding Tool with Workflow Assistant
```bash
node add-tool.js "Tool Name" "https://url.com" --wa
```

### Scenario 3: Removing a Tool
```bash
node remove-tool.js "Tool Name"
```
Then confirm with `y` when prompted.

### Scenario 4: Quick Removal (without interactive prompt)
```bash
echo y | node remove-tool.js "Tool Name"
```

---

## ⚠️ Important Notes

### DO:
✅ Run scripts from the project root directory  
✅ Include tool name in quotes if it has spaces  
✅ Keep backup files until you verify changes  
✅ Use exact tool names (case-sensitive)  

### DON'T:
❌ Delete backup files immediately  
❌ Modify files manually after script runs  
❌ Run multiple scripts simultaneously  
❌ Use tool names with leading/trailing spaces  

---

## 🐛 Troubleshooting

### Error: "Tool not found in HTML"
**Cause**: Tool name doesn't match exactly  
**Solution**: Check tool name spelling and case

### Error: "Could not find MENU_CONFIG"
**Cause**: script.js file structure changed  
**Solution**: Restore from backup or verify file structure

### Error: "Missing required arguments"
**Cause**: Forgot to provide tool name or URL  
**Solution**: Follow usage syntax: `node add-tool.js "Name" "URL"`

### CSS Animation Not Working
**Cause**: CSS file not updated  
**Solution**: The script now handles this automatically!

---

## 📊 Current Tools (16 Original)

1. Custom Compiler *
2. DSO.ai
3. Fusion Compiler *
4. IC Validator
5. PrimeSim Pro
6. PrimeSim SPICE
7. PrimeSim XA
8. PrimeTime *
9. S-Litho
10. Synopsys.ai Copilot **
11. TestMAX ATPG
12. VCS
13. VC Formal
14. VC Low Power
15. VC SpyGlass
16. Verdi

**Legend:**
- `*` = Includes Workflow Assistant (WA) for TCL code generation
- `**` = Copilot-specific tool (for use-model answers only)

---

## 🔧 Advanced Usage

### Non-Interactive Removal (Automation)
```bash
# Linux/Mac
echo y | node remove-tool.js "Tool Name"

# Windows PowerShell
echo y | node remove-tool.js "Tool Name"
```

### Batch Operations
```bash
# Add multiple tools
node add-tool.js "Tool 1" "https://url1.com"
node add-tool.js "Tool 2" "https://url2.com"
node add-tool.js "Tool 3" "https://url3.com"

# Remove multiple tools
echo y | node remove-tool.js "Tool 1"
echo y | node remove-tool.js "Tool 2"
echo y | node remove-tool.js "Tool 3"
```

---

## 🎓 How It Works

### add-tool.js Flow:
```
1. Parse arguments (name, URL, flags)
2. Generate product ID from name
3. Create backups (3 files)
4. Add tool card to HTML welcome page
5. Add nav item to HTML sidebar
6. Update MENU_CONFIG in JS (auto-fix commas)
7. Update URL_ROUTES in JS (auto-fix commas)
8. Add CSS animation rule for new tool
9. Display success message
```

### remove-tool.js Flow:
```
1. Parse arguments (tool name)
2. Ask user confirmation (y/n)
3. Create backups (3 files)
4. Remove tool card from HTML
5. Remove nav item from HTML
6. Remove from MENU_CONFIG in JS
7. Remove from URL_ROUTES in JS
8. Clean up unused CSS animation rules
9. Display success message
```

---

## 🧪 Testing

Both scripts have been thoroughly tested:

### Test Cases Performed:
- ✅ Add single-word tool names
- ✅ Add multi-word tool names
- ✅ Add tools with special characters
- ✅ Add with --wa flag
- ✅ Add with --copilot flag
- ✅ Remove single-word tools
- ✅ Remove multi-word tools
- ✅ Remove tools with special characters
- ✅ CSS animation auto-add
- ✅ CSS animation auto-cleanup
- ✅ JavaScript comma auto-fix

**Success Rate: 100%** 🎉

---

## 📋 File Modifications

### What Gets Modified:

#### index.html
- **Add**: Tool card in welcome page, navigation item in sidebar
- **Remove**: Tool card and navigation item

#### assets/js/script.js
- **Add**: MENU_CONFIG entry, URL_ROUTES entry (with comma fixes)
- **Remove**: Entries from both objects

#### assets/css/styles.css
- **Add**: Animation delay rule for new tool card
- **Remove**: Unused animation delay rules

---

## 💡 Tips & Best Practices

### 1. Always Use Quotes
```bash
✅ Good:  node add-tool.js "IC Validator" "https://url.com"
❌ Bad:   node add-tool.js IC Validator https://url.com
```

### 2. Keep Backup Files
Keep `.backup` files until you've verified the changes work correctly in your application.

### 3. Test After Adding
After adding a tool, open your application and verify:
- Tool appears on welcome page
- Tool appears in sidebar
- Clicking the tool loads the correct URL
- Animation works smoothly

### 4. Use Descriptive Names
```bash
✅ Good:  "IC Compiler II"
❌ Bad:   "tool1", "new", "test"
```

### 5. Match Existing URL Pattern
```bash
✅ Good:  "https://snpsai-copilot-gtm/?product=xyz"
⚠️ OK:    "https://custom-url.com"
```

---

## 🔍 Product ID Examples

Understanding how tool names convert to product IDs:

```
"Test Tool"           → test_tool
"PrimeSim Pro"        → primesim_pro
"IC Validator"        → ic_validator
"Custom Compiler *"   → custom_compiler
"Synopsys.ai Copilot" → synopsysai_copilot
"VC SpyGlass"         → vc_spyglass
"TestMAX ATPG"        → testmax_atpg
```

---

## 📞 Support & Help

### Get Help
```bash
# Add tool help
node add-tool.js

# Remove tool help
node remove-tool.js
```

### Common Issues

**Q: Script says "Error: Missing required arguments"**  
A: Make sure to provide both tool name and URL for add-tool.js

**Q: Tool added but animation not working**  
A: The script now handles this automatically!

**Q: Can I undo a removal?**  
A: Yes! Restore from the .backup files created

**Q: What if I want to update a tool?**  
A: Remove the old tool, then add the new one

---

## 📝 Examples of Complete Workflows

### Workflow 1: Add a New Tool
```bash
# Step 1: Add the tool
node add-tool.js "New Tool" "https://newtool.com"

# Step 2: Verify in browser
# Open index.html and check the tool appears

# Step 3: Clean up backups (if satisfied)
del *.backup
del assets\js\*.backup
del assets\css\*.backup
```

### Workflow 2: Replace a Tool
```bash
# Step 1: Remove the old tool
node remove-tool.js "Old Tool"
# Confirm with 'y'

# Step 2: Add the new tool
node add-tool.js "New Tool" "https://newtool.com"

# Step 3: Verify changes
# Check browser

# Step 4: Clean up backups
del *.backup
```

### Workflow 3: Batch Add Tools
```bash
node add-tool.js "Tool A" "https://tool-a.com"
node add-tool.js "Tool B" "https://tool-b.com"
node add-tool.js "Tool C" "https://tool-c.com"
```

---

## 🎨 CSS Animation Details

### Animation Pattern
Each tool card gets a staggered animation delay:

```css
.tool-card:nth-child(1) { animation-delay: 0.8s; }
.tool-card:nth-child(2) { animation-delay: 0.9s; }
.tool-card:nth-child(3) { animation-delay: 1.0s; }
...
.tool-card:nth-child(N) { animation-delay: (0.7 + N*0.1)s; }
```

**Effect**: Cards fade in one by one, creating a smooth cascading effect.

### Auto-Management
- ✅ **add-tool.js**: Adds new animation rule with next delay
- ✅ **remove-tool.js**: Removes unused animation rules

---

## 🚨 Important Warnings

### Do NOT:
❌ Edit files manually after running scripts  
❌ Run scripts while files are open in editor (save first)  
❌ Delete backup files before verifying changes  
❌ Run multiple operations simultaneously  

### Always:
✅ Run scripts from project root directory  
✅ Keep backup files until verified  
✅ Use exact tool names (case-sensitive)  
✅ Test in browser after changes  

---

## 📖 Technical Details

### File Encoding
- Scripts handle Windows line endings (`\r\n`)
- UTF-8 encoding used throughout

### Regex Patterns
Both scripts use robust regex patterns that handle:
- Special characters: `*`, `**`, `.`, `-`
- Multi-word names with spaces
- Various URL formats

### Error Recovery
If something goes wrong:
1. Check error message
2. Restore from .backup files
3. Review tool name spelling
4. Re-run the script

---

## 📚 Additional Information

### Files Modified by Scripts:
- `index.html` - Tool cards and navigation
- `assets/js/script.js` - Configuration objects
- `assets/css/styles.css` - Animation rules

### Backup Files Created:
- `*.backup` - Backup copies (delete after verification)

### Script Execution Time:
- Typically < 100ms per operation
- Instantaneous for most use cases

---

## ✅ Checklist Before Running

### Before Adding a Tool:
- [ ] Have tool name ready
- [ ] Have tool URL ready
- [ ] Decided if --wa or --copilot flag needed
- [ ] In project root directory

### Before Removing a Tool:
- [ ] Know exact tool name (check HTML or JS)
- [ ] Understand tool will be completely removed
- [ ] In project root directory
- [ ] Ready to confirm with 'y'

### After Running Scripts:
- [ ] Check console output for success
- [ ] Verify changes in browser
- [ ] Keep backup files until verified
- [ ] Delete backups when satisfied

---

## 🎉 Success Indicators

### Add Tool Success:
```
✅ All 6 success messages shown
✅ Product ID displayed
✅ Access URL provided
✅ No error messages
```

### Remove Tool Success:
```
✅ All removal messages shown
✅ CSS cleanup count displayed
✅ Success confirmation shown
✅ No error messages
```

---

## 📞 Quick Reference

```bash
# ADD TOOL
node add-tool.js "Tool Name" "https://url.com"           # Basic
node add-tool.js "Tool Name" "https://url.com" --wa      # With WA
node add-tool.js "Tool Name" "https://url.com" --copilot # Copilot

# REMOVE TOOL
node remove-tool.js "Tool Name"                          # Interactive
echo y | node remove-tool.js "Tool Name"                 # Auto-confirm

# RESTORE BACKUPS
copy *.backup [original-name]                            # Windows
cp *.backup [original-name]                              # Linux/Mac
```

---

## 📄 License & Credits

**GTM Copilot Tool Management Scripts**  
Automated tool management for Synopsys.ai GTM Copilot application

**Version**: 1.0  
**Last Updated**: 2025  
**Status**: Production Ready ✅

---

**For questions or issues, please refer to the error messages and backup system.** 🚀

