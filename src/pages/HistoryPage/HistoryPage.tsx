export default function HistoryPage(){
    const History=[
        {id: 1, title:"아이언맨",date:"2026-07-08"},
        { id: 2, title: "스파이더맨", date: "2026-07-09" },
    ];

    return(
        <main>
            <h2>내가 본 영화 보관함</h2>
            <p>그동안 드롭으로 추천받았던 영화 목록입니다.</p>
            <ul>
                {History.map((movie)=>(
                    <li key={movie.id}>
                        <b>{movie.title}</b><span>({movie.date} 시청)</span>
                    </li>
                ))}
            </ul>
        </main>
    )
}