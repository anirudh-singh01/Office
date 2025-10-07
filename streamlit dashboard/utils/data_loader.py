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
    with st.spinner("Loading data... This may take a moment for large files."):
        # Read Excel with optimized settings for large files
        df = pd.read_excel(
            r"PASTE_YOUR_EXCEL_FILE_PATH_HERE", 
            sheet_name="Sheet1",
            engine='openpyxl',  # More memory efficient for large files
            dtype_backend='pyarrow'  # Use PyArrow for better performance
        )
        
        # Clean up Excel artifacts
        df = clean_excel(df)
        
        # Optimize data types to reduce memory usage
        df = optimize_dtypes(df)
        
        # Normalize data types
        df["Date"] = pd.to_datetime(df["Date"], errors="coerce")
        df["metadata.feedback_rating"] = df["metadata.feedback_rating"].astype(str).str.lower()
        
        # Show data info
        st.success(f"✅ Loaded {len(df):,} rows with {len(df.columns)} columns")
        
    return df

def optimize_dtypes(df):
    """
    Optimize data types to reduce memory usage for large datasets.
    """
    # Convert object columns to category where appropriate
    for col in df.columns:
        if df[col].dtype == 'object':
            # If column has many repeated values, convert to category
            if df[col].nunique() / len(df) < 0.5:  # Less than 50% unique values
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