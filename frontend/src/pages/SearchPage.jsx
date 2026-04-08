//          RepoFindr/frontend/src/pages/SearchPage.jsx


import react, {useState, useContext, useEffect} from "react";
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
    
    useEffect(()=>{
        async function fetchSaved(){
            if(!token) return;
            const reponse = await fetch("http://localhost:5000/savedRepos",{
                method : 'GET',
                headers : {"authorization" : `Bearer ${token}`}
            })
            const data = await reponse.json();
            const ids = data.fetchedRepos ? data.fetchedRepos.map(repo => repo.RepoID) : [];
            setSavedIds(ids);
        } 
        fetchSaved()
    },[]);

    function addToSaved (id){
        setSavedIds((prev)=>[...prev, id])
       
   }
    function removeFromSaved (id){
        setSavedIds((prev)=>prev.filter(SavedId => SavedId != id));
        
    }

    async function handleSearch(){
        
        setLoading(true);
        setSearched(true);
        const params= new URLSearchParams({topic, language, stars, forks, lastUpdated});
        const response = await fetch(`http://localhost:5000/search-repo?${params}`, {
            method : 'GET',
            headers : {
                "content-type" : "application/json",
                "authorization" : `Bearer ${token}`
            }
        })

        const data = await response.json();
        if(response.ok){
            console.log(data);
        }else{
            setError(data.message);
            console.log("repo fetching failed : ", data.message)
        }
        
        setRepos(data.repositories);
        setLoading(false);
    }

    return (
    <>
        <div className="flex flex-col max-w-6xl mx-auto px-8 mb-20 mt-12 gap-6 p-6 shadow shadow-gray-400 rounded-md">
                <div className="flex justify-between gap-4">
                    <input placeholder="search for topic or name" name="topic" value={topic} onChange={(e)=>{setTopic(e.target.value)}} 
                    className="border rounded w-full p-3 font-bold"></input>
                    <button onClick={handleSearch} className="text-white font-bold px-4 py-2 bg-blue-500 rounded">Search</button>
                </div>
            
                <div className="flex flex-col gap-3">
                    <div className="flex gap-4">
                        <input type="text" name="language" placeholder="language" value={language} onChange={(e)=>{setLanguage(e.target.value)}} 
                            className="font-bold border rounded p-2 w-full"/>
                        <input type="date" name="lastUpdated" value={lastUpdated} onChange={(e)=>{setLastUpdated(e.target.value)}} 
                            className="font-bold border rounded p-2 w-full"/>
                    </div>
                    <div className="flex gap-4">
                        <input type="text" name="stars" placeholder="min stars" value={stars} onChange={(e)=>{setStars(e.target.value)}}
                            className="font-bold border rounded p-2 w-full"/>
                        <input type="text" name="forks" placeholder="min forks" value={forks} onChange={(e)=>{setForks(e.target.value)}}
                            className="font-bold border rounded p-2 w-full"/>
                    </div>
                </div>
        </div>

        <div className="max-w-6xl mx-auto  w-full">
            {loading ? "Loading...." : ((repos.length!==0)? (repos.map((repo) => (
                <div key={repo.id} className="w-full">
                    <RepoCard 
                        repo={repo}
                        isSaved={savedIds.includes(repo.id.toString())}
                        onSave={addToSaved}
                        onUnsave={removeFromSaved}
                    />
                </div>
            )))
            :(!searched ? "":"no match found !!!, try changing filters or topic") )}
        </div>
    </>
    )
}

export default SearchPage;

