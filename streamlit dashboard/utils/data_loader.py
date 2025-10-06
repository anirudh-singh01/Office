import pandas as pd
import streamlit as st

# Utility to remove unwanted Excel junk columns
def clean_excel(df):
    return df.loc[:, ~df.columns.str.contains("^Unnamed")]

@st.cache_data
def load_data():
    """
    Loads and cleans both Excel files (main data and summary pivot).
    """
    df_main = pd.read_excel("data/All Time - Till Week 32.xlsx", sheet_name="KA_Data")
    df_summary = pd.read_excel("data/CSG - KA Usage (July 20).xlsx", sheet_name="CSG - KA Usage")

    # Clean up Excel artifacts
    df_main = clean_excel(df_main)
    df_summary = clean_excel(df_summary)

    # Normalize main data types
    df_main["Date"] = pd.to_datetime(df_main["Date"], errors="coerce")
    df_main["metadata.feedback_rating"] = df_main["metadata.feedback_rating"].astype(str).str.lower()

    return df_main, df_summary

def get_data(key: str):
    """
    Unified interface to access either KA data or summary sheet.
    """
    df_main, df_summary = load_data()

    if key == "ka_data":
        return df_main
    elif key == "summary":
        return df_summary
    else:
        raise ValueError("Invalid data key. Expected 'ka_data' or 'summary'.")