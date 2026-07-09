import {Link} from "react-router-dom";

export default function Header() {
    return (
        <header>
            <h1>
                <Link to="/">
                FlixDrop
                </Link>
            </h1>

            <nav style={{display:"flex", gap: "20px"}}>
                <Link to="/">홈</Link>
                <Link to="history">보관함</Link>
            </nav>
        </header>
    );
}
