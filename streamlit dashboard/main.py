# main.py — Master launcher with global chatbot + page switching
import streamlit as st
from importlib import import_module

# Set global config
st.set_page_config(page_title="Synopsys Executive Dashboard", layout="wide")
st.markdown("<style>footer {visibility: hidden;}</style>", unsafe_allow_html=True)

# --- PAGE ROUTING ---
current_page = st.query_params.get("page", "summary_page")

try:
    page = import_module(current_page)
    page.run()
except ModuleNotFoundError:
    st.error(f"Page {current_page} not found.")

# --- CHATBOT ICON ---
chatbot_button = """
<style>
#chatbot-button {
    position: fixed;
    bottom: 25px;
    right: 25px;
    z-index: 100;
    background-color: #6E2BC2;
    color: white;
    border: none;
    border-radius: 50%;
    width: 60px;
    height: 60px;
    font-size: 28px;
    box-shadow: 2px 2px 10px rgba(0,0,0,0.3);
    cursor: pointer;
}
#chatbot-button:hover {
    background-color: #5023A4;
}
</style>
<a href='?page=chatbot_page'>
    <button id="chatbot-button">💬</button>
</a>
"""
st.markdown(chatbot_button, unsafe_allow_html=True)