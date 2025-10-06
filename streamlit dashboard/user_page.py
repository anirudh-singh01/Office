import streamlit as st
import pandas as pd
import plotly.express as px
import plotly.io as pio
from fpdf import FPDF
import os
from utils.navigation import show_navigation
from utils.data_loader import get_data

def export_charts_to_pdf(fig1, fig2, filename="user_feedback_report.pdf"):
    fig1_path = "feedback_chart.png"
    fig2_path = "no_feedback_chart.png"

    # Save plots to image
    pio.write_image(fig1, fig1_path, format="png", scale=2)
    pio.write_image(fig2, fig2_path, format="png", scale=2)

    # Create PDF
    pdf = FPDF()
    pdf.add_page()
    pdf.set_font("Arial", "B", 16)
    pdf.cell(0, 10, "User Feedback Summary Report", ln=True)
    pdf.image(fig1_path, x=10, y=30, w=180)
    pdf.add_page()
    pdf.image(fig2_path, x=10, y=30, w=180)
    pdf.output(filename)

    os.remove(fig1_path)
    os.remove(fig2_path)
    return filename

def run():
    st.title("👤 User Feedback Overview")
    show_navigation()
    st.markdown("<style>footer {visibility: hidden;}</style>", unsafe_allow_html=True)

    # Custom UI styling
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

    df = get_data("ka_data")

    # Fix for serialization crash: ensure mgmt columns are all strings
    mgmt_cols = [f"Mgmnt Chain {i}" for i in range(1, 12)]
    for col in mgmt_cols:
        if col in df.columns:
            df[col] = df[col].astype(str)

    synopsys_palette = [
        "#6E2BC2", "#8A4DD0", "#A96DE2", "#C792F5", "#3A3FBD",
        "#2267D0", "#2D95E6", "#54C4FD", "#054A91", "#1B98E0"
    ]

    default_week = sorted(df["year_week_label"].dropna().unique())[-1:]
    min_date, max_date = df["Date"].min(), df["Date"].max()

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
        return

    # Filter data
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

    # ========================
    # KPI METRICS
    # ========================
    col1, col2, col3, col4 = st.columns(4)
    unique_users = filtered_df["Username"].nunique()
    total_queries = len(filtered_df)
    feedback = filtered_df["metadata.feedback_rating"].dropna().astype(str).str.lower()
    feedback_given = feedback.isin(["like", "dislike", "comment"]).sum()
    total_feedback = feedback.isin(["like", "dislike", "comment", "none"]).sum()
    feedback_pct = (feedback_given / total_feedback * 100) if total_feedback > 0 else 0

    col1.metric("👤 Unique Users", f"{unique_users:,}")
    col2.metric("💬 Total Queries", f"{total_queries:,}")
    col3.metric("✅ Feedback Count", f"{feedback_given:,}")
    col4.metric("👍 Feedback %", f"{feedback_pct:.2f}%")

    st.markdown("---")

    # ========================
    # CHART 1: Feedback Distribution by Tool
    # ========================
    feedback_df = ka_df[ka_df["metadata.feedback_rating"].isin(["like", "dislike", "comment", "none"])]
    chart1 = feedback_df.groupby(["tool", "metadata.feedback_rating"]).size().reset_index(name="Count")

    fig_feedback_dist = px.bar(
        chart1, x="tool", y="Count", color="metadata.feedback_rating",
        title="Feedback Distribution by Tool", barmode="group", text_auto=True,
        color_discrete_sequence=synopsys_palette
    )
    fig_feedback_dist.update_traces(textfont=dict(color='black', size=12))
    fig_feedback_dist.update_layout(
        legend=dict(orientation="v", y=0.5, yanchor="middle", x=1.02, xanchor="left"),
        margin=dict(r=150),
        title_font_size=16
    )

    st.plotly_chart(fig_feedback_dist, use_container_width=True)

    # ========================
    # CHART 2: Top N Users Without Feedback (Sorted, Clear Color)
    # ========================
    with st.container():
        col_filter, col_chart = st.columns([1, 4])

        with col_filter:
            top_n_option = st.selectbox(
                "Show Top N Users Without Feedback:",
                ["All", 10, 15, 20],
                index=1
            )

        no_feedback_users = ka_df[~ka_df["metadata.feedback_rating"].isin(["like", "dislike", "comment"])]
        user_feedback_counts = no_feedback_users.groupby("Username").size().reset_index(name="No Feedback Count")
        user_feedback_counts = user_feedback_counts.sort_values(by="No Feedback Count", ascending=False)

        if top_n_option != "All":
            user_feedback_counts = user_feedback_counts.head(int(top_n_option))

        fig_no_feedback = px.bar(
            user_feedback_counts,
            x="No Feedback Count",
            y="Username",
            orientation='h',
            title=f"Users Using Tools Without Feedback ({'All' if top_n_option == 'All' else 'Top ' + str(top_n_option)})",
            color_discrete_sequence=["#6E2BC2"]
        )
        fig_no_feedback.update_traces(
            text=user_feedback_counts["No Feedback Count"],
            textposition='outside',
            marker_line_color='black',
            marker_line_width=0.5
        )
        fig_no_feedback.update_layout(
            margin=dict(r=150),
            title_font_size=16,
            yaxis=dict(autorange="reversed"),
            showlegend=False
        )

        col_chart.plotly_chart(fig_no_feedback, use_container_width=True)

    # ========================
    # RAW DATA + DOWNLOAD
    # ========================
    with st.expander("📄 Show Raw Data Table"):
        st.dataframe(filtered_df.head(500), use_container_width=True)

    with st.expander("⬇ Download Filtered Data"):
        csv = filtered_df.to_csv(index=False).encode("utf-8")
        st.download_button("Download CSV", csv, "filtered_data.csv", "text/csv")

    st.caption("This is a simplified user-focused view with full filters and KPIs.")