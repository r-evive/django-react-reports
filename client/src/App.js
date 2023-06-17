import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { RoutesArray } from './routes/Routes';


function App() {
  const generateRoutes = () => {
    return RoutesArray.map((route, index) => {
        return <Route key={index} path={route.path} element={route.component}/>
    });
  }
  return (
    <>
      <BrowserRouter>
        <Routes>
          {generateRoutes()}
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
