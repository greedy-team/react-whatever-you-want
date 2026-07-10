import { useQuery } from "@tanstack/react-query";
import { useNavigate, useSearchParams } from "react-router-dom";

const fetchMovieData=async(genre: string | null, era: string | null) => {
    const API_KEY="022081e1c47971a54a222e3eacfa4020";
    
    const genreMap: Record<string, number> = {
        action: 28,
        comedy: 35,
        drama: 18,
        romance: 10749,
        thriller: 53,
        mystery: 9648,
        horror: 27,
        animation: 16,
        sf: 878
    };
    
    const eraMap: Record<string, string> = {
        "2020s": "2024",
        "2010s": "2015",
        "2000s": "2005",
        "1990s": "1995",
        "1980s": "1985"
    };
    
    const tmdbGenreId = genre ? genreMap[genre.toLowerCase()] : "";
    const tmdbYear = era ? eraMap[era] : "";

    const url = `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&with_genres=${tmdbGenreId}&primary_release_year=${tmdbYear}&language=ko-KR`;

    const response =await fetch(url);

    if(!response.ok){
        throw new Error("데이터를 가져오는데 실패했습니다.");
    }
    return response.json();
}

export default function ResultPage(){
    const navigate=useNavigate();
    const [searchParams]=useSearchParams();

    const genre =searchParams.get("genre");
    const era=searchParams.get("era");

    const {isPending,error,data:randomMovie}=useQuery({
        queryKey:["movieRandomDrop",genre,era],
        queryFn: () => fetchMovieData(genre, era),

        select: (rawData)=>{
            if (!rawData?.results || rawData.results.length === 0) return null;
            const randomIndex = Math.floor(Math.random() * rawData.results.length);
            return rawData.results[randomIndex];
        }
    });

    const handleSaveToHistory=()=>{
        if (!randomMovie)return;

        const existingHistory=JSON.parse(localStorage.getItem("flixdrop_history")||"[]");

        const duplicateArray=existingHistory.filter((item:any)=>item.id===randomMovie.id);

        if (duplicateArray.length>0){
            alert("이미 보관함에 담긴 영화입니다!");
            return;
        }

        const newMovieItem={
            id:randomMovie.id,
            title:randomMovie.title,
            genre:genre,
            era:era,
        };

        const updatedHistory=[newMovieItem,...existingHistory];

        localStorage.setItem("flixdrop_history",JSON.stringify(updatedHistory));

        alert("보관함에 성공적으로 저장되었습니다!");
    }

    if (isPending){
        return(
            <main>
                <h2>취향을 기반으로 영화 탐색 중...</h2>
            </main>
        );
    }

    if (error){
        return(
            <main>
                <h2>에러가 발생했습니다.</h2>
                <button onClick={() => navigate("/")}>홈으로 돌아가기</button>
            </main>
        );
    }

    const movieTitle = randomMovie?.title || `선택하신 조건에 맞는 추천 영화가 없습니다.`;

    return (
        <main>
            <h2>FlixDrop 드롭 결과</h2>
            <div>
                <h3>주소창에서 읽어온 데이터</h3>
                <p>드롭된 장르 코드: {genre}</p>
                <p>드롭된 시대 코드: {era}</p>
                <p>결과: {movieTitle}</p>
            </div>

            {randomMovie&&(
                <button onClick={handleSaveToHistory}>
                    보관함에 저장하기
                </button>
            )}

            <button onClick={()=>navigate("/")}>필터 다시 고르기</button>
        </main>
    );
}
