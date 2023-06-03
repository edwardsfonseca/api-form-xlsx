import XLSX from 'xlsx';
const getState = ({ getStore, getActions, setStore }) => {
    return {
        store: {
            
            jsonData: [],
            filteredData: [],
            filterField: '',
            filterOperator: '',
            filterValue: '',
            resultCount: 0,
            filterHistory: [],
            mostrarCarrito: false
        },
        actions: {
            getFetchData: async () => {
                try {
                    const response = await fetch('cartera.xlsx', { responseType: 'arraybuffer' });
                    const buffer = await response.arrayBuffer();
                    const workbook = XLSX.read(buffer, { type: 'array' });
                    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
                    const data = XLSX.utils.sheet_to_json(worksheet);
                    setStore(prevStore => ({
                        ...prevStore,
                        jsonData: data,
                        filteredData: data
                    }));
                } catch (error) {
                    console.error('Error fetching data:', error);
                }
            },
            filterData: () => {
                const { jsonData, filterHistory } = getStore();
                if (filterHistory.length === 0) {
                    setStore(prevStore => ({
                        ...prevStore,
                        filteredData: jsonData,
                        resultCount: jsonData.length
                    }));
                    return;
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

                setStore(prevStore => ({
                    ...prevStore,
                    filteredData: filtered,
                    resultCount: filtered.length
                }));
            },
            handleFieldChange: (e) => {
                const { value } = e.target;
                setStore(prevStore => ({
                    ...prevStore,
                    filterField: value
                }));
            },
            handleOperatorChange: (e) => {
                const { value } = e.target;
                setStore(prevStore => ({
                    ...prevStore,
                    filterOperator: value
                }));
            },
            handleValueChange: (e) => {
                const { value } = e.target;
                setStore(prevStore => ({
                    ...prevStore,
                    filterValue: value
                }));
            },
            handleFilterClick: () => {
                const { filterField, filterOperator, filterValue } = getStore();
                if (filterField && filterOperator && filterValue) {
                    const newFilter = {
                        filterField,
                        filterOperator,
                        filterValue
                    };

                    setStore(prevStore => ({
                        ...prevStore,
                        filterHistory: [...prevStore.filterHistory, newFilter]
                    }));
                }
            },
            handleFilterHistoryClick: (index) => {
                const { filterHistory } = getStore();
                const updatedHistory = filterHistory.slice(0, index + 1);
                setStore(prevStore => ({
                    ...prevStore,
                    filterHistory: updatedHistory
                }));
            },
            toggleCarrito: () => {
                setStore(prevStore => ({
                    ...prevStore,
                    mostrarCarrito: !prevStore.mostrarCarrito
                }));
            }
        }
    };
};

export default getState;
