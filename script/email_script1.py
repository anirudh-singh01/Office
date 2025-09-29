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
            
            # HTML Body
            html_body = f"""
            <html>
            <body style="font-family: 'Segoe UI', Arial, sans-serif; margin: 0; padding: 20px; background-color: #f8f9fa;">
                <div style="max-width: 600px; margin: 0 auto; background-color: white; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); overflow: hidden;">
                    
                    <!-- Header -->
                    <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center;">
                        <h1 style="color: white; margin: 0; font-size: 24px; font-weight: 300;">Weekly Feedback Report</h1>
                        <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0; font-size: 14px;">Performance Analytics Dashboard</p>
                    </div>
                    
                    <!-- Content -->
                    <div style="padding: 30px;">
                        <h2 style="color: #333; margin: 0 0 20px 0; font-size: 18px;">Dear {user},</h2>
                        
                        <p style="color: #666; line-height: 1.6; margin: 0 0 25px 0;">
                            We hope this message finds you well. Please find below your comprehensive feedback report for the specified period. This report contains valuable insights into your performance metrics and areas for continued excellence.
                        </p>
                        
                        <!-- Performance Summary -->
                        <div style="background-color: #f8f9fa; padding: 20px; border-radius: 6px; margin: 20px 0;">
                            <h3 style="color: #333; margin: 0 0 15px 0; font-size: 16px;">Performance Summary</h3>
                            <div style="display: flex; justify-content: space-between; flex-wrap: wrap;">
                                <div style="text-align: center; margin: 10px;">
                                    <div style="font-size: 24px; font-weight: bold; color: #667eea;">{likes}</div>
                                    <div style="font-size: 12px; color: #666;">Positive Feedback</div>
                                </div>
                                <div style="text-align: center; margin: 10px;">
                                    <div style="font-size: 24px; font-weight: bold; color: #dc3545;">{dislikes}</div>
                                    <div style="font-size: 12px; color: #666;">Areas for Improvement</div>
                                </div>
                                <div style="text-align: center; margin: 10px;">
                                    <div style="font-size: 24px; font-weight: bold; color: #28a745;">{week}</div>
                                    <div style="font-size: 12px; color: #666;">Reporting Period</div>
                                </div>
                            </div>
                        </div>
                        
                        <!-- Detailed Report Table -->
                        <table style="width: 100%; border-collapse: collapse; margin: 25px 0; background-color: white;">
                            <thead>
                                <tr style="background-color: #f8f9fa;">
                                    <th style="padding: 15px; text-align: left; border-bottom: 2px solid #dee2e6; color: #495057; font-weight: 600;">Metric</th>
                                    <th style="padding: 15px; text-align: left; border-bottom: 2px solid #dee2e6; color: #495057; font-weight: 600;">Value</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td style="padding: 12px 15px; border-bottom: 1px solid #dee2e6; color: #495057; font-weight: 500;">Tool</td>
                                    <td style="padding: 12px 15px; border-bottom: 1px solid #dee2e6; color: #333;">{tool}</td>
                                </tr>
                                <tr>
                                    <td style="padding: 12px 15px; border-bottom: 1px solid #dee2e6; color: #495057; font-weight: 500;">Period</td>
                                    <td style="padding: 12px 15px; border-bottom: 1px solid #dee2e6; color: #333;">{week}, {year}</td>
                                </tr>
                                <tr>
                                    <td style="padding: 12px 15px; border-bottom: 1px solid #dee2e6; color: #495057; font-weight: 500;">Positive Feedback</td>
                                    <td style="padding: 12px 15px; border-bottom: 1px solid #dee2e6; {like_color} text-align: center; font-weight: bold;">{likes}</td>
                                </tr>
                                <tr>
                                    <td style="padding: 12px 15px; border-bottom: 1px solid #dee2e6; color: #495057; font-weight: 500;">Improvement Areas</td>
                                    <td style="padding: 12px 15px; border-bottom: 1px solid #dee2e6; text-align: center; font-weight: bold; color: #dc3545;">{dislikes}</td>
                                </tr>
                                <tr>
                                    <td style="padding: 12px 15px; border-bottom: 1px solid #dee2e6; color: #495057; font-weight: 500;">Comments</td>
                                    <td style="padding: 12px 15px; border-bottom: 1px solid #dee2e6; color: #333; font-style: italic;">{comment}</td>
                                </tr>
                            </tbody>
                        </table>
                        
                        <p style="color: #666; line-height: 1.6; margin: 25px 0 0 0;">
                            Thank you for your continued dedication and hard work. Should you have any questions about this report or would like to discuss your performance in detail, please don't hesitate to reach out.
                        </p>
                    </div>
                    
                    <!-- Footer -->
                    <div style="background-color: #f8f9fa; padding: 20px; text-align: center; border-top: 1px solid #dee2e6;">
                        <p style="color: #6c757d; margin: 0; font-size: 14px;">
                            Best regards,<br>
                            <strong style="color: #495057;">Performance Analytics Team</strong>
                        </p>
                        <p style="color: #adb5bd; margin: 10px 0 0 0; font-size: 12px;">
                            This is an automated report. Please do not reply to this email.
                        </p>
                    </div>
                </div>
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
