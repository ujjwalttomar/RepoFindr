//            RepoFindr/frontend/src/components/RepoCard.jsx


import {useContext} from "react"
import {AuthContext} from "../context/AuthContext"


function RepoCard ({repo, onSave, onUnsave, isSaved}) {
    
    const {token} = useContext(AuthContext);

    async function HandleSave (){
        
        const response = await fetch(`${import.meta.env.VITE_API_URL}/repo/save`,{
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
        
        const response = await fetch(`${import.meta.env.VITE_API_URL}/savedRepos/${repo.id}`,{
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
        <div className="flex flex-col rounded justify-center w-full  mb-10 shadow shadow-gray-500 p-5 gap-2 mt-5">
            <div className="flex justify-between ">
                <div className="flex gap-4 justify-center items-center">
                    <img src={repo.owner.avatar} className="w-10 h-10 rounded"></img>
                    <span className="font-extrabold">{repo.owner.username}</span>
                </div>

                {isSaved ? 
                (<button onClick={HandleUnsave} className="text-white bg-blue-300 hover:bg-blue-500 rounded font-bold text-center px-4 py-2">UNSAVE</button>)
                :(<button onClick={HandleSave}  className="text-white bg-blue-600 hover:bg-blue-500 rounded font-bold text-center px-4 py-2">SAVE</button>)
                }
            </div>

            <h1><a href={repo.url} className="font-extrabold text-blue-700 text-xl">{repo.repoName}</a></h1>

            <p className=" text-gray-600 font-bold ">{repo.description}</p>

            <div className=" flex gap-4">
                <span className="font-semibold text-gray-800">Forks: {repo.forks}</span>
                <span className="font-semibold text-gray-800">Stars: {repo.stars}</span>
                <span className="font-semibold text-gray-800">Language: {repo.language}</span>
                
            </div >
            
            <div className="flex gap-7">
                <p className=" text-gray-800"> pushed on : {new Date(repo.pushedAt).toLocaleDateString()}</p>
                <p className="text-gray-800"> updated on : {new Date(repo.updatedAt).toLocaleDateString()}</p>
            </div>
            
        </div>
    )
}

export default RepoCard;