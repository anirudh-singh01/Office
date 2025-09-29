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
            mail.Subject = f"Demo Mail - Feedback Report - {week}, {year} ({tool})"
            
            # HTML Body - Outlook Classic Compatible
            html_body = f"""
            <html>
            <body style="font-family: Arial, sans-serif; margin: 0; padding: 20px; background-color: #f8f9fa;">
                <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #f8f9fa;">
                    <tr>
                        <td align="center">
                            <table width="600" cellpadding="0" cellspacing="0" border="0" style="background-color: white; border: 1px solid #ddd;">
                                
                                <!-- Header -->
                                <tr>
                                    <td style="background-color: #667eea; padding: 30px; text-align: center;">
                                        <h1 style="color: white; margin: 0; font-size: 24px; font-weight: bold; font-family: Arial, sans-serif;">Weekly Feedback Report</h1>
                                        <p style="color: white; margin: 10px 0 0 0; font-size: 14px; font-family: Arial, sans-serif;">Performance Analytics Dashboard</p>
                                    </td>
                                </tr>
                                
                                <!-- Content -->
                                <tr>
                                    <td style="padding: 30px;">
                                        <h2 style="color: #333; margin: 0 0 20px 0; font-size: 18px; font-family: Arial, sans-serif;">Dear {user},</h2>
                                        
                                        <p style="color: #666; line-height: 1.5; margin: 0 0 25px 0; font-family: Arial, sans-serif;">
                                            We hope this message finds you well. Please find below your comprehensive feedback report for the specified period. This report contains valuable insights into your performance metrics and areas for continued excellence.
                                        </p>
                                        
                                        <!-- Performance Summary -->
                                        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #f8f9fa; margin: 20px 0;">
                                            <tr>
                                                <td style="padding: 20px;">
                                                    <h3 style="color: #333; margin: 0 0 15px 0; font-size: 16px; font-family: Arial, sans-serif;">Performance Summary</h3>
                                                    
                                                    <table width="100%" cellpadding="10" cellspacing="0" border="0">
                                                        <tr>
                                                            <td width="33%" style="text-align: center; vertical-align: top;">
                                                                <div style="font-size: 24px; font-weight: bold; color: #667eea; font-family: Arial, sans-serif;">{likes}</div>
                                                                <div style="font-size: 12px; color: #666; font-family: Arial, sans-serif;">Positive Feedback</div>
                                                            </td>
                                                            <td width="33%" style="text-align: center; vertical-align: top;">
                                                                <div style="font-size: 24px; font-weight: bold; color: #dc3545; font-family: Arial, sans-serif;">{dislikes}</div>
                                                                <div style="font-size: 12px; color: #666; font-family: Arial, sans-serif;">Areas for Improvement</div>
                                                            </td>
                                                            <td width="34%" style="text-align: center; vertical-align: top;">
                                                                <div style="font-size: 24px; font-weight: bold; color: #28a745; font-family: Arial, sans-serif;">{week}</div>
                                                                <div style="font-size: 12px; color: #666; font-family: Arial, sans-serif;">Reporting Period</div>
                                                            </td>
                                                        </tr>
                                                    </table>
                                                </td>
                                            </tr>
                                        </table>
                                        
                                        <!-- Detailed Report Table -->
                                        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin: 25px 0; border: 1px solid #ddd;">
                                            <tr style="background-color: #f8f9fa;">
                                                <td style="padding: 15px; border-bottom: 2px solid #ddd; color: #495057; font-weight: bold; font-family: Arial, sans-serif;" width="40%">Metric</td>
                                                <td style="padding: 15px; border-bottom: 2px solid #ddd; color: #495057; font-weight: bold; font-family: Arial, sans-serif;" width="60%">Value</td>
                                            </tr>
                                            <tr>
                                                <td style="padding: 12px 15px; border-bottom: 1px solid #ddd; color: #495057; font-weight: bold; font-family: Arial, sans-serif;">Tool</td>
                                                <td style="padding: 12px 15px; border-bottom: 1px solid #ddd; color: #333; font-family: Arial, sans-serif;">{tool}</td>
                                            </tr>
                                            <tr>
                                                <td style="padding: 12px 15px; border-bottom: 1px solid #ddd; color: #495057; font-weight: bold; font-family: Arial, sans-serif;">Period</td>
                                                <td style="padding: 12px 15px; border-bottom: 1px solid #ddd; color: #333; font-family: Arial, sans-serif;">{week}, {year}</td>
                                            </tr>
                                            <tr>
                                                <td style="padding: 12px 15px; border-bottom: 1px solid #ddd; color: #495057; font-weight: bold; font-family: Arial, sans-serif;">Positive Feedback</td>
                                                <td style="padding: 12px 15px; border-bottom: 1px solid #ddd; text-align: center; font-weight: bold; font-family: Arial, sans-serif; {like_color}">{likes}</td>
                                            </tr>
                                            <tr>
                                                <td style="padding: 12px 15px; border-bottom: 1px solid #ddd; color: #495057; font-weight: bold; font-family: Arial, sans-serif;">Improvement Areas</td>
                                                <td style="padding: 12px 15px; border-bottom: 1px solid #ddd; text-align: center; font-weight: bold; color: #dc3545; font-family: Arial, sans-serif;">{dislikes}</td>
                                            </tr>
                                            <tr>
                                                <td style="padding: 12px 15px; border-bottom: 1px solid #ddd; color: #495057; font-weight: bold; font-family: Arial, sans-serif;">Comments</td>
                                                <td style="padding: 12px 15px; border-bottom: 1px solid #ddd; color: #333; font-style: italic; font-family: Arial, sans-serif;">{comment}</td>
                                            </tr>
                                        </table>
                                        
                                        <p style="color: #666; line-height: 1.5; margin: 25px 0 0 0; font-family: Arial, sans-serif;">
                                            Thank you for your continued dedication and hard work. Should you have any questions about this report or would like to discuss your performance in detail, please don't hesitate to reach out.
                                        </p>
                                    </td>
                                </tr>
                                
                                <!-- Footer -->
                                <tr>
                                    <td style="background-color: #f8f9fa; padding: 20px; text-align: center; border-top: 1px solid #ddd;">
                                        <p style="color: #6c757d; margin: 0; font-size: 14px; font-family: Arial, sans-serif;">
                                            Best regards,<br>
                                            <strong style="color: #495057;">Performance Analytics Team</strong>
                                        </p>
                                        <p style="color: #adb5bd; margin: 10px 0 0 0; font-size: 12px; font-family: Arial, sans-serif;">
                                            This is an automated report. Please do not reply to this email.
                                        </p>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                </table>
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
