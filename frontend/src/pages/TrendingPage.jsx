//                 RepoFindr/frontend/src/pages/TrendingPage.jsx

import {useState, useEffect, useContext} from "react";
import {AuthContext} from "../context/AuthContext.jsx";
import RepoCard from "../components/RepoCard.jsx";



function TrendingPage (){
    
    const [repos, setRepos] = useState([]);
    const [savedIds, setSavedIds] = useState([]);
    const {token} = useContext(AuthContext);
    const [loading, setLoading] = useState(false);

    useEffect(()=>{
        async function fetchSaved (){
            if(!token) return;
            const response = await fetch(`${import.meta.env.VITE_API_URL}/savedRepos`,{
                headers : { "authorization" : `Bearer ${token}`}
            })
            const data = await response.json();
            
            if(response.ok){
                const ids = data.fetchedRepos ? data.fetchedRepos.map((repo)=> repo.RepoID) : [];
                setSavedIds(ids);
            }else{
                console.log("some error occured: ", data.message);
            }
        }
      
        fetchSaved();
        
    },[])

    function addToSaved(id){
        setSavedIds((prev)=>[...prev, id]);
    }
    function removeFromSaved(id){
        setSavedIds((prev)=>prev.filter((savedId)=>savedId !== id));
    }

    useEffect(()=>{
        async function fetchTrending (){
            const response = await fetch(`${import.meta.env.VITE_API_URL}/fetch-trending-repos`);
            const data = await response.json();

            if(response.ok){
                console.log(data);
                const trendingRepos=  data.repositories ?  data.repositories : [];
                setRepos(trendingRepos);
            }else{
                console.log("some error occured : ", data.message);
            }
            setLoading(false);
        }
        setLoading(true);
        fetchTrending();
    },[])

    return (
       <div className="flex flex-col max-w-6xl mx-auto px-8 mt-12">
            <h1 className="text-3xl text-center font-extrabold text-blue-600">Trending Repos</h1>
            {repos.length !==0 ? (repos.map((repo)=> <RepoCard
            repo={repo}
            onSave={()=>{addToSaved(repo.id)}}
            onUnsave={()=>{removeFromSaved(repo.id)}}
            isSaved={savedIds.includes(repo.id)}
            
            />)) 
        : (!loading ? "couldnot fetch trending repos, something went wrong!!!" : "")}
       </div>
    )
}


export default TrendingPage;