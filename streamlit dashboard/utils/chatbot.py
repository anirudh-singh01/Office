import streamlit as st
import pandas as pd


def get_chatbot_response(user_input: str, df_data: pd.DataFrame) -> str:
    user_input_lower = user_input.lower()

    if "chat_history" not in st.session_state:
        st.session_state.chat_history = []
    st.session_state.chat_history.append({"role": "user", "content": user_input})

    total_users = df_data["Username"].nunique()
    total_queries = len(df_data)
    tools_count = df_data["tool"].nunique()
    feedback_data = df_data["metadata.feedback_rating"].dropna().astype(str).str.lower()
    feedback_given = feedback_data.isin(["like", "dislike", "comment"]).sum()
    feedback_total = feedback_data.isin(["like", "dislike", "comment", "none"]).sum()
    feedback_pct = (feedback_given / feedback_total * 100) if feedback_total > 0 else 0

    top_tools = df_data["tool"].value_counts().head(5)
    top_tools_list = ", ".join([f"{tool} ({count} queries)" for tool, count in top_tools.items()])

    if any(word in user_input_lower for word in ["hello", "hi", "hey", "greetings"]):
        response = (
            f"Hello! 👋 I'm your Synopsys Executive Dashboard assistant. "
            f"Currently, your dashboard shows data for **{total_users:,} unique users** with "
            f"**{total_queries:,} total queries** across **{tools_count} tools**."
        )
    elif any(word in user_input_lower for word in ["help", "assist", "support", "guide"]):
        response = (
            "I can help with:\n\n"
            "📊 Dashboard insights\n"
            "🔍 Data analysis\n"
            "📈 Performance trends\n"
            "💡 Tips on filters and charts\n\n"
            "Try asking: 'Most used tools?' or 'Feedback percentage?'"
        )
    elif any(word in user_input_lower for word in ["tool", "tools", "most used", "popular"]):
        response = (
            f"Top 5 most used tools:\n\n{top_tools_list}\n\n"
            "Use Filters to focus on specific tools."
        )
    elif any(word in user_input_lower for word in ["feedback", "rating", "like", "dislike"]):
        response = (
            f"📊 Feedback overview:\n- Total feedback: {feedback_given:,}\n"
            f"- Feedback %: {feedback_pct:.1f}%\n- Types: like, dislike, comment, none\n\n"
            "See details in Graph 3 and per tool in Graph 1."
        )
    elif any(word in user_input_lower for word in ["user", "users", "people", "active"]):
        avg = (total_queries / total_users) if total_users else 0
        response = (
            f"👥 Users: {total_users:,}\n💬 Queries: {total_queries:,}\n"
            f"Avg queries/user: {avg:.1f}\n\nUse KA User filter for specifics."
        )
    elif any(word in user_input_lower for word in ["chart", "graph", "visualization", "plot"]):
        response = (
            "📈 Charts:\n- Graph 1: Tool usage + feedback\n- Graph 3: KA feedback pie\n\n"
            "Tip: Use filters to customize data."
        )
    elif any(word in user_input_lower for word in ["filter", "filters", "customize", "select"]):
        response = (
            "🔍 Filters:\nTools, Management Chain, Date Range, KA Users\n\n"
            "Tip: Start with Week filter for recent trends."
        )
    elif any(word in user_input_lower for word in ["download", "export", "csv", "data"]):
        response = (
            "📥 Downloads:\n1) View Raw Data Table\n2) Download Filtered Data (CSV)\n"
        )
    else:
        response = (
            f"You asked: '{user_input}'.\n\nTry: 'Most used tools', 'Feedback %', 'User stats', 'Explain charts', 'How to filter'.\n"
            f"Quick stats: {total_users:,} users, {total_queries:,} queries, {feedback_pct:.1f}% feedback."
        )

    st.session_state.chat_history.append({"role": "assistant", "content": response})
    return response


def render_chatbot(df: pd.DataFrame) -> None:
    if "chat_history" not in st.session_state or len(st.session_state.chat_history) == 0:
        with st.chat_message("assistant"):
            st.markdown(
                "👋 **Hi! I'm your Synopsys Executive Dashboard assistant.**\n\n"
                "Ask me about tools, users, feedback, charts, or filters."
            )

    if "chat_history" in st.session_state:
        for message in st.session_state.chat_history:
            with st.chat_message(message["role"]):
                st.markdown(message["content"])

    if prompt := st.chat_input("Ask about the dashboard..."):
        st.chat_message("user").write(prompt)
        reply = get_chatbot_response(prompt, df)
        with st.chat_message("assistant"):
            st.markdown(reply)


