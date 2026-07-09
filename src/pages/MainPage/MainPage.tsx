import {useState}from "react";
import { useNavigate } from "react-router-dom";

export default function MainPage() { 

    const navigate=useNavigate();

    const [genre,setGenre]=useState<string>("");
    const [era,setEra]=useState("2020s");

    const handleSubmit=(e: React.FormEvent)=>{
        e.preventDefault();

        if (!genre){
            alert("장르를 먼저 선택해 주세요!");
            return;
        }

        navigate(`/result/random?genre=${genre}&era=${era}`);
    };

    return (
        <main>
            <h2>FlixDrop 영화 뽑기</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <p><b>어떤 장르를 원하시나요?</b></p>
                    <button type="button" onClick={()=>setGenre("action")}>액션</button>
                    <button type="button" onClick={()=>setGenre("comedy")}>코미디</button>

                    <p>현재 선택된 장르: <span >{genre || "없음"}</span></p>
                </div>

                <div>
                    <p><b>선호하는 영화 시대를 골라보세요</b></p>
                    <select value={era} onChange={(e)=>setEra(e.target.value)}>
                        <option value="2020s">2020년대</option>
                        <option value="2010s">2010년대</option>
                        <option value="2000s">2000년대</option>
                    </select>
                </div>

                <br/>
                <button type="submit">
                    드롭! 영화 뽑기
                </button>
            </form>
        </main>
    );
}

