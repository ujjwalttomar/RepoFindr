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
       <div className="flex flex-col mx-60 mt-12 gap-6 p-20 shadow shadow-gray-400 rounded-md">
            <div className="flex justify-between gap-16">
                <input placeholder="search for topic or name " name="topic" value={topic} onChange={(e)=>{setTopic(e.target.value)}} 
                   className= "border rounded w-full p-3 font-bold" ></input>
                <button onClick={handleSearch} className="text-white font-bold px-4 py-2 bg-blue-500 rounded ">Search</button>
            </div>
        
            <div className="flex gap-5 ">
                <input type="text" name="language" placeholder="language" value={language} onChange={(e)=>{setLanguage(e.target.value)}} 
                    className="font-bold border rounded p-2"/>
                <input type="text" name="stars" placeholder="stars" value={stars} onChange={(e)=>{setStars(e.target.value)}}
                    className="font-bold border rounded p-2"/>
                <input type="text" name="forks" placeholder="forks" value={forks} onChange={(e)=>{setForks(e.target.value)}}
                    className="font-bold border rounded p-2" />
                <input type="text" name="lastUpdated" placeholder="last-updated" value={lastUpdated} onChange={(e)=>{setLastUpdated(e.target.value)}} 
                    className="font-bold border rounded p-2"/>
            </div>
        </div>

            <div className="mx-60">
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