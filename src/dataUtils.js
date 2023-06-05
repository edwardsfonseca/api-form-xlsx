import XLSX from 'xlsx';
// Consumimos el archivo
export const fetchData = async () => {
    try {
        const response = await fetch('cartera.xlsx');
        const buffer = await response.arrayBuffer();
        const workbook = XLSX.read(buffer, { type: 'array' });
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const data = XLSX.utils.sheet_to_json(worksheet);
        return data;
    } catch (error) {
        console.error('Error fetching data:', error);
        return [];
    }
};
// Una vez consumido aplicamos condicones para utilizar esos datos 
export const filterData = (jsonData, filterHistory) => {
    if (filterHistory.length === 0) {

        return jsonData;
    }
    const lastFilter = filterHistory[filterHistory.length - 1];
    const { filterField, filterOperator, filterValue } = lastFilter;
    const filtered = jsonData.filter((data) => {
        const cellValue = String(data[filterField]);
        const filterNumericValue = parseFloat(filterValue);
        switch (filterOperator) {
            case '=':
                return cellValue === filterValue;
            case '>':
                return parseFloat(cellValue) > filterNumericValue;
            case '<':
                return parseFloat(cellValue) < filterNumericValue;
            case '<=':
                return parseFloat(cellValue) <= filterNumericValue;
            case '>=':
                return parseFloat(cellValue) >= filterNumericValue;
            default:
                return false;
        }
    });

    return filtered;
};
// actulizamos los valores con el evento cada vez que hacemos click llamamos al target value de cada option 
export const handleFieldChange = (e, setFilterField) => {
    setFilterField(e.target.value);
};
// actulizamos los valores con el evento cada vez que hacemos click llamamos al target value de cada option 
export const handleOperatorChange = (e, setFilterOperator) => {
    setFilterOperator(e.target.value);
};
// actulizamos los valores con el evento cada vez que hacemos click llamamos al target value de cada option 
export const handleValueChange = (e, setFilterValue) => {
    setFilterValue(e.target.value);
};
// filtramos la informacion seleccionada
export const handleFilterClick = (
    filterField,
    filterOperator,
    filterValue,
    filterHistory,
    setFilterHistory
) => {
    if (filterField && filterOperator && filterValue) {
        const newFilter = {
            filterField,
            filterOperator,
            filterValue,
        };

        setFilterHistory((prevFilterHistory) => {
            const updatedHistory = [...prevFilterHistory, newFilter];
            return updatedHistory;
        });
    }
};

// guardamos informacion en la historia de todos los filtros 
export const handleFilterHistoryClick = (index, filterHistory, setFilterHistory) => {
    const updatedHistory = filterHistory.slice(0, index);
    setFilterHistory(updatedHistory);
};
