//          RepoFindr/frontend/src/pages/SavedRepos.jsx


import react, {useContext, useState, useEffect} from "react";
import RepoCard from "../components/RepoCard.jsx";
import {AuthContext} from "../context/AuthContext.jsx";


function SavedRepos (){

    const { token } = useContext(AuthContext);
    const [repos, setRepos] = useState([]);
    
    useEffect(() => {
        async function fetchSaved() {

            const response = await fetch("http://localhost:5000/savedRepos", {
                headers: { "authorization": `Bearer ${token}` }
            })

            const data = await response.json()
            
            const normalized = data.fetchedRepos ? (data.fetchedRepos.map( repo => ({
                id : repo.RepoID,
                repoName : repo.repoName,
                url : repo.repoUrl,
                stars : repo.stargazersCount,
                forks : repo.forksCount,
                language : repo.language,
                description : repo.description,
                pushedAt : repo.pushedAt,
                updatedAt:repo.updatedAt,
                owner : {
                    username : repo.Owner.username,
                    avatar : repo.Owner.avatarUrl,
                    profileUrl : repo.Owner.profileUrl
                }
            }))
            ) : [];
            setRepos(normalized);
        }
        fetchSaved()
    }, [])

    function RemoveFromRepos (id){
        setRepos((prev) => prev.filter(repo => repo.id !== id))
    }

    return (
       <div className="m-60">
            {repos ? repos.map((repo)=><RepoCard key ={repo.id}
                repo = {repo}
                onUnsave = {()=>{RemoveFromRepos(repo.id)}}
                isSaved={true}
            />) :  "no repo saved yet"}
       </div>      
    )
}


export default SavedRepos;