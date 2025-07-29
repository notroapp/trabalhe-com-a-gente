import "./introduction.home.css";

import { useRef } from "react";
import { useNavigate } from "react-router-dom";

import imgNotro from "../../../../assets/imgs/base/icon/notro.webp";
import imgGitHub from "../../../../assets/imgs/base/icon/GitHub_Logo.webp";

export default function IntroductionHome() {

    const searchRef = useRef();
    const navigate = useNavigate();

    const searchName = () => {
        const name = searchRef.current.value.trim();
        if (name) {
            navigate(`/search?q=${encodeURIComponent(name)}`);
        }
    };

    const handleKeyDown = (event) => {
        if (event.key === "Enter") {
            searchName();
        }
    };

    return (
        <section id="IntroductionHome" className="introduction-home">
            <div className="container">
                <div className="introduction-text">
                    <h1>Pesquisar no </h1>
                    <div className="container-img">
                        <img src={imgGitHub} alt="github logo" />
                    </div>
                </div>

                <div className="introduction-search">
                    <div className="input-box">
                        <input type="text" name="search" placeholder="" autoComplete="search" spellCheck="true" ref={searchRef} onKeyDown={handleKeyDown} required />
                        <span className="text">Digite o nome do repositório ou usuário</span>
                    </div>

                    <button className="btn-second" onClick={searchName} type="button">
                        <i className="bx bx-search"></i> Pesquisar
                    </button>
                </div>

                <div className="introduction-text-challenge">
                    <h1> Desafio da </h1>
                    <div className="container-img">
                        <img src={imgNotro} alt="notro logo" />
                    </div>
                    <p>desenvolvido por:</p>
                    <p>Victor Augusto Rodrigues Gomes</p>
                </div>
            </div>
        </section>
    );
}
