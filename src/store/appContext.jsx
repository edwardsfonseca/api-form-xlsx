import React, { useState, useEffect } from "react";
import getState from "./flux";
import XLSX from 'xlsx';
// -------------------------------------------------
export const Context = React.createContext(null);
export const Provider = Context.Provider;
// -------------------------------------------------
const injectContext = PassedComponent => {
    const StoreWrapper = (props) => {
        const [state, setState] = useState(getState());

        useEffect(() => {
            const store = state.store;
            const actions = {
                ...state.actions,
                getFetchData: async () => {
                    try {
                        const response = await fetch('cartera.xlsx', { responseType: 'arraybuffer' });
                        const buffer = await response.arrayBuffer();
                        const workbook = XLSX.read(buffer, { type: 'array' });
                        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
                        const data = XLSX.utils.sheet_to_json(worksheet);
                        setStore((prevStore) => ({
                            ...prevStore,
                            jsonData: data,
                            filteredData: data,
                        }));
                    } catch (error) {
                        console.error('Error fetching data:', error);
                    }
                },
            };

            setState({ store, actions });
        }, []);

        const setStore = (updatedStore) => {
            setState((prevState) => ({
                ...prevState,
                store: { ...prevState.store, ...updatedStore },
            }));
        };

        const contextValue = {
            store: state.store,
            actions: state.actions,
        };

        return (
            <Provider value={contextValue}>
                <PassedComponent {...props} />
            </Provider>
        );
    };
    return StoreWrapper;
};

export default injectContext;
