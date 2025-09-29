# Email Feedback Report Generator

This Python script reads Excel data and automatically creates personalized feedback report emails in Microsoft Outlook for grouped users.

## Features

- Groups multiple tools per user into single emails
- Conditional color formatting for Like ratings:
  - < 5 likes: Red background
  - > 5 likes: Green background  
  - = 5 likes: No color
- Professional HTML email formatting
- Creates Outlook draft emails for review before sending

## Prerequisites

- Microsoft Outlook installed on Windows
- Python 3.x
- Required Python packages (see Installation section)

## Installation Commands

### Main Command:
```bash
pip install pandas openpyxl pywin32
```

### Alternative Commands:
```bash
python -m pip install pandas openpyxl pywin32
```

## Excel File Setup

Your Excel file must contain the following columns:
- `User`: User's name
- `userEmail`: Email address 
- `Like`: Number of likes (for color coding)
- `dislike`: Number of dislikes
- `comment`: User's comment
- `week`: Week identifier
- `year`: Year
- `tools`: Tool name

## Usage

1. **Update the file path**: Edit `email_script.ipynb` and change:
   ```python
   file_path = "your_file.xlsx"  # Replace with your actual file path
   ```

2. **Run the script**: Open and execute the Jupyter notebook cells

3. **Review emails**: The script will create Outlook draft emails that you can review before sending

## Important Notes

- Make sure Outlook is installed and configured before running the script
- The script uses `.Display()` to show emails as drafts - change to `.Send()` to automatically send emails
- Users with multiple tools in the same week/year will receive one email with all tools listed in a table
- Subject line format: `Feedback Report - {week}, {year}`

## Troubleshooting

### Common Issues:

1. **"Module not found" error**: Install missing packages using pip commands above
2. **Outlook not opening**: Ensure Outlook is installed and configured
3. **Excel file not found**: Check the file path is correct and the file exists
4. **Permission errors**: Run Python/Jupyter as administrator if needed

