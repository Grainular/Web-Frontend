import { Link } from "react-router-dom";
import '../css/HeaderStyles.css';

export default function Header() {
    return (
        <nav className="flex items-center flex-wrap bg-main-green p-6 shadow-md">
            <div className="flex items-center flex-shrink-0 text-white mr-6">
                <span className="font-semibold md:text-xl tracking-tight sm:text-sm text-logo-brown">
                    SatWatch
                </span>
            </div>
            <div className="flex items-center flex-shrink-0 text-white mr-6 justify-between space-x-6">
                <MenuButton path="/" text="Homepage" />
                <MenuButton path="About" text="About" />
            </div>
        </nav>
    );
}

export function MenuButton(props) {
    return (
        <div>
            <Link
                to={props.path}
                className="flex items-center px-3 py-2 text-menu-green hover:text-menu-hover-green transition duration-200 ease-in-out"
            >
                {props.text}
            </Link>
        </div>
    );
}
