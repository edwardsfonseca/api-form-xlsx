import XLSX from 'xlsx';

export const fetchData = async () => {
    try {
        const response = await fetch('cartera.xlsx', { responseType: 'arraybuffer' });
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

export const filterData = (jsonData, filterHistory) => {
    if (filterHistory.length === 0) {
        return jsonData;
    }

    const lastFilter = filterHistory[filterHistory.length - 1];
    const { filterField, filterOperator, filterValue } = lastFilter;

    const filtered = jsonData.filter((row) => {
        const cellValue = String(row[filterField]);
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

export const handleFieldChange = (e, setFilterField) => {
    setFilterField(e.target.value);
};

export const handleOperatorChange = (e, setFilterOperator) => {
    setFilterOperator(e.target.value);
};

export const handleValueChange = (e, setFilterValue) => {
    setFilterValue(e.target.value);
};

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

        setFilterHistory((prevHistory) => [...prevHistory, newFilter]);
    }
};

export const handleFilterHistoryClick = (index, filterHistory, setFilterHistory) => {
    const updatedHistory = filterHistory.slice(0, index + 1);
    setFilterHistory(updatedHistory);
};
