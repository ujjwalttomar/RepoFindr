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
    
    useEffect(()=>{
        async function fetchSaved(){
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
            console.log("repo fetching failed : ", data.message)
        }
        
        setRepos(data.repositories);
        setLoading(false);
    }

    return (
       <>
        <div>
            <input placeholder="search for topic or name " name="topic" value={topic} onChange={(e)=>{setTopic(e.target.value)}} ></input>
            <button onClick={handleSearch}>Search</button>
        </div>
        
        <div>
            <input type="text" name="language" placeholder="language" value={language} onChange={(e)=>{setLanguage(e.target.value)}} />
            <input type="text" name="stars" placeholder="stars" value={stars} onChange={(e)=>{setStars(e.target.value)}}/>
            <input type="text" name="forks" placeholder="forks" value={forks} onChange={(e)=>{setForks(e.target.value)}} />
            <input type="text" name="lastUpdated" placeholder="last-updated" value={lastUpdated} onChange={(e)=>{setLastUpdated(e.target.value)}} />
        </div>

        <div>
            {loading ? "Loading...." : (repos.map((repo)=><div key={repo.id}><RepoCard 
                repo={repo}
                isSaved={savedIds.includes(repo.id.toString())}
                onSave={addToSaved}
                onUnsave={removeFromSaved}
                /></div>))}
        </div>
       </>
    )
}


export default SearchPage;