# main.py — Synopsys Executive Dashboard
import streamlit as st
import pandas as pd
import plotly.express as px
import plotly.graph_objects as go
from utils.data_loader import load_ka_data, get_data_summary

# Set global config
st.set_page_config(page_title="Synopsys Executive Dashboard", layout="wide")
st.markdown("<style>footer {visibility: hidden;}</style>", unsafe_allow_html=True)

# --- CHATBOT FUNCTIONALITY ---
def get_chatbot_response(user_input, df_data):
    """Generate intelligent responses based on user input and dashboard data"""
    user_input_lower = user_input.lower()
    
    # Initialize session state for conversation history
    if "chat_history" not in st.session_state:
        st.session_state.chat_history = []
    
    # Add user message to history
    st.session_state.chat_history.append({"role": "user", "content": user_input})
    
    # Dashboard data insights
    total_users = df_data["Username"].nunique()
    total_queries = len(df_data)
    tools_count = df_data["tool"].nunique()
    feedback_data = df_data["metadata.feedback_rating"].dropna().astype(str).str.lower()
    feedback_given = feedback_data.isin(["like", "dislike", "comment"]).sum()
    feedback_total = feedback_data.isin(["like", "dislike", "comment", "none"]).sum()
    feedback_pct = (feedback_given / feedback_total * 100) if feedback_total > 0 else 0
    
    # Top tools by usage
    top_tools = df_data["tool"].value_counts().head(5)
    top_tools_list = ", ".join([f"{tool} ({count} queries)" for tool, count in top_tools.items()])
    
    # Response logic based on keywords
    if any(word in user_input_lower for word in ["hello", "hi", "hey", "greetings"]):
        response = f"Hello! 👋 I'm your Synopsys Executive Dashboard assistant. I can help you understand your analytics data. Currently, your dashboard shows data for **{total_users:,} unique users** with **{total_queries:,} total queries** across **{tools_count} different tools**."
    
    elif any(word in user_input_lower for word in ["help", "assist", "support", "guide"]):
        response = """I can help you with:

📊 **Dashboard Insights**: Ask about user metrics, tool usage, or feedback trends
🔍 **Data Analysis**: Get specific statistics about your Synopsys tools
📈 **Performance**: Understand usage patterns and feedback percentages
💡 **Tips**: Learn how to use filters and interpret the charts

Try asking: "What are the most used tools?" or "How is the feedback percentage?" """
    
    elif any(word in user_input_lower for word in ["tool", "tools", "most used", "popular"]):
        response = f"Here are the top 5 most used tools in your dashboard:\n\n{top_tools_list}\n\nYou can use the **Filters** section to focus on specific tools or analyze their performance over time."
    
    elif any(word in user_input_lower for word in ["feedback", "rating", "like", "dislike"]):
        response = f"📊 **Feedback Overview**:\n- **Total feedback given**: {feedback_given:,} responses\n- **Feedback percentage**: {feedback_pct:.1f}%\n- **Feedback types**: like, dislike, comment, none\n\nYou can see detailed feedback distribution in **Graph 3** and analyze trends by tool in **Graph 1**."
    
    elif any(word in user_input_lower for word in ["user", "users", "people", "active"]):
        response = f"👥 **User Statistics**:\n- **Total unique users**: {total_users:,}\n- **Total queries**: {total_queries:,}\n- **Average queries per user**: {total_queries/total_users:.1f}\n\nUse the **KA User** filter to focus on specific users or management chains."
    
    elif any(word in user_input_lower for word in ["chart", "graph", "visualization", "plot"]):
        response = """📈 **Dashboard Charts Explained**:

**Graph 1 - Tool Usage Analysis**: Shows feedback percentage, total queries, and unique users for each tool
**Graph 2 - Weekly Usage Trends**: Displays weekly patterns of queries and feedback over time  
**Graph 3 - KA User Feedback**: Pie chart showing distribution of feedback types

💡 **Pro Tip**: Use the filters to customize what data appears in these charts!"""
    
    elif any(word in user_input_lower for word in ["filter", "filters", "customize", "select"]):
        response = """🔍 **Using Filters Effectively**:

**Tools**: Select specific Synopsys tools to analyze
**Management Chain**: Focus on specific management hierarchies
**Date Range**: Choose Year, Month, Week, or Custom date ranges
**KA Users**: Filter by specific users

💡 **Tip**: Start with Week filter and select recent weeks for current trends!"""
    
    elif any(word in user_input_lower for word in ["download", "export", "csv", "data"]):
        response = """📥 **Download Options**:

1. **Raw Data Table**: Click "📄 Show Raw Data Table" to view the first 500 rows
2. **CSV Export**: Use "⬇ Download Filtered Data" to export your filtered data
3. **Custom Filtering**: Apply filters first, then download the specific data you need

💡 **Note**: Downloads include all columns and respect your current filter settings."""
    
    elif any(word in user_input_lower for word in ["trend", "trends", "over time", "weekly", "monthly"]):
        response = f"📈 **Usage Trends**:\n- **Graph 2** shows weekly trends with feedback percentage and total queries\n- **Current data spans**: {df_data['Date'].min().strftime('%B %Y')} to {df_data['Date'].max().strftime('%B %Y')}\n- **Feedback trend**: Currently at {feedback_pct:.1f}% overall\n\nUse date filters to analyze specific time periods and identify patterns."
    
    elif any(word in user_input_lower for word in ["synopsys", "company", "organization"]):
        response = f"🏢 **Synopsys Dashboard Overview**:\n- **Tools tracked**: {tools_count} different Synopsys EDA tools\n- **User engagement**: {total_users:,} active users\n- **Query volume**: {total_queries:,} total interactions\n- **Feedback rate**: {feedback_pct:.1f}% of interactions have feedback\n\nThis dashboard helps track tool adoption and user satisfaction across your organization."
    
    elif any(word in user_input_lower for word in ["thank", "thanks", "appreciate"]):
        response = "You're welcome! 😊 I'm here to help you get the most out of your Synopsys Executive Dashboard. Feel free to ask me anything about the data, charts, or how to use the features!"
    
    else:
        # Default response with helpful suggestions
        response = f"""I understand you're asking about: "{user_input}"

Here are some things I can help you with:

🔍 **Try asking**:
- "What are the most used tools?"
- "How is the feedback percentage?"
- "Show me user statistics"
- "Explain the charts"
- "How to use filters?"

📊 **Quick Stats**: {total_users:,} users, {total_queries:,} queries, {feedback_pct:.1f}% feedback rate

Need help? Just ask! 😊"""
    
    # Add assistant response to history
    st.session_state.chat_history.append({"role": "assistant", "content": response})
    
    return response

