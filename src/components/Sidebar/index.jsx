import {
  FaCamera,
  FaFileSignature,
  FaSignOutAlt,
  FaUpload,
} from "react-icons/fa";

import logo from "../../assets/images/logo.png";

export function Sidebar(props) {
  return (
    <aside className="column is-2 is-narrow-mobile is-fullheight section is-hidden-mobile">
      <img src={logo} alt="logo" className="mb-1" />
      <h1 className="mb-5">Bem vindo, Gabriel!</h1>
      <p className="menu-label is-hidden-touch">Navegação</p>
      <ul className="menu-list">
        <li>
          <a
            href="#"
            className={props.category === `pictures` ? `is-active` : ``}
            onClick={() => {
              props.setCategory(`pictures`);
            }}
          >
            <span className="icon">
              <FaCamera />
            </span>{" "}
            Fotos
          </a>
        </li>
        <li>
          <a
            href="#"
            className={props.category === `upload` ? `is-active` : ``}
            onClick={() => {
              props.setCategory(`upload`);
            }}
          >
            <span className="icon">
              <FaUpload />
            </span>{" "}
            Upload de fotos
          </a>
        </li>
        <li>
          <a
            href="#"
            className={props.category === `texts` ? `is-active` : ``}
            onClick={() => {
              props.setCategory(`texts`);
            }}
          >
            <span className="icon">
              <FaFileSignature />
            </span>{" "}
            Textos
          </a>
        </li>
      </ul>
      <p className="menu-label ">Controles</p>
      <ul className="menu-list">
        <li>
          <a className="" onClick={props.handleSignOut}>
            <span className="icon">
              <FaSignOutAlt />
            </span>{" "}
            Logout
          </a>
        </li>
      </ul>
    </aside>
  );
}
