import { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
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
import Swal from 'sweetalert2'
function App() {
  // variables de estados que se actulizan , a medida que se llamen
  const [jsonData, setJsonData] = useState([]);// obtenemos la data
  const [filteredData, setFilteredData] = useState([]);// filtramos la data con los datos iniciales de jsondata esto nos permite mostrarlo en la tabla 
  //y se actualizan cuando aplicamos filtros con filterField, filterOperator, filterValue 
  const [filterField, setFilterField] = useState('');
  const [filterOperator, setFilterOperator] = useState('');
  const [filterValue, setFilterValue] = useState('');
  //-------///
  const [resultCount, setResultCount] = useState(0); // filramos los resultados y los mostramos
  const [filterHistory, setFilterHistory] = useState(JSON.parse(localStorage.getItem("filterHistory")) || []); // obtenemos filtros de la historia puede iniciar 
  // vacio o con el estado guardado en el localstorage
  const [mostrar, setMostrar] = useState(false); // esta variable estado permita mostar el historial mediante un boton cuando sea true , iniciando su estado en false para no mostrarse 
  const [help, setHelp] = useState(false);
 
  useEffect(() => {
    const fetchDataAndInitialize = async () => {
      const data = await fetchData();
      setJsonData(data);
      setFilteredData(data);
    };
    fetchDataAndInitialize();
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
  // agregamos el filtro a la historia 
  const handleFilterClickAndAddToHistory = () => {
    if(filterField && filterOperator && filterValue){
      handleFilterClick(filterField, filterOperator, filterValue, filterHistory, setFilterHistory);
      Swal.fire({
        icon: 'success',
        title: 'Filtrado Exitoso',
        

    })
      
    }else{
      Swal.fire({
        icon: 'error',
        title: 'Filtrado Erroneo',
        html:`<h1>Algunos de los campos no han sido seleccionados </h1>
              <h2>Asegurate de seleccionar los 3 selectores antes de filtrar</h2>
              
        
        `,
        time:1500,

    })
    }
    
  };
  //borramos todos los filtros
  const clearFilter = () => {
    setFilterField('');
    setFilterOperator('');
    setFilterValue('');
    setFilteredData(jsonData);
    setResultCount(jsonData.length);
    setFilterHistory([]);
    localStorage.removeItem('filterHistory');
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
        {/* /------------------------------------------------Hacia Abajo Tenemos La vista BOTONES FILTRAR,BORRAR FILTRO, HISTORAL---------------------------------------------------------/ */}
        <div className='btnpadre'>
          <div className='btn'>
            <button onClick={handleFilterClickAndAddToHistory}>Filtrar</button>
          </div>
          <div className='btn-borrar'>
            <button onClick={clearFilter}>Borrar Filtro</button>
          </div>

          {/*/Apartir de esta linea se hace el historia/*/}
          <div className='btnhistory'>
            <div className="#">
              <button onClick={() => setMostrar(true)}>
                Historial ({filterHistory.length})
              </button>
            </div>
            {mostrar && (
              <div className="modal-overlay">
                <div className="modal ">
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
                    <div className="#">
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

          {/*/Apartir de esta linea se hace el guia de ayuda/*/}
          <div className='btn-help'>
            <div className="#">
              <button onClick={() => setHelp(true)}>
                <i className="fa-regular fa-circle-question"></i>
              </button>
            </div>
            {help && (
              <div className="modal-overlay ">
                <div className="modal sidebar ">
                  <div className="modal-header ">
                    <h1>Guia de Uso </h1>
                    <button
                      className="cerrar"
                      onClick={() => setHelp(false)}
                    >
                      X
                    </button>
                  </div>
                  <hr className="line" />
                  <div className="modal-body">
                    <div className="#">
                      <ol>
                        <li>Operadores</li>
                        <li>Campos</li>
                        <li>Valores</li>
                        <li>Filtros</li>
                        <li>Historia</li>
                      </ol>
                      <hr className="line" />
                      <p>Esta guia sirve para explicarte o sacarte de dudas a la hora de utilizar el formulario para sus debidos filtros en la siguiente linea te explicare mas a detelle</p>
                      <h2> Para iniciar la busqueda de filtrado de archivos es importante destacar :</h2>
                      <p>Primero debes elegir el campo que desees buscar en esta ocasion tenemos </p>
                      <ul>
                        <li>Nombre</li>
                        <li>Documento</li>
                        <li>Comuna</li>
                        <li>Monto</li>
                      </ul>
                      <hr className="line" />
                      <h2>Una vez seleccionado el campo debes ingresar la operacion a buscar en este caso en el formulario esta de la siguiente manera :</h2>
                      <p>Puedes elegir entre las siguientes opciones cada una tiene su funcion</p>
                      <ul>
                        <li>Igual : Nos permite acceder a archivos unicos que tu definas al filtrarlos </li>
                        <p>
                          Un ejemplo seria : cuando quieres filtrar por comuna seria asi Campo : seleccionas comuna , su Operador es Igual porque comuna es unico y en su Valor en nombre de la comuna
                        </p>
                        
                        <li>Mayor que : Nos Permite Acceder a Archivos donde su valor es mayor al valor que tu ingresas </li>
                        <p>Un Ejemplo : Si deseas buscar por un valor por monto digamos muestra archivos mayores en monto a 1000 $ te devuelve archivos mayores </p>
                        <li>Menor que : Nos permite Acceder a Archivos donde su valor sea menor al valor ingresado en el campo valor</li>
                        <li>Mayor igual : Nos permite Acceder a Archivos donde su valor sea Mayor al valor ingresado o igual</li>
                        <li>Menor igual : Nos permite Acceder a Archivos donde su valor sea Menor al Valor Ingresado o Igual</li>
                      </ul>
                      <hr className="line" />
                      <h2>Una Guia Corta de como seria en operadores</h2>
                      <ol>
                        <li>Mayor igual : {">="}</li>
                        <li>Menor igual : {"<="}</li>
                        <li>Mayor que : {">"}</li>
                        <li>Menores que : {"<"}</li>
                        <li>Igual : =</li>
                      </ol>

                      <hr className="line" />

                      <p> Archivos Actuales : Mostrara los archivos que filtrastes </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>



          <div className='btn-version'>
            <Link to={"/app-2"}>
              <button>Version 2</button>
            </Link>
          </div>
        </div>


        {/* /------------------------------------------------Hacia Abajo Tenemos La vista TABLA---------------------------------------------------------/ */}
        <div className='count'> <h1>Archivos Actuales: {resultCount}</h1> </div>
        {filterHistory.length > 0 && filteredData.length > 0 ? (
          <table>
            <thead>
              <tr className='trkey'>
                {/* Crea las columnas de la tabla según los campos de la tabla */}
                {Object.keys(filteredData[0]).map((header, index) => (

                  <th key={index}>{header}</th> // por cada key me regresa un header 
                ))}
              </tr>
            </thead>
            <tbody className='tbody'>
              {filteredData.map((data, index) => (
                <tr key={index} className='tr'>
                  {/* Muestra los valores de cada celda en la fila por cada key */}
                  {Object.values(data).map((cell, index) => (
                    <td key={index}>{cell}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div>Actualmente no hay documentos filtrados.</div>
        )}
      </figure>

    </>
  );
}

export default App;
