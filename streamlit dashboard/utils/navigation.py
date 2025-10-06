# utils/navigation.py — navigation with st.query_params
import streamlit as st

def show_navigation():
    """
    Modern top navigation bar using URL query params (new API).
    """
    pages = {
        "Summary": "summary_page",
        "Management": "management_page",
        "User": "user_page",
        "Chatbot": "chatbot_page"
    }

    cols = st.columns(len(pages))

    # Get current query param
    current_page = st.query_params.get("page", "summary_page")

    for idx, (label, script) in enumerate(pages.items()):
        with cols[idx]:
            if st.button(label, use_container_width=True):
                st.query_params["page"] = script