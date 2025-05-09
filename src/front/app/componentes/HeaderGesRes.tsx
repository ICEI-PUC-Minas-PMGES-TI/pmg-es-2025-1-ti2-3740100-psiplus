import React from "react";
import { FiSearch, FiLogOut } from "react-icons/fi";
import "./header.css";


const Header: React.FC = () => {
  return (
    <header className="top-header">
      <div className="search-box">
        <FiSearch className="search-icon" />
        <input type="text" placeholder="Pesquisar" />
      </div>
      <div className="logout">
        <FiLogOut className="logout-icon" />
        <span>Sair</span>
      </div>
    </header>
  );
};

export default Header;
