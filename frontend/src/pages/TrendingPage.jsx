//                 RepoFindr/frontend/src/pages/TrendingPage.jsx

import {useState, useEffect, useContext, useRef} from "react";
import {AuthContext} from "../context/AuthContext.jsx";
import RepoCard from "../components/RepoCard.jsx";



function TrendingPage (){
    
    const [repos, setRepos] = useState([]);
    const [savedIds, setSavedIds] = useState([]);
    const {token} = useContext(AuthContext);
    const [loading, setLoading] = useState(false);
    const [page , setPage] = useState(1);
    const [message, setMessage] = useState("");
    const [hasMore, setHasMore] = useState(false);
    const bottomRef = useRef();

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

    useEffect(()=>{
        if(repos.length === 0) return;
        
        async function loadMore(){
            setLoading(true);

            const params = new URLSearchParams({page})
            const response = await fetch(`${import.meta.env.VITE_API_URL}/fetch-trending-repos?${params}`);
            const data = await response.json();

            if(response.ok){
                console.log(data);
                setRepos((prev)=>{
                    const existingIDs = new Set(prev.map(r => r.id));
                    const newRepos = data.repositories.filter(r => !existingIDs.has(r.id));
                    return [...prev, ...newRepos];
                });
            }else{
                console.log("repo fetching failed for next page : ", data.message);
            }

            if(data.count < 30)setHasMore(false);
            setPage((page)=> page + 1);

            setLoading(false);
        }
        const observer = new IntersectionObserver((entry)=>{
            if(entry[0].isIntersecting){
                loadMore();
            }
        });

        if(bottomRef.current) observer.observe(bottomRef.current);

        return () => observer.disconnect();
    },[page, hasMore]);

    function addToSaved(id){
        setSavedIds((prev)=>[...prev, id]);
    }
    function removeFromSaved(id){
        setSavedIds((prev)=>prev.filter((savedId)=>savedId !== id));
    }

    useEffect(()=>{
        async function fetchTrending (){
            const params = new URLSearchParams({page : 1})
            const response = await fetch(`${import.meta.env.VITE_API_URL}/fetch-trending-repos?${params}`);
            const data = await response.json();

            if(response.ok){
                console.log(data);
                const trendingRepos=  data.repositories ?  data.repositories : [];
                setRepos(trendingRepos);
            }else{
                console.log("some error occured : ", data.message);
            }
            setHasMore(true);
            setLoading(false);
        }
        setLoading(true);
        fetchTrending();
    },[])

    return (
       <div className="flex flex-col max-w-6xl mx-auto px-8 mt-12">
            <h1 className="text-3xl text-center font-extrabold text-blue-600">Trending Repos</h1>
            {repos.length !==0 ? (repos.map((repo)=> <RepoCard
            key={repo.id}
            repo={repo}
            onSave={()=>{addToSaved(repo.id)}}
            onUnsave={()=>{removeFromSaved(repo.id)}}
            isSaved={savedIds.includes(repo.id)}
            
            />)) 
            : (!loading ? "couldnot fetch trending repos, something went wrong!!!" : "")}
            <div className="text-black font-bold text-center" ref={bottomRef}>{!loading ? message : ""}</div>
       </div>
    )
}


export default TrendingPage;