# main.py — Synopsys Executive Dashboard
import streamlit as st
import pandas as pd
import plotly.express as px
import plotly.graph_objects as go
from utils.data_loader import load_ka_data, get_data_summary
from utils.chatbot import render_chatbot

# Set global config
st.set_page_config(page_title="Synopsys Executive Dashboard", layout="wide")
st.markdown("<style>footer {visibility: hidden;}</style>", unsafe_allow_html=True)

## Chatbot functions moved to utils/chatbot.py

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

# (Removed informational banner about large datasets)

# Fix for serialization crash and schema variance: detect mgmt chain columns dynamically
mgmt_cols = [
    col for col in df.columns
    if col.lower().startswith("mgmt chain") or col.lower().startswith("mgmnt chain")
]
# Optionally include direct manager as part of hierarchy if present
if "Direct Manager" in df.columns and "Direct Manager" not in mgmt_cols:
    mgmt_cols.append("Direct Manager")
for col in mgmt_cols:
    df[col] = df[col].astype(str)

synopsys_palette = [
    "#E0C3FC", "#C792F5", "#A96DE2", "#8A4DD0", "#6E2BC2",
    "#5023A4", "#3A3FBD", "#2267D0", "#2D95E6", "#54C4FD"
]
# Ensure iso_year exists for Year filtering
if "iso_year" not in df.columns and "Date" in df.columns:
    try:
        df["iso_year"] = df["Date"].dt.isocalendar().year
    except Exception:
        pass

default_weeks = sorted(df["year_week_label"].dropna().unique())[-10:]
min_date = df["Date"].min()
max_date = df["Date"].max()

with st.expander("🔎 Filters", expanded=True):
    # Move KA User filter to the top
    valid_users = df[df["Full Name"].notna()]
    all_users = sorted(valid_users["Username"].dropna().unique())
    selected_ka_users = st.multiselect("KA User", all_users, default=[])

    cols = st.columns(2)
    all_tools = df["tool"].dropna().unique().tolist()
    default_tools = ["vcspyglass", "vclp", "pt", "cc", "spyglass", "fc", "vcs", "Verdi", "icv", "vcformal", "dso", "psim_pro"]

    # Auto-select tools based on KA User selection
    if "tools_ms" not in st.session_state:
        st.session_state["tools_ms"] = [t for t in default_tools if t in all_tools]
    prev_ka = st.session_state.get("prev_ka_users", [])
    if set(prev_ka) != set(selected_ka_users):
        if selected_ka_users:
            user_tools = sorted(df[df["Username"].isin(selected_ka_users)]["tool"].dropna().unique().tolist())
            st.session_state["tools_ms"] = user_tools or st.session_state["tools_ms"]
        else:
            # If KA selection cleared, revert to default list
            st.session_state["tools_ms"] = [t for t in default_tools if t in all_tools]
    st.session_state["prev_ka_users"] = selected_ka_users

    selected_tools = cols[0].multiselect(
        "Select Tools",
        all_tools,
        default=st.session_state["tools_ms"],
        key="tools_ms",
    )

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
        selected_weeks = st.multiselect("Select Week(s)", sorted(df["year_week_label"].dropna().unique()), default=default_weeks)
    if "Custom" in date_filter_options:
        selected_range = st.date_input("Select Custom Date Range", [min_date, max_date])

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

selected_or_all_users = selected_ka_users or all_users
ka_df = filtered_df[filtered_df["Username"].isin(selected_or_all_users)]

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

## (Graph 2 removed per request)

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
with right_col:
    st.plotly_chart(fig_ka_feedback, use_container_width=True)



with st.expander("⬇ Download Filtered Data"):
    if "metadata.feedback_comment" in filtered_df.columns:
        filtered_df["metadata.feedback_comment"] = filtered_df["metadata.feedback_comment"].astype(str)
    csv = filtered_df.to_csv(index=False).encode("utf-8")
    st.download_button("Download CSV", csv, "filtered_data.csv", "text/csv")

# --- CHATBOT: Floating FAB + Dialog ---

# Floating button HTML/CSS (bottom-right)
st.markdown(
    """
    <style>
    .chat-fab { position: fixed; bottom: 20px; right: 20px; z-index: 1000; }
    .chat-fab button { 
        background-color: #6E2BC2; color: white; border: none; border-radius: 50%;
        width: 60px; height: 60px; font-size: 26px; box-shadow: 0 6px 14px rgba(0,0,0,0.25);
        cursor: pointer; transition: transform 0.15s ease-in-out; 
    }
    .chat-fab button:hover { background-color: #5023A4; transform: scale(1.06); }
    </style>
    <div class="chat-fab">
      <button onclick="(function(){
        const url = new URL(window.location);
        const isOpen = url.searchParams.get('chat') === '1';
        if (isOpen) { url.searchParams.delete('chat'); } else { url.searchParams.set('chat','1'); }
        window.location.href = url.toString();
      })()" title="Chat with assistant">💬</button>
    </div>
    """,
    unsafe_allow_html=True,
)

# Dialog to host the chatbot when query param chat=1
try:
    dialog_open = st.query_params.get("chat") == "1"
except Exception:
    dialog_open = False

if dialog_open:
    if hasattr(st, "dialog"):
        @st.dialog("💬 Chatbot Assistant")
        def chatbot_dialog():
            render_chatbot(df)
        chatbot_dialog()
    else:
        # Fallback: lightweight anchored panel at the bottom of the page
        with st.container():
            st.markdown("""
            <style>
            .chat-fallback {position: fixed; bottom: 90px; right: 20px; width: 360px; z-index: 1001;}
            .chat-fallback .box {background: #ffffff; border: 1px solid #DDD; border-radius: 10px; box-shadow: 0 6px 14px rgba(0,0,0,0.15); padding: 10px;}
            </style>
            <div class="chat-fallback"><div class="box"></div></div>
            """, unsafe_allow_html=True)
            # Render chatbot content (will appear in document flow but visually near the floating box)
            st.markdown("### 💬 Chatbot Assistant")
            render_chatbot(df)