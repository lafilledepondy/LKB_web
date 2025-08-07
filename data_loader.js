// Data loader for CSV-based academic network
var DIR = "img/";
var nodes = [];
var edges = [];

// Load data from CSV files
async function loadDataFromCSV(peopleFile) {
    try {
        // Load people data
        const peopleData = await loadCSV(peopleFile);
        // Load relationships data
        const relationshipsData = await loadCSV('./data/relationships.csv');
        
        processCSVData(peopleData, relationshipsData);
        return { nodes: nodes, edges: edges };
    } catch (error) {
        console.error('Error loading CSV data:', error);
        throw error;
    }
}

// Helper function to load a single CSV file
function loadCSV(csvFile) {
    return new Promise((resolve, reject) => {
        console.log('Attempting to load CSV file:', csvFile);
        Papa.parse(csvFile, {
            download: true,
            header: true,
            complete: function(results) {
                console.log('CSV parsing completed for', csvFile, '- Rows:', results.data.length);
                if (results.errors && results.errors.length > 0) {
                    console.warn('CSV parsing warnings for', csvFile, ':', results.errors);
                }
                resolve(results.data);
            },
            error: function(error) {
                console.error('CSV parsing error for', csvFile, ':', error);
                reject(error);
            }
        });
    });
}

// Process CSV data into nodes and edges
function processCSVData(peopleData, relationshipsData) {
    // Clear existing data
    nodes = [];
    edges = [];
    
    // Create nodes from people data
    peopleData.forEach(person => {
        if (person.ID && person.Name) {
            nodes.push({
                id: parseInt(person.ID),
                label: person.Name,
                group: person.Department || person.Type || 'notgrouped',
                shape: "dot",
                value: parseInt(person.Experience_Years) || 5,
                title: person.Bio || person.Name, // Tooltip
                image: person.Image_Filename ? DIR + person.Image_Filename : undefined
            });
        }
    });
    
    // Create edges from relationships data
    relationshipsData.forEach(rel => {
        if (rel.From_ID && rel.To_ID) {
            edges.push({
                from: parseInt(rel.From_ID),
                to: parseInt(rel.To_ID),
                label: rel.Relationship_Type || '',
                color: rel.Color || '#cccccc',
                title: rel.Notes || rel.Relationship_Type // Tooltip
            });
        }
    });
}