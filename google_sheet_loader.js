// Google Sheets integration for academic network
var DIR = "img/";

// Google Sheets CSV export URL format:
// https://docs.google.com/spreadsheets/d/SHEET_ID/export?format=csv&gid=0

const GOOGLE_SHEETS_CSV_URL = 'YOUR_GOOGLE_SHEETS_CSV_EXPORT_URL_HERE';

// Load data from Google Sheets
async function loadGoogleSheetsData() {
    try {
        const response = await fetch(GOOGLE_SHEETS_CSV_URL);
        const csvText = await response.text();
        
        return new Promise((resolve) => {
            Papa.parse(csvText, {
                header: true,
                complete: function(results) {
                    const processedData = processCSVData(results.data);
                    resolve(processedData);
                }
            });
        });
    } catch (error) {
        console.error('Error loading Google Sheets data:', error);
        return { nodes: [], edges: [] };
    }
}

// Process the data (same as before but with better error handling)
function processCSVData(data) {
    const nodes = [];
    const edges = [];
    const nodeMap = new Map();
    
    // Filter out empty rows
    const validData = data.filter(row => row.ID && row.Name);
    
    // Create nodes
    validData.forEach(row => {
        if (!nodeMap.has(row.ID)) {
            nodes.push({
                id: row.ID,
                label: row.Name,
                group: row.Department || row.Type,
                shape: "circularImage",
                value: parseInt(row['Experience/Year']) || 4,
                image: DIR + (row.Image || "default.jpg"),
                title: `${row.Name} - ${row.Type} - ${row.Department}` // Tooltip
            });
            nodeMap.set(row.ID, true);
        }
    });
    
    // Create edges
    validData.forEach(row => {
        if (row.Relationship_To && row.Relationship_Type) {
            edges.push({
                from: row.ID,
                to: row.Relationship_To,
                label: row.Relationship_Type,
                color: row.Color || "#cccccc"
            });
        }
    });
    
    return { nodes, edges };
}

// Auto-refresh data every 5 minutes (optional)
function setupAutoRefresh(callback) {
    setInterval(async () => {
        const newData = await loadGoogleSheetsData();
        callback(newData);
    }, 5 * 60 * 1000); // 5 minutes
}
