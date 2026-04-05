//            RepoFindr/frontend/src/components/RepoCard.jsx


import {useContext} from "react"
import {AuthContext} from "../context/AuthContext"


function RepoCard ({repo, onSave, onUnsave, isSaved}) {
    
    const {token} = useContext(AuthContext);

    async function HandleSave (){
        
        const response = await fetch("http://localhost:5000/repo/save",{
            method : 'POST',
            headers : {
                "content-type" : "application/json",
                "authorization" : `Bearer ${token}`
            },
            body : JSON.stringify({
                id : repo.id,
                repoName : repo.repoName,
                fullname : repo.fullname,
                stars : repo.stars,
                forks : repo.forks,
                language : repo.language,
                description : repo.description,
                updatedAt : repo.updatedAt,
                pushedAt : repo.pushedAt,
                url : repo.url,
                owner : {
                    username : repo.owner.username,
                    avatar : repo.owner.avatar,
                    profileUrl : repo.owner.profileUrl,
                }
            })
        })

        const data = await response.json();
        
        if(response.ok || data.message === "repo is alreadysaved"){
            await onSave(repo.id.toString());
        } else {
            console.log("something went wrong : ", data.message);
        }
    }
    async function HandleUnsave (){
        
        const response = await fetch(`http://localhost:5000/savedRepos/${repo.id}`,{
            method : "DELETE",
            headers : {
                "authorization" : `Bearer ${token}`
            }
        })
        const data = await response.json();

        if(response.ok){
            await onUnsave(repo.id.toString());
        }else{
            console.log("something went wrong : ", data.message);
        }
    }

    return (
        <>
        <div>
            <div>
                <img src={repo.owner.avatar}></img>
                <span>{repo.owner.username}</span>
            </div>

            {isSaved ? 
            (<button onClick={HandleUnsave}>UNSAVE</button>)
            :(<button onClick={HandleSave}>SAVE</button>)
            }
        </div>

        <h1><a href={repo.url}>{repo.repoName}</a></h1>

        <p>{repo.description}</p>

        <div>
            <span>{repo.forks}</span>
            <span>{repo.stars}</span>
            <span>{repo.language}</span>
             
        </div>
        <p> pushed on : {repo.pushedAt}</p>
        <p> updated on : {repo.updatedAt}</p>
        </>
    )
}

export default RepoCard;