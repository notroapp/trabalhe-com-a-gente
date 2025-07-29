import { Routes, Route } from 'react-router-dom';

import Home from '../views/home/Home.view.jsx';
import Search from '../views/Search/Search.view.jsx';

export function AppRoutes() {
    return (
        <Routes>
            <Route path='/' element={<Home />} />
            <Route path="*" element={<Home />} />
            <Route path="/index" element={<Home />} />
            <Route path="/search" element={<Search />} />
        </Routes>
    )
}