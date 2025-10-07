import pandas as pd
import streamlit as st
from typing import Optional

# Utility to remove unwanted Excel junk columns
def clean_excel(df):
    return df.loc[:, ~df.columns.str.contains("^Unnamed")]

@st.cache_data(ttl=3600)  # Cache for 1 hour
def load_ka_data():
    """
    Loads and cleans the main KA data Excel file with optimizations for large datasets.
    """
    # Show loading progress
    with st.spinner("Loading data..."):
        # Read Excel with optimized settings for large files
        try:
            df = pd.read_excel(
                r"PASTE_YOUR_EXCEL_FILE_PATH_HERE", 
                sheet_name="Sheet1",
                engine='openpyxl',  # More memory efficient for large files
                dtype_backend='pyarrow'  # Use PyArrow for better performance
            )
        except FileNotFoundError:
            st.error("❌ Excel file not found! Please update the file path in utils/data_loader.py (line 18)")
            st.stop()
        except Exception as e:
            st.error(f"❌ Error loading Excel file: {str(e)}")
            st.stop()
        
        # Clean up Excel artifacts
        df = clean_excel(df)
        
        # Optimize data types to reduce memory usage
        df = optimize_dtypes(df)
        
        # Validate required columns
        required_columns = ["Date", "Username", "tool", "metadata.feedback_rating"]
        missing_columns = [col for col in required_columns if col not in df.columns]
        if missing_columns:
            st.error(f"❌ Missing required columns: {missing_columns}")
            st.error(f"Available columns: {list(df.columns)}")
            st.stop()
        
        # Log successful data loading for large datasets
        st.success(f"✅ Data loaded successfully! {len(df):,} rows, {len(df.columns)} columns")
        
        # Normalize data types
        df["Date"] = pd.to_datetime(df["Date"], errors="coerce")
        df["metadata.feedback_rating"] = df["metadata.feedback_rating"].astype(str).str.lower()
        
        # Create year_week_label if it doesn't exist
        if "year_week_label" not in df.columns:
            df["year_week_label"] = df["Date"].dt.strftime('%Y-W%U')
        
        # Validate data integrity for large datasets
        null_dates = df["Date"].isnull().sum()
        if null_dates > 0:
            st.warning(f"⚠️ Found {null_dates:,} rows with invalid dates - these will be excluded from analysis")
        
        # Log data quality metrics
        st.info(f"📊 Data Quality: {df['Username'].nunique():,} unique users, {df['tool'].nunique()} unique tools, Date range: {df['Date'].min().strftime('%Y-%m-%d')} to {df['Date'].max().strftime('%Y-%m-%d')}")
        
    return df

def optimize_dtypes(df):
    """
    Optimize data types to reduce memory usage for large datasets (lakhs+ rows).
    """
    original_memory = df.memory_usage(deep=True).sum() / 1024 / 1024
    
    # Convert object columns to category where appropriate
    for col in df.columns:
        if df[col].dtype == 'object':
            # If column has many repeated values, convert to category
            unique_ratio = df[col].nunique() / len(df)
            if unique_ratio < 0.5:  # Less than 50% unique values
                df[col] = df[col].astype('category')
    
    # Convert numeric columns to appropriate types
    numeric_cols = df.select_dtypes(include=['int64', 'float64']).columns
    for col in numeric_cols:
        if df[col].dtype == 'int64':
            # Downcast integers
            df[col] = pd.to_numeric(df[col], downcast='integer')
        elif df[col].dtype == 'float64':
            # Downcast floats
            df[col] = pd.to_numeric(df[col], downcast='float')
    
    # Optimize datetime columns
    for col in df.columns:
        if df[col].dtype == 'datetime64[ns]':
            # Convert to datetime64[ns] with timezone if needed
            df[col] = pd.to_datetime(df[col], errors='coerce')
    
    optimized_memory = df.memory_usage(deep=True).sum() / 1024 / 1024
    memory_saved = original_memory - optimized_memory
    memory_reduction = (memory_saved / original_memory * 100) if original_memory > 0 else 0
    
    if memory_saved > 10:  # Only show if significant memory saved
        st.info(f"💾 Memory optimization: {memory_saved:.1f} MB saved ({memory_reduction:.1f}% reduction)")
    
    return df

@st.cache_data
def get_data_summary(df):
    """
    Get summary statistics for the dataset.
    """
    return {
        'total_rows': len(df),
        'total_columns': len(df.columns),
        'memory_usage_mb': df.memory_usage(deep=True).sum() / 1024 / 1024,
        'date_range': f"{df['Date'].min().strftime('%Y-%m-%d')} to {df['Date'].max().strftime('%Y-%m-%d')}",
        'unique_users': df['Username'].nunique(),
        'unique_tools': df['tool'].nunique()
    }