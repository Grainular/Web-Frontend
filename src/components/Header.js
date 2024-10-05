import {Link} from "react-router-dom";

export default function Header() {
    return (
        <nav className="flex items-center flex-wrap bg-main p-6">
            <div className="flex items-center flex-shrink-0 text-white mr-6">
                <span className="font-semibold md:text-xl tracking-tight sm:text-sm">My Project</span>
            </div>
            <div className="flex items-center flex-shrink-0 text-white mr-6 justify-between">
                <MenuButton path = "/" text="Homepage"/>
                <MenuButton path = "Example" text="Example"/>
            </div>
        </nav>

    );
}

export function MenuButton(props){
    return(
        <div>
            <Link to={props.path} className="flex items-center px-3 py-2 text-white hover:text-secondary">
                {props.text}
            </Link>
        </div>
    );
}