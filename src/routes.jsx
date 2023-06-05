
import { BrowserRouter, Route, Routes } from "react-router-dom";
import App from './App';
import  App2 from "./App-2"

const Rout = () => {

    
    return (
        <div style={{ textAlign: "center" }}>

            <BrowserRouter>

                <Routes>
                    <Route path="/" element={<App/>} />
                    <Route path="/App-2/" element={<App2/>} />
                    
                </Routes>
                
            </BrowserRouter>


        </div>
    );
};

export default Rout;