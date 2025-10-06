# summary_page.py — Show Excel layout in AgGrid (interactive)
import streamlit as st
from utils.navigation import show_navigation
from utils.data_loader import get_data
from st_aggrid import AgGrid, GridOptionsBuilder
import base64
import os

def run():
    st.set_page_config(page_title="Summary | Executive Dashboard", layout="wide")
    st.markdown("<style>footer {visibility: hidden;}</style>", unsafe_allow_html=True)

    st.title("📊 Summary Page")
    show_navigation()

    try:
        df_summary = get_data("summary")

        with st.expander("🔍 Interactive Pivot Sheet (Excel-like)", expanded=True):
            gb = GridOptionsBuilder.from_dataframe(df_summary)
            gb.configure_pagination(enabled=True)
            gb.configure_default_column(
                resizable=True,
                filter=True,
                sortable=True,
                wrapText=True,
                autoHeight=True
            )
            gb.configure_side_bar()
            grid_options = gb.build()

            AgGrid(
                df_summary,
                gridOptions=grid_options,
                theme="alpine",  # Use "material" or "balham-dark" for other looks
                height=600,
                fit_columns_on_grid_load=True,
                allow_unsafe_jscode=True,
                enable_enterprise_modules=False,
            )

        with st.expander("⬇ Download Original Excel"):
            file_path = "data/CSG - KA Usage (July 20).xlsx"
            if os.path.exists(file_path):
                with open(file_path, "rb") as f:
                    data = f.read()
                    b64 = base64.b64encode(data).decode()
                    href = f'''
                        <a href="data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,{b64}"
                           download="CSG - KA Usage (July 20).xlsx">
                           📥 Click to download the Excel file
                        </a>
                    '''
                    st.markdown(href, unsafe_allow_html=True)
            else:
                st.error("❌ Excel file not found at expected path.")
    except Exception as e:
        st.error(f"Error loading summary data: {e}")

    st.caption("Displays your uploaded Excel sheet interactively with pivot-like structure.")