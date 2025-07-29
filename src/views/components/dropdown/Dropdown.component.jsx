import "./dropdown.component.css";
import { useEffect, useRef, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";

function Dropdown() {
    const navigate = useNavigate();
    const dropdownRef = useRef(null);
    const [searchParams, setSearchParams] = useSearchParams();

    const options = [
        { value: "stars", label: "Número de Estrelas" },
        { value: "forks", label: "Número de Forks" },
        { value: "help-wanted-issues", label: "Número de Issues" },
        { value: "updated", label: "Atualizado recentemente" },
    ];

    const defaultOption = "stars";
    const [selected, setSelected] = useState(searchParams.get("option") || defaultOption);
    const [isOpen, setIsOpen] = useState(false);

    const handleSelect = (value) => {
        const query = searchParams.get("q") || "";
        const params = new URLSearchParams(searchParams);
        params.set("option", value);
        setSearchParams(params);
        setSelected(value);
        setIsOpen(false);
        navigate(`?q=${encodeURIComponent(query)}&option=${encodeURIComponent(value)}`);
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    useEffect(() => {
        const option = searchParams.get("option");
        if (!option) {
            const params = new URLSearchParams(searchParams);
            params.set("option", defaultOption);
            setSearchParams(params);
            setSelected(defaultOption);
        } else if (option !== selected) {
            setSelected(option);
        }
    }, [searchParams, setSearchParams, selected]);

    return (
        <div className="dropdown-order" ref={dropdownRef}>
            <div
                className="dropdown-order-selected"
                onClick={() => setIsOpen(!isOpen)}
            >
                {options.find(opt => opt.value === selected)?.label || "Selecione"}
                <i className={`bx bx-arrow-down ${isOpen ? "open" : "closed"}`}></i>
            </div>

            {isOpen && (
                <ul className="dropdown-order-list">
                    {options.map(option => (
                        <li
                            key={option.value}
                            className={option.value === selected ? "selected" : ""}
                            onClick={() => handleSelect(option.value)}
                        >
                            {option.label}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default Dropdown;