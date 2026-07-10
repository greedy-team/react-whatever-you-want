import { useState,useEffect } from "react";

interface SavedMovie{
    id:number;
    title:string;
    genre:string;
    era:string;
}

export default function HistoryPage(){
    const[movies,setMovies]=useState<SavedMovie[]>([]);

    useEffect(()=>{
        const savedData=JSON.parse(localStorage.getItem("flixdrop_history")||"[]");

        setMovies(savedData);
    },[]);

    const handleDeleteMovie=(id:number)=>{
        const updatedMovies=movies.filter(movie=>movie.id!==id);

        setMovies(updatedMovies);

        localStorage.setItem("flixdrop_history",JSON.stringify(updatedMovies));

        alert("보관함에서 삭제되었습니다!");
    };

    return(
        <main> 
            <h2>나의 FlixDrop 보관함</h2>
            <p>그동안 드롭으로 추천받았던 영화 목록입니다.</p>
            {movies.length===0?(
                <p>아직 보관함에 담긴 영화가 없습니다.</p>
            ):(
                <div>
                    {movies.map((movie)=>(
                        <div key={movie.id}>
                            <div>
                                <h3>{movie.title}</h3>
                                <p>{movie.genre}/{movie.era}</p>
                            </div>

                            <button onClick={()=>handleDeleteMovie(movie.id)}>
                                지우기
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </main>
    )
}