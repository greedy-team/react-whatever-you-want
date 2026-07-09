import {Link} from "react-router-dom";

export default function Header() {
    return (
        <header>
            <h1>
                <Link to="/">
                FlixDrop
                </Link>
            </h1>
        </header>
    );
}
