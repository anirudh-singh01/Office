# Synopsys Executive Dashboard

A powerful Streamlit dashboard for analyzing Synopsys EDA tool usage, user feedback, and performance metrics.

## 🚀 Quick Start

### Prerequisites
- Python 3.8 or higher
- pip (Python package installer)

### Installation

1. **Clone or download this project**
2. **Navigate to the project directory**
   ```bash
   cd "streamlit dashboard"
   ```

3. **Install required packages**
   ```bash
   pip install -r requirements.txt
   ```

### Configuration

1. **Update Excel file path** in `utils/data_loader.py` (line 18):
   ```python
   r"YOUR_EXCEL_FILE_PATH_HERE"
   ```

2. **Ensure your Excel file has a sheet named "KA_Data"** (or update sheet name in line 19)

### Running the Application

```bash
streamlit run main.py
```

The dashboard will open in your default web browser at `http://localhost:8501`

## 📊 Features

- **Interactive Analytics**: Tool usage analysis, user statistics, and feedback trends
- **Large Dataset Support**: Optimized for datasets with 80k+ rows
- **Smart Filtering**: Filter by tools, management chain, date ranges, and users
- **AI Chatbot**: Intelligent assistant for dashboard guidance
- **Data Export**: Download filtered data as CSV
- **Real-time Charts**: Interactive Plotly visualizations

## 📁 Project Structure

```
streamlit dashboard/
├── main.py                 # Main dashboard application
├── requirements.txt        # Python dependencies
├── README.md              # This file
└── utils/
    └── data_loader.py      # Data loading utilities
```

## 🔧 Requirements

- streamlit>=1.28.0
- pandas>=1.5.0
- plotly>=5.15.0
- openpyxl>=3.1.0
- pyarrow>=10.0.0

## 💡 Usage Tips

- Use filters to focus on specific data subsets
- Click the 💬 chatbot button for help and insights
- Download filtered data using the export feature
- Large datasets are automatically optimized for performance

## 🆘 Troubleshooting

- **Excel file not found**: Check the file path in `utils/data_loader.py`
- **Sheet not found**: Verify your Excel file has a "KA_Data" sheet
- **Slow loading**: Large datasets may take 10-30 seconds to load initially
- **Memory issues**: The app automatically optimizes memory usage for large files

---