def show_chatbot():
    """Display intelligent chatbot interface"""
    # Show welcome message only if no conversation history
    if "chat_history" not in st.session_state or len(st.session_state.chat_history) == 0:
        with st.chat_message("assistant"):
            st.markdown("👋 **Hi! I'm your Synopsys Executive Dashboard assistant.**\n\nI can help you understand your analytics data, explain charts, and guide you through using the dashboard features. What would you like to know?")
    
    # Display conversation history
    if "chat_history" in st.session_state:
        for message in st.session_state.chat_history:
            with st.chat_message(message["role"]):
                st.markdown(message["content"])
    
    # Chat input
    if prompt := st.chat_input("Ask me about the dashboard, tools, users, or data..."):
        st.chat_message("user").write(prompt)
        
        # Get intelligent response
        response = get_chatbot_response(prompt, df)
        
        with st.chat_message("assistant"):
            st.markdown(response)

# --- MAIN DASHBOARD CONTENT ---
st.markdown("""
    <style>
    .stMultiSelect label, .stDateInput label { color: #C792F5 !important; }
    .st-expanderHeader { color: #C792F5 !important; }
    .stMultiSelect [data-baseweb="tag"] {
        background-color: #C792F5 !important; color: white !important; border: none !important;
    }
    .stMultiSelect > div { border-color: #C792F5 !important; }
    .stMultiSelect input:focus {
        border-color: #C792F5 !important;
        box-shadow: 0 0 0 0.2rem rgba(199, 146, 245, 0.25);
    }
    </style>
""", unsafe_allow_html=True)

# Load data with progress indicator
df = load_ka_data()

# Get data summary for large dataset info
data_summary = get_data_summary(df)

# Display dataset info for large files
if data_summary['total_rows'] > 10000:
    st.info(f"📊 **Large Dataset Detected**: {data_summary['total_rows']:,} rows, {data_summary['memory_usage_mb']:.1f} MB memory usage")

# Fix for serialization crash: ensure mgmt columns are all strings
mgmt_cols = [f"Mgmnt Chain {i}" for i in range(1, 12)]
for col in mgmt_cols:
    if col in df.columns:
        df[col] = df[col].astype(str)

synopsys_palette = [
    "#E0C3FC", "#C792F5", "#A96DE2", "#8A4DD0", "#6E2BC2",
    "#5023A4", "#3A3FBD", "#2267D0", "#2D95E6", "#54C4FD"
]
default_week = sorted(df["year_week_label"].dropna().unique())[-1:]
min_date = df["Date"].min()
max_date = df["Date"].max()

with st.expander("🔎 Filters", expanded=True):
    cols = st.columns(2)
    all_tools = df["tool"].dropna().unique().tolist()
    default_tools = ["vcspyglass", "vclp", "pt", "cc", "spyglass", "fc", "vcs", "Verdi", "icv", "vcformal", "dso", "psim_pro"]
    selected_tools = cols[0].multiselect("Select Tools", all_tools, default=[t for t in default_tools if t in all_tools])

    all_mgmt = sorted(set(str(val).strip() for col in mgmt_cols if col in df.columns for val in df[col].dropna().unique()))
    default_mgmt = ["Thumaty, Kalyan (THUMATY)"] if "Thumaty, Kalyan (THUMATY)" in all_mgmt else []
    selected_mgmt = cols[1].multiselect("Select Management Chain", all_mgmt, default=default_mgmt)

    date_filter_options = st.multiselect("Select Filter Granularity", ["Year", "Month", "Week", "Custom"], default=["Week"])
    selected_years, selected_months, selected_weeks, selected_range = [], [], [], []

    if "Year" in date_filter_options:
        selected_years = st.multiselect("Select Year(s)", sorted(df["iso_year"].dropna().unique()))
    if "Month" in date_filter_options:
        df["Month"] = df["Date"].dt.month
        month_labels = {i: pd.to_datetime(f"2025-{i}-01").strftime('%B') for i in range(1, 13)}
        selected_months = st.multiselect("Select Month(s)", [month_labels[i] for i in range(1, 13)])
    if "Week" in date_filter_options:
        selected_weeks = st.multiselect("Select Week(s)", sorted(df["year_week_label"].dropna().unique()), default=default_week)
    if "Custom" in date_filter_options:
        selected_range = st.date_input("Select Custom Date Range", [min_date, max_date])

    valid_users = df[df["Full Name"].notna()]
    all_users = sorted(valid_users["Username"].dropna().unique())
    selected_ka_users = st.multiselect("KA User", all_users, default=all_users)

if not selected_tools:
    st.warning("Please select at least one tool to proceed.")
    st.stop()

# ================= Filter Logic =================
filtered_df = df[df["tool"].isin(selected_tools)]
if selected_mgmt:
    mgmt_mask = pd.Series(False, index=filtered_df.index)
    for col in mgmt_cols:
        if col in filtered_df.columns:
            mgmt_mask |= filtered_df[col].isin(selected_mgmt)
    filtered_df = filtered_df[mgmt_mask]

if "Custom" in date_filter_options and len(selected_range) == 2:
    filtered_df = filtered_df[
        (filtered_df["Date"] >= pd.to_datetime(selected_range[0])) &
        (filtered_df["Date"] <= pd.to_datetime(selected_range[1]))
    ]
if "Year" in date_filter_options and selected_years:
    filtered_df = filtered_df[filtered_df["iso_year"].isin(selected_years)]
if "Month" in date_filter_options and selected_months:
    month_map = {pd.to_datetime(f"2025-{i}-01").strftime('%B'): i for i in range(1, 13)}
    filtered_df = filtered_df[filtered_df["Date"].dt.month.isin([month_map[m] for m in selected_months])]
if "Week" in date_filter_options and selected_weeks:
    filtered_df = filtered_df[filtered_df["year_week_label"].isin(selected_weeks)]

ka_df = filtered_df[filtered_df["Username"].isin(selected_ka_users)]

# ================= Metrics =================
col1, col2, col3, col4 = st.columns(4)
unique_users = filtered_df["Username"].nunique()
total_queries = len(filtered_df)
feedback = filtered_df["metadata.feedback_rating"].dropna().astype(str).str.lower()
feedback_given = feedback.isin(["like", "dislike", "comment"]).sum()
feedback_total = feedback.isin(["like", "dislike", "comment", "none"]).sum()
feedback_pct = (feedback_given / feedback_total * 100) if feedback_total > 0 else 0

col1.metric("👤 Unique Users", f"{unique_users:,}")
col2.metric("💬 Total Queries", f"{total_queries:,}")
col3.metric("✅ Feedback Count", f"{feedback_given:,}")
col4.metric("👍 Feedback %", f"{feedback_pct:.2f}%")

st.markdown("---")

# ================= Graph 1: Tool Analysis =================
# Process feedback data once
filtered_df["feedback"] = filtered_df["metadata.feedback_rating"].astype(str).str.lower()

tool_summary = filtered_df.groupby("tool").agg(
    total_queries=("Username", "count"),
    unique_users=("Username", "nunique"),
    feedback_given=("feedback", lambda x: x.isin(["like", "dislike", "comment"]).sum()),
    feedback_total=("feedback", lambda x: x.isin(["like", "dislike", "comment", "none"]).sum())
).reset_index()

tool_summary["feedback_pct"] = tool_summary.apply(
    lambda row: (row["feedback_given"] / row["feedback_total"] * 100) if row["feedback_total"] > 0 else 0, axis=1
)

fig_tool_analysis = go.Figure()
fig_tool_analysis.add_trace(go.Bar(
    x=tool_summary["tool"],
    y=tool_summary["feedback_pct"],
    name="Feedback %",
    marker_color=synopsys_palette[8],
    yaxis="y1"
))
fig_tool_analysis.add_trace(go.Scatter(
    x=tool_summary["tool"],
    y=tool_summary["total_queries"],
    mode="lines+markers",
    name="Total Queries",
    line=dict(color=synopsys_palette[3], width=3),
    yaxis="y2"
))
fig_tool_analysis.add_trace(go.Scatter(
    x=tool_summary["tool"],
    y=tool_summary["unique_users"],
    mode="lines+markers",
    name="Unique Users",
    line=dict(color=synopsys_palette[1], width=3),
    yaxis="y2"
))
fig_tool_analysis.update_layout(
    title="Tool Usage Analysis (Graph 1)",
    xaxis_title="Tool",
    yaxis=dict(title="Queries / Users", side="left"),
    yaxis2=dict(title="Feedback %", overlaying="y", side="right"),
    font=dict(size=16),
    barmode="group",
    legend=dict(orientation="v", yanchor="top", y=1, xanchor="left", x=1.05)
)

# ================= Graph 2: Weekly Trends =================
weekly_summary = filtered_df.groupby("year_week_label").agg(
    total_queries=("Username", "count"),
    feedback_given=("feedback", lambda x: x.isin(["like", "dislike", "comment"]).sum()),
    feedback_total=("feedback", lambda x: x.isin(["like", "dislike", "comment", "none"]).sum())
).reset_index()

weekly_summary["feedback_pct"] = weekly_summary.apply(
    lambda row: (row["feedback_given"] / row["feedback_total"] * 100) if row["feedback_total"] > 0 else 0, axis=1
)

fig_weekly_trends = go.Figure()
fig_weekly_trends.add_trace(go.Bar(
    x=weekly_summary["year_week_label"],
    y=weekly_summary["feedback_pct"],
    name="Feedback %",
    marker_color=synopsys_palette[-1],
    yaxis="y1"
))
fig_weekly_trends.add_trace(go.Scatter(
    x=weekly_summary["year_week_label"],
    y=weekly_summary["total_queries"],
    name="Total Queries",
    mode="lines+markers",
    line=dict(color=synopsys_palette[5], width=3),
    yaxis="y2"
))
fig_weekly_trends.update_layout(
    title="Weekly Usage Trends (Graph 2)",
    xaxis_title="Week",
    yaxis=dict(title="Total Queries", side="left"),
    yaxis2=dict(title="Feedback %", overlaying="y", side="right"),
    font=dict(size=16),
    legend=dict(orientation="v", yanchor="top", y=1, xanchor="left", x=1.05)
)

# ================= Graph 3: KA User Feedback =================
ka_feedback = ka_df["metadata.feedback_rating"].dropna().astype(str).str.lower().value_counts().reset_index()
ka_feedback.columns = ["Feedback Type", "Count"]
fig_ka_feedback = px.pie(
    ka_feedback, names="Feedback Type", values="Count",
    title="KA User Feedback Distribution (Graph 3)",
    color_discrete_sequence=synopsys_palette
)
fig_ka_feedback.update_layout(
    font=dict(size=16),
    legend=dict(orientation="v", yanchor="top", y=1, xanchor="left", x=1.05)
)

# ================= Layout =================
left_col, right_col = st.columns(2)
with left_col:
    st.plotly_chart(fig_tool_analysis, use_container_width=True)
    st.plotly_chart(fig_weekly_trends, use_container_width=True)
with right_col:
    st.plotly_chart(fig_ka_feedback, use_container_width=True)

with st.expander("📄 Show Raw Data Table"):
    if "metadata.feedback_comment" in filtered_df.columns:
        filtered_df["metadata.feedback_comment"] = filtered_df["metadata.feedback_comment"].astype(str)
    
    # Show data info
    st.write(f"**Showing {len(filtered_df):,} filtered rows** (from {data_summary['total_rows']:,} total rows)")
    
    # Pagination for large datasets
    if len(filtered_df) > 1000:
        st.warning("⚠️ Large dataset detected. Showing first 1,000 rows for performance.")
        display_df = filtered_df.head(1000)
        
        # Add option to show more
        if st.button("🔄 Load More Rows (Next 1,000)"):
            if "show_more_rows" not in st.session_state:
                st.session_state.show_more_rows = 1000
            st.session_state.show_more_rows += 1000
            
        if "show_more_rows" in st.session_state:
            display_df = filtered_df.head(st.session_state.show_more_rows)
            st.write(f"Showing {st.session_state.show_more_rows:,} rows")
    else:
        display_df = filtered_df
    
    # Display dataframe with optimized settings
    st.dataframe(
        display_df, 
        use_container_width=True,
        hide_index=True,
        column_config={
            "Date": st.column_config.DateColumn("Date"),
            "Username": st.column_config.TextColumn("Username", width="medium"),
            "tool": st.column_config.TextColumn("Tool", width="small"),
        }
    )

with st.expander("⬇ Download Filtered Data"):
    if "metadata.feedback_comment" in filtered_df.columns:
        filtered_df["metadata.feedback_comment"] = filtered_df["metadata.feedback_comment"].astype(str)
    csv = filtered_df.to_csv(index=False).encode("utf-8")
    st.download_button("Download CSV", csv, "filtered_data.csv", "text/csv")

st.caption("Synopsys Executive Dashboard • Powered by Streamlit & Plotly")

# --- CHATBOT ICON ---
# Simple floating chatbot button
col1, col2, col3 = st.columns([1, 1, 1])
with col3:
    if st.button("💬", key="chatbot_toggle", help="Open Chatbot", 
                 use_container_width=False, type="secondary"):
        st.session_state.show_chatbot = not st.session_state.get('show_chatbot', False)

# Show chatbot if toggled
if st.session_state.get('show_chatbot', False):
    with st.container():
        st.markdown("---")
        st.markdown("### 💬 Chatbot Assistant")
        show_chatbot()
        st.caption("Smart dashboard assistant in progress.")