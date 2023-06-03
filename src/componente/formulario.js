import { useState, useEffect } from 'react';
import XLSX from 'xlsx';
import "./App.css";

function App() {
  const [jsonData, setJsonData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [filterField, setFilterField] = useState('');
  const [filterOperator, setFilterOperator] = useState('');
  const [filterValue, setFilterValue] = useState('');
/*   const [query, setQuery] = useState(''); */
  const [resultCount, setResultCount] = useState(0);
  const [filterHistory, setFilterHistory] = useState([]);
  const [mostrarCarrito, setMostrarCarrito] = useState(false);

  useEffect(() => {
    fetchData();
    const storedFilterHistory = localStorage.getItem('filterHistory');
    if (storedFilterHistory) {
      setFilterHistory(JSON.parse(storedFilterHistory));
    }
  }, []);

  useEffect(() => {
    filterData();
    localStorage.setItem('filterHistory', JSON.stringify(filterHistory));
  }, [filterHistory]);

  const fetchData = async () => {
    try {
      const response = await fetch('cartera.xlsx', { responseType: 'arraybuffer' });
      const buffer = await response.arrayBuffer();
      const workbook = XLSX.read(buffer, { type: 'array' });
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const data = XLSX.utils.sheet_to_json(worksheet);
      setJsonData(data);
      setFilteredData(data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const filterData = () => {
    if (filterHistory.length === 0) {
      setFilteredData(jsonData);
      setResultCount(jsonData.length);
      /* setQuery(''); */
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

    setFilteredData(filtered);
    setResultCount(filtered.length);

   /*  const query = `${filterField} ${filterOperator} ${filterValue}`;
    setQuery(query); */
  };

  const handleFieldChange = (e) => {
    setFilterField(e.target.value);
  };

  const handleOperatorChange = (e) => {
    setFilterOperator(e.target.value);
  };

  const handleValueChange = (e) => {
    setFilterValue(e.target.value);
  };

  const handleFilterClick = () => {
    if (filterField && filterOperator && filterValue) {
      const newFilter = {
        filterField,
        filterOperator,
        filterValue,
      };

      setFilterHistory((prevHistory) => [...prevHistory, newFilter]);
    }
  };

  const handleFilterHistoryClick = (index) => {
    const updatedHistory = filterHistory.slice(0, index + 1);
    setFilterHistory(updatedHistory);
  };

  return (
    <>
      <h1>Archivo XLSX</h1>
      <div className='bodycard'>
        <div className="cdnbody">
          <div className='cdn'>
            <label htmlFor="filterField">Campo:</label>
            <select name="filterField" id="filterField" value={filterField} onChange={handleFieldChange}>
              <option value="">Seleccione un campo</option>
              {/* Agrega opciones para cada campo de la tabla */}
              <option value="nombre">Nombre</option>
              <option value="tipo_doc">Documento</option>
              <option value="comuna">Comuna</option>
              <option value="monto">Monto</option>
              {/* ..pueden agregar mas opciones si. */}
            </select>
          </div>
          <div className='cdn'>
            <label htmlFor="filterOperator">Operador:</label>
            <select name="filterOperator" id="filterOperator" value={filterOperator} onChange={handleOperatorChange}>
              <option value="">Seleccione un operador</option>
              <option value="=">Igual</option>
              <option value=">">Mayor que</option>
              <option value="<">Menor que</option>
              <option value=">=">Mayor igual a</option>
              <option value="<=">Menor igual a</option>
              {/* Agrega más operadores según las opciones que desees */}
            </select>
          </div>
          <div className='cdn'>
            <label htmlFor="filterValue">Valor:</label>
            <input type="text" id="filterValue" value={filterValue} onChange={handleValueChange} />
          </div>
        </div>
        <div>
        </div>
      </div>
      <div className='btnpadre'>
        <div className='btn'>
          <button onClick={handleFilterClick}>Filtrar</button>
        </div>
        <div className='btnhistory'>
          <div className="navbar-cart">
            <button onClick={() => setMostrarCarrito(true)}>
              Historial ({filterHistory.length})
            </button>
          </div>
          {mostrarCarrito && (
            <div className="carrito-modal-overlay">
              <div className="carrito-modal">
                <div className="carrito-modal-header">
                  <h2>Historial de filtraciones</h2>
                  <button
                    className="cerrar"
                    onClick={() => setMostrarCarrito(false)}
                  >
                    X
                  </button>
                </div>
                <hr className="line" />
                <div className="carrito-modal-body">
                  <div className="producto">
                    <div>
                      {filterHistory.map((filter, index) => (
                        <div key={index}>
                          <div className='bodyp' >
                            <p>{filter.filterField} {filter.filterOperator} {filter.filterValue}</p>
                            <button onClick={() => handleFilterHistoryClick(index)}>Volver a filtrar</button>
                          </div>
                          <hr className="line" />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      <div>Resultados: {resultCount}</div>
      {filterHistory.length > 0 && filteredData.length > 0 ? (
        <table>
          <thead>
            <tr>
              {/* Crea las columnas de la tabla según los campos de la tabla */}
              {Object.keys(filteredData[0]).map((header, index) => (
                <th key={index}>{header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredData.map((row, index) => (
              <tr key={index}>
                {/* Muestra los valores de cada celda en la fila */}
                {Object.values(row).map((cell, index) => (
                  <td key={index}>{cell}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div>No se encontraron resultados.</div>
      )}
    </>
  );
}

export default App;
