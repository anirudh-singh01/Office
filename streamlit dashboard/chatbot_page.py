# chatbot_page.py — Streamlit native chat interface
import streamlit as st
from utils.navigation import show_navigation

def run():
    st.title("💬 Chatbot Assistant")
    show_navigation()

    with st.chat_message("assistant"):
        st.markdown("Hi! I'm your dashboard assistant. Ask me anything about usage, tools, or feedback!")

    if prompt := st.chat_input("Ask a question..."):
        st.chat_message("user").write(prompt)
        st.chat_message("assistant").write("I'm still learning! I’ll soon help with: " + prompt + "")

    st.caption("Smart dashboard assistant in progress.")