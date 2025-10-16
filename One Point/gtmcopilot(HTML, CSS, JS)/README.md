# GTM Copilot - Tool Management Scripts

## 📖 Overview

Automated scripts to manage tools in the GTM Copilot application. These scripts handle adding and removing tools from HTML, JavaScript, and CSS files automatically.

---

## 🚀 Quick Start

**Prerequisites:** Node.js installed

```bash
# Verify Node.js
node --version

# Add a tool
node add-tool.js "Tool Name" "https://tool-url.com"

# Remove a tool
node remove-tool.js "Tool Name"
```

---

## ➕ Adding Tools

### Basic Usage
```bash
node add-tool.js "Tool Name" "https://tool-url.com"
```

### With Special Flags
```bash
# Workflow Assistant tool (adds * suffix)
node add-tool.js "Custom Compiler" "https://url.com" --wa

# Copilot-specific tool (adds ** suffix)
node add-tool.js "AI Helper" "https://url.com" --copilot
```

### What It Does
- ✅ Creates backup files (.backup extension)
- ✅ Adds tool card to welcome page
- ✅ Adds navigation item to sidebar
- ✅ Updates MENU_CONFIG and URL_ROUTES in JavaScript
- ✅ Adds CSS animation rule

### Example Output
```
✓ Backup created: index.html.backup
✓ Tool card added to welcome page
✓ Navigation item added to sidebar
✓ Tool added to MENU_CONFIG
✓ Tool added to URL_ROUTES
✓ CSS animation rule added

✓ Successfully added new tool!
Tool Details:
  Name: Tool Name
  URL: https://tool-url.com
  Product ID: tool_name
Access the tool at: ?product=tool_name
```

---

## ➖ Removing Tools

### Basic Usage
```bash
node remove-tool.js "Tool Name"
```

### What It Does
- ✅ Asks for confirmation
- ✅ Creates backup files
- ✅ Removes tool from all files
- ✅ Cleans up unused CSS animations

### Auto-confirm (non-interactive)
```bash
echo y | node remove-tool.js "Tool Name"
```

---

## 🔄 Product ID Generation

Tool names are automatically converted to URL-safe product IDs:

| Tool Name | Product ID |
|-----------|------------|
| `IC Validator` | `ic_validator` |
| `PrimeSim Pro` | `primesim_pro` |
| `Custom Compiler *` | `custom_compiler` |
| `Synopsys.ai Copilot **` | `synopsysai_copilot` |

**Rules:** Lowercase, remove special characters, replace spaces with underscores.

---

## 🛡️ Safety Features

- **Automatic Backups:** All files backed up before changes
- **User Confirmation:** Removal requires confirmation
- **Error Handling:** Helpful error messages with recovery instructions

### Restore from Backups
```bash
# Windows
Copy-Item index.html.backup index.html -Force
Copy-Item assets\js\script.js.backup assets\js\script.js -Force
Copy-Item assets\css\styles.css.backup assets\css\styles.css -Force

# Linux/Mac
cp index.html.backup index.html
cp assets/js/script.js.backup assets/js/script.js
cp assets/css/styles.css.backup assets/css/styles.css
```

---

## 📊 Current Tools (16)

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

## 🎯 Common Use Cases

### Add Multiple Tools
```bash
node add-tool.js "Tool A" "https://url-a.com"
node add-tool.js "Tool B" "https://url-b.com" --wa
node add-tool.js "Tool C" "https://url-c.com" --copilot
```

### Replace a Tool
```bash
node remove-tool.js "Old Tool"  # Confirm with 'y'
node add-tool.js "New Tool" "https://newurl.com"
```

---

## ⚠️ Important Notes

### DO:
✅ Run scripts from project root directory  
✅ Use quotes for tool names with spaces  
✅ Keep backup files until verified  
✅ Use exact tool names (case-sensitive)  

### DON'T:
❌ Delete backup files immediately  
❌ Run multiple scripts simultaneously  
❌ Edit files manually after running scripts  

---

## 🐛 Troubleshooting

### Common Errors

**"Tool not found in HTML"**  
→ Check tool name spelling and case

**"Missing required arguments"**  
→ Follow syntax: `node add-tool.js "Name" "URL"`

**"Could not find MENU_CONFIG"**  
→ Restore from backup files

### Get Help
```bash
node add-tool.js      # Shows usage
node remove-tool.js   # Shows usage
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

# CLEAN UP BACKUPS
del *.backup assets\js\*.backup assets\css\*.backup     # Windows
rm *.backup assets/js/*.backup assets/css/*.backup      # Linux/Mac
```

---

## 📄 Project Info

**GTM Copilot Tool Management Scripts**  
Version: 1.0 | Status: Production Ready ✅

Automated tool management for Synopsys.ai GTM Copilot application.

