import { useNavigate, useSearchParams } from "react-router-dom";

export default function ResultPage(){
    const navigate=useNavigate();
    const [searchParams]=useSearchParams();

    const genre =searchParams.get("genre");
    const era=searchParams.get("era");

    return (
        <main>
            <h2>FlixDrop 드롭 결과</h2>
            <div>
                <h3>주소창에서 읽어온 데이터</h3>
                <p>드롭된 장르 코드: {genre}</p>
                <p>드롭된 시대 코드: {era}</p>
            </div>

            <button onClick={()=>navigate("/")}>필터 다시 고르기</button>
        </main>
    );
}
