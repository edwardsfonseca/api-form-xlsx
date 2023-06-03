import { useState, useEffect } from 'react';

import "./App.css";
import {
  fetchData,
  filterData,
  handleFieldChange,
  handleOperatorChange,
  handleValueChange,
  handleFilterClick,
  handleFilterHistoryClick
} from './dataUtils';

function App() {
  const [jsonData, setJsonData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [filterField, setFilterField] = useState('');
  const [filterOperator, setFilterOperator] = useState('');
  const [filterValue, setFilterValue] = useState('');
  const [resultCount, setResultCount] = useState(0);
  const [filterHistory, setFilterHistory] = useState([]);
  const [mostrar, setMostrar] = useState(false);

  useEffect(() => {
    const fetchDataAndInitialize = async () => {
      const data = await fetchData();
      setJsonData(data);
      setFilteredData(data);
    };

    fetchDataAndInitialize();

    const storedFilterHistory = localStorage.getItem('filterHistory');
    if (storedFilterHistory) {
      setFilterHistory(JSON.parse(storedFilterHistory));
    }
  }, []);

  useEffect(() => {
    filterDataAndSetResults();
    localStorage.setItem('filterHistory', JSON.stringify(filterHistory));
  }, [filterHistory]);

  const filterDataAndSetResults = () => {
    const filtered = filterData(jsonData, filterHistory);
    setFilteredData(filtered);
    setResultCount(filtered.length);
  };

  const handleFilterClickAndAddToHistory = () => {
    alert('agregado')
    handleFilterClick(filterField, filterOperator, filterValue, filterHistory, setFilterHistory);
  };
  const clearFilter = () => {
    setFilterField('');
    setFilterOperator('');
    setFilterValue('');
    setFilteredData(jsonData);
    setResultCount(jsonData.length);
    setFilterHistory([]);
  };
  

  return (
    <>
    <figure className='allbody'>
    <h1>Archivo XLSX</h1>
      <div className='bodycard'>
        <div className="cdnbody">
          <div className='cdn'>
            <label htmlFor="filterField">Campo:</label>
            <select name="filterField" id="filterField" value={filterField} onChange={(e) => handleFieldChange(e, setFilterField)}>
              <option className='optn' value="">Seleccione un campo</option>
              {/* Agrega opciones para cada campo de la tabla */}
              <option className='optn' value="nombre">Nombre</option>
              <option className='optn' value="tipo_doc">Documento</option>
              <option className='optn' value="comuna">Comuna</option>
              <option className='optn' value="monto">Monto</option>
              {/* ..pueden agregar mas opciones si. */}
            </select>
          </div>
          <div className='cdn'>
            <label htmlFor="filterOperator">Operador:</label>
            <select name="filterOperator" id="filterOperator" value={filterOperator} onChange={(e) => handleOperatorChange(e, setFilterOperator)}>
              <option className='optn' value="">Seleccione un operador</option>
              <option className='optn' value="=">Igual</option>
              <option className='optn' value=">">Mayor que</option>
              <option className='optn' value="<">Menor que</option>
              <option className='optn' value=">=">Mayor igual a</option>
              <option className='optn' value="<=">Menor igual a</option>
              {/* Agrega más operadores según las opciones que desees */}
            </select>
          </div>
          <div className='cdn'>
            <label htmlFor="filterValue">Valor:</label>
            <input type="text" id="filterValue" value={filterValue} onChange={(e) => handleValueChange(e, setFilterValue)} />
          </div>
        </div>
      </div>
      <div className='btnpadre'>
        <div className='btn'>
          <button onClick={handleFilterClickAndAddToHistory}>Filtrar</button>
        </div>
        <div className='btn-borrar'>
        <button onClick={clearFilter}>Borrar Filtro</button>
        </div>
        
        <div className='btnhistory'>
          <div className="navbar-cart">
            <button onClick={() => setMostrar(true)}>
              Historial ({filterHistory.length})
            </button>
          </div>
          {mostrar && (
            <div className="modal-overlay">
              <div className="modal">
                <div className="modal-header">
                  <h2>Historial de filtraciones</h2>
                  <button
                    className="cerrar"
                    onClick={() => setMostrar(false)}
                  >
                    X
                  </button>
                </div>
                <hr className="line" />
                <div className="modal-body">
                  <div className="producto">
                    <div>
                      {filterHistory.map((filter, index) => (
                        <div key={index}>
                          <div className='bodyp' >
                            <strong  >Documento Filtrado :  <p className='result-filter' >{filter.filterField} {filter.filterOperator} {filter.filterValue}</p></strong>
                            <button className='btn-filter' onClick={() => handleFilterHistoryClick(index, filterHistory, setFilterHistory)}>Volver a filtrar</button>
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
      <div>Archivos Actuales: {resultCount}</div>
      {filterHistory.length > 0 && filteredData.length > 0 ? (
        <table>
          <thead>
            <tr className='trkey'>
              {/* Crea las columnas de la tabla según los campos de la tabla */}
              {Object.keys(filteredData[0]).map((header, index) => (
                <th key={index}>{header}</th>
              ))}
            </tr>
          </thead>
          <tbody className='tbody'>
            {filteredData.map((row, index) => (
              <tr key={index} className='tr'>
                {/* Muestra los valores de cada celda en la fila */}
                {Object.values(row).map((cell, index) => (
                  <td key={index}>{cell}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div>Actualmente no hay filtros.</div>
      )}
    </figure>
      
    </>
  );
}

export default App;
