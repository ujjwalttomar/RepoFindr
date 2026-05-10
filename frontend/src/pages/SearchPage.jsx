//          RepoFindr/frontend/src/pages/SearchPage.jsx


import react, {useState, useContext, useEffect, useRef} from "react";
import RepoCard from "../components/RepoCard.jsx";
import {AuthContext} from "../context/AuthContext.jsx";


function SearchPage (){
    const [topic, setTopic] = useState("");
    const [language, setLanguage] = useState("");
    const [stars, setStars] = useState("");
    const [forks, setForks] = useState("");
    const [lastUpdated, setLastUpdated] = useState("");
    const [loading, setLoading] = useState(false);
    const [repos, setRepos]= useState([]);
    const { token } = useContext(AuthContext);
    const [savedIds, setSavedIds] = useState([]);
    const [searched, setSearched] = useState(false);
    const [error ,setError] = useState("");
    const [page , setPage] = useState(1);
    const [hasMore, setHasMore] = useState(false);
    const bottomRef = useRef();
    const totalRepoCount = useRef();
    const [message, setMessage] = useState("");
    const [sort, setSort] = useState("stars");
    const [order , setOrder] = useState("desc");

    
    useEffect(()=>{
        async function fetchSaved(){
            if(!token) return;
            const reponse = await fetch(`${import.meta.env.VITE_API_URL}/savedRepos`,{
                method : 'GET',
                headers : {"authorization" : `Bearer ${token}`}
            })
            const data = await reponse.json();
            const ids = data.fetchedRepos ? data.fetchedRepos.map(repo => repo.RepoID) : [];
            setSavedIds(ids);
        } 
        fetchSaved()

        async function fetchFromSessionStorage(){
            const savedRepos = sessionStorage.getItem("repos")
            const savedTopic = sessionStorage.getItem("topic")
            const savedLanguage = sessionStorage.getItem("language");
            const savedForks = sessionStorage.getItem("forks");
            const savedStars = sessionStorage.getItem("stars");
            const savedLastUpdated = sessionStorage.getItem("lastUpdated");

            if(savedRepos){
                setHasMore(true);
                setRepos(JSON.parse(savedRepos));}
            if(savedTopic) setTopic(JSON.parse(savedTopic));
            if(savedLanguage) setLanguage(JSON.parse(savedLanguage));
            if(savedForks) setForks(JSON.parse(savedForks));
            if(savedStars) setStars(JSON.parse(savedStars));
            if(savedLastUpdated) setLastUpdated(JSON.parse(savedLastUpdated));
        }
        fetchFromSessionStorage();

    },[]);


    function addToSaved (id){
        setSavedIds((prev)=>[...prev, id])
       
    }
    function removeFromSaved (id){
        setSavedIds((prev)=>prev.filter(SavedId => SavedId != id));
        
    }


    useEffect(()=>{

        if(repos.length === 0) return;

        async function loadMore (){
            setError("");
            setLoading(true);
            setSearched(true);

            const params = new URLSearchParams({topic, language, stars, forks, lastUpdated, page, sort, order});
            const response = await fetch(`${import.meta.env.VITE_API_URL}/search-repo?${params}`,{
                method : 'GET',
                headers : {
                    "content-type" : "application/json",
                    "authorization" :  `Bearer ${token}`
                }
            })
            const data = await response.json();
            if(response.ok){
                console.log(data);
                setRepos((prev) => {
                    const existingIds = new Set(prev.map(r => r.id))
                    const newRepos = data.repositories.filter(r => !existingIds.has(r.id))
                    return [...prev, ...newRepos];
                })
            }else{
                setError(data.message);
                console.log("repo fetching failed for next page : ", data.message);
            }
            setLoading(false);
            setPage((page)=> page + 1);

            totalRepoCount.current = data.total;
            console.log(totalRepoCount.current);
            if(page >= Math.ceil(totalRepoCount.current/30)){
                setHasMore(false);
            }else{
                setHasMore(true);
            }
        }

        const observer = new IntersectionObserver((entries)=>{

            if(entries[0].isIntersecting && !loading){
                if(hasMore ){
                    loadMore();
                }else{
                    setMessage("This is the last page !!!")
                }
            }
        })

        if(bottomRef.current){
            observer.observe(bottomRef.current);
        }
    
        return () => {
            observer.disconnect();
        };

    },[page, hasMore, repos.length, sort, order])

    useEffect(()=>{
        if(!searched)return;
        handleSearch();
    },[order, sort])

    async function handleSearch(){
        setError("");
        setLoading(true);
        setSearched(true);
        setMessage("");
        const params= new URLSearchParams({topic, language, stars, forks, lastUpdated, page: 1, sort, order});
        setPage(1);
        const response = await fetch(`${import.meta.env.VITE_API_URL}/search-repo?${params}`, {
            method : 'GET',
            headers : {
                "content-type" : "application/json",
                "authorization" : `Bearer ${token}`
            }
        })

        const data = await response.json();
        
        totalRepoCount.current = data.total;
        if(page >= Math.ceil(totalRepoCount.current/30)){
            setHasMore(false);
        }else{
            setHasMore(true);
        }

        if(response.ok){
            console.log(data);
            setRepos(data.repositories);

            sessionStorage.setItem("repos", JSON.stringify(data.repositories));
            sessionStorage.setItem("topic", JSON.stringify(topic));
            sessionStorage.setItem("language", JSON.stringify(language));
            sessionStorage.setItem("forks", JSON.stringify(forks));
            sessionStorage.setItem("stars", JSON.stringify(stars));
            sessionStorage.setItem("lastUpdated", JSON.stringify(lastUpdated));

        }else{
            setRepos([]);
            setError(data.message);
            console.log("repo fetching failed : ", data.message)
        }
        
        setLoading(false);
    }

  return (
<>
    <div className="flex flex-col max-w-6xl mx-auto px-8 mb-20 mt-12 gap-6 p-6 shadow-md shadow-blue-700 rounded-md">
            <div className="flex justify-between gap-4">
                <input type="text" placeholder="search for topic or name" onKeyDown={(e) => { if(e.key === "Enter") handleSearch() }} name="topic" 
                value={topic} onChange={(e)=>{setTopic(e.target.value)}} className="border rounded w-full p-3 font-bold"></input>
                <button onClick={handleSearch} className="text-white font-bold px-4 py-2 bg-blue-500 rounded hover:bg-blue-700">Search</button>
            </div>
        
            <div className="flex flex-col gap-3">
                <div className="flex gap-4">
                    <input type="text" name="language" placeholder="language" value={language} onChange={(e)=>{setLanguage(e.target.value)}} 
                        className="font-bold border rounded p-2 w-full"/>
                    <input type="date" name="lastUpdated" value={lastUpdated} onChange={(e)=>{setLastUpdated(e.target.value)}} 
                        className="font-bold border rounded p-2 w-full"/>
                </div>
                <div className="flex gap-4">
                    <input type="number" name="stars" placeholder="min stars" value={stars} onChange={(e)=>{setStars(e.target.value)}}
                        className="font-bold border rounded p-2 w-full"/>
                    <input type="number" name="forks" placeholder="min forks" value={forks} onChange={(e)=>{setForks(e.target.value)}}
                        className="font-bold border rounded p-2 w-full"/>
                </div>
            </div>
    </div>

    {(!loading ) && 
        <div>
            <div className="flex flex-row justify-between max-w-6xl mx-auto w-full">
                <h1 className="font-bold">Search Results</h1>
                <p>{totalRepoCount.current} repositories found</p>
            </div>
            <div className="flex flex-row justify-end max-w-6xl m-auto w-full py-5 gap-5">
                <div className="flex flex-row justify-center items-center">
                    <p className="font-bold">Sort By :</p>
                    <select value={sort} onChange={(e)=> setSort(e.target.value)}>
                        <option value="stars">stars</option>
                        <option value="forks">forks</option>
                        <option value="updated">updated</option>
                        <option value="pushed">pushed</option>                        
                    </select>
                </div>
                <div className="flex flex-row justify-center items-center">
                    <p className="font-bold">Order By :</p>
                    <select value={order} onChange={(e)=> setOrder(e.target.value)}>
                        <option value="asc">asc</option>
                        <option value="desc">desc</option>
                    </select>
                </div>
            </div>
        </div>
    }

    {error && <p className="text-red-500 font-bold max-w-6xl mx-auto w-full ">Error: {error}</p>}

    <div className="max-w-6xl mx-auto w-full">
        {repos.length !== 0 ? repos.map((repo) => (
            <div key={repo.id} className="w-full">
                <RepoCard 
                    repo={repo}
                    isSaved={savedIds.includes(repo.id.toString())}
                    onSave={addToSaved}
                    onUnsave={removeFromSaved}
                />
            </div>
        )) : (searched && !loading && <p className="font-bold">no match found!!!</p>)}
        
        {loading && <p className="text-center py-4">Loading....</p>}
        <div className="text-black font-bold text-center" ref={bottomRef}>{!loading ? message : ""}</div>
    </div>      
</>
)
}

export default SearchPage;