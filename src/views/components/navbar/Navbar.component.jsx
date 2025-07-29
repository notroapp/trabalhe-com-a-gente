import "./Navbar.component.css";

import { useState, useRef, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function Navbar() {

    const location = useLocation();
    const navigate = useNavigate();
    const queryParams = new URLSearchParams(location.search);
    const query = queryParams.get("q");

    const searchRefDesktop = useRef(null);
    const searchRefMobile = useRef(null);

    useEffect(() => {
        if (searchRefDesktop.current) {
            searchRefDesktop.current.value = query;
        }
        if (searchRefMobile.current) {
            searchRefMobile.current.value = query;
        }
    }, [query]);

    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const pressEnter = (event) => {
        if (event.key === "Enter") {
            event.preventDefault();
            const input = event.target.value.trim();
            if (input.length > 0) {
                navigate(`?q=${encodeURIComponent(input)}`);
                setIsMenuOpen(false);
            }
        }
    };

    const toggleMenu = () => {
        setIsMenuOpen(prev => !prev);
    };

    const handleLogo = () => {
        navigate("/");
        setIsMenuOpen(false);
    };

    return (


        <header className="header">
            <div className="container-mobile">
                <div className="container-logo" onClick={handleLogo}>
                    <i className="bxl bx-github" aria-hidden="true"></i>
                </div>

                <div className="input-box close">
                    <input type="text" required="required" name="search" placeholder="" autoComplete="search" spellCheck="true" ref={searchRefDesktop} onKeyDown={pressEnter} aria-label="Busca por repositório ou usuário" />
                    <span className="text">Digite o nome do repositório ou usuário</span>
                </div>

                <div className={`toggle ${isMenuOpen ? "active" : ""}`} onClick={toggleMenu} type="button">
                    <span></span>
                    <span></span>
                    <span></span>
                </div>

                <ul id="menu" className={`menu ${isMenuOpen ? "active" : ""}`}>
                    <li> <a href="#footer"> Sobre o projeto </a> </li>
                </ul>
            </div>

            <div className="input-box mobile">
                <input type="text" required="required" name="search" placeholder="" autoComplete="search" spellCheck="true" ref={searchRefMobile} onKeyDown={pressEnter} aria-label="Busca por repositório ou usuário" />
                <span className="text">Digite o nome do repositório ou usuário</span>
            </div>
        </header>


    );
}