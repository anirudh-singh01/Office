import pandas as pd
import win32com.client as win32
import re
import os

def validate_email(email):
    """Basic email validation"""
    pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    return re.match(pattern, email) is not None

def main():
    # Configuration - File path to your Excel file
    file_path = r"C:\Users\sanirudh\Downloads\Book.xlsx"
    
    # Error handling and validation
    try:
        if not os.path.exists(file_path):
            raise FileNotFoundError(f"Excel file not found: {file_path}")
        
        df = pd.read_excel(file_path)
        
        # Check if required columns exist
        required_columns = ['User', 'userEmail', 'Like', 'dislike', 'comment', 'week', 'year', 'tools']
        missing_columns = [col for col in required_columns if col not in df.columns]
        
        if missing_columns:
            raise ValueError(f"Missing required columns: {missing_columns}")
        
        print(f"Successfully loaded {len(df)} rows from Excel file")
        
    except FileNotFoundError as e:
        print(f"Error: {e}")
        return
    except ValueError as e:
        print(f"Error: {e}")
        if 'df' in locals():
            print(f"Available columns in Excel: {list(df.columns)}")
        return
    except Exception as e:
        print(f"Unexpected error loading Excel file: {e}")
        return

    # Start Outlook with error handling
    try:
        outlook = win32.Dispatch('Outlook.Application')
        print("Successfully connected to Outlook")
    except Exception as e:
        print(f"Error connecting to Outlook: {e}")
        print("Make sure Microsoft Outlook is installed and running")
        return

    # Process each row and send emails
    success_count = 0
    error_count = 0
    
    for index, row in df.iterrows():
        try:
            user = row['User']
            email = row['userEmail']
            likes = row['Like']
            dislikes = row['dislike']
            comment = row['comment']
            week = row['week']
            year = row['year']
            tool = row['tools']
            
            # Validate email address
            if not validate_email(str(email)):
                print(f"Warning: Invalid email address for {user}: {email}")
                error_count += 1
                continue
            
            # Handle NaN or empty values
            if pd.isna(user) or pd.isna(email):
                print(f"Warning: Missing user name or email for row {index + 1}")
                error_count += 1
                continue
            
            # Convert numeric values safely
            try:
                likes = float(likes) if not pd.isna(likes) else 0
                dislikes = float(dislikes) if not pd.isna(dislikes) else 0
            except (ValueError, TypeError):
                print(f"Warning: Invalid numeric values for {user}")
                likes = 0
                dislikes = 0
            
            # Handle year as string
            year = str(year) if not pd.isna(year) else "N/A"

            # Conditional color for Like
            if likes < 5:
                like_color = "background-color:#FF4C4C; color:white;"  # red
            elif likes > 5:
                like_color = "background-color:#4CAF50; color:white;"  # green
            else:
                like_color = ""  # no color

            # Create Outlook mail
            mail = outlook.CreateItem(0)
            mail.To = email
            mail.Subject = f"Feedback Report - {week}, {year} ({tool})"
            
            # HTML Body
            html_body = f"""
            <html>
            <body style="font-family:Arial, sans-serif;">
                <h3>Hello {user},</h3>
                <p>Please find your weekly feedback report below:</p>
                
                <table border="1" cellpadding="6" cellspacing="0" style="border-collapse:collapse;">
                    <tr>
                        <th>User</th>
                        <th>Tool</th>
                        <th>Week</th>
                        <th>Year</th>
                        <th>Likes</th>
                        <th>Dislikes</th>
                        <th>Comment</th>
                    </tr>
                    <tr>
                        <td>{user}</td>
                        <td>{tool}</td>
                        <td>{week}</td>
                        <td>{year}</td>
                        <td style="{like_color} text-align:center;">{likes}</td>
                        <td style="text-align:center;">{dislikes}</td>
                        <td>{comment}</td>
                    </tr>
                </table>
                
                <br>
                <p>Regards,<br>Your Team</p>
            </body>
            </html>
            """

            mail.HTMLBody = html_body
            mail.Display()  # Change to mail.Send() to directly send emails
            success_count += 1
            print(f"Email created for {user} ({email})")
            
        except Exception as e:
            print(f"Error processing row {index + 1} for user {user}: {e}")
            error_count += 1
            continue
    
    print(f"\nSummary: {success_count} emails processed successfully, {error_count} errors")

if __name__ == "__main__":
    main()
