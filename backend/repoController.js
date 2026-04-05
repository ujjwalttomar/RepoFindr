//                                                    backend/repoController.js


import {SavedRepo, User} from "./models.js";
import axios from "axios";

// searchRepos, fetchTrendingRepos, saveRepo, fetchAllSavedRepos, unsaveRepo, fetchRepoOwnerdetails (left  -- or i think i will not need it , i can just put the url in its avatar, and by clicking  it user's github profile will showup).

export const searchRepos = async (req, res) => {

    try{
        // take the input form user, the queries , the order , the number of stars , forks , language etc.
        const {topic, language, stars, forks, lastUpdated} = req.query;

        let query = ""

        if(topic)query += topic;
        if(language)query += ` language:${language}`;
        if(stars)query += ` stars:${stars}`;
        if(forks)query += ` forks:${forks}`;
        if(lastUpdated) query += ` pushed:${lastUpdated}`;
        


        const response =  await axios.get(`https://api.github.com/search/repositories`, {
            params : {q : query}
        }); 
        
        const repos = response.data.items;

        const totalCount = response.data.total_count;

        return res.status(200).json({
            total:totalCount,
            count:repos.length,
            repositories:repos.map(repo => ({
                id : repo.id,
                repoName : repo.name,
                fullName : repo.full_name,
                url : repo.html_url,
                stars:repo.stargazers_count,
                forks:repo.forks_count,
                language: repo.language,
                description:repo.description,
                pushedAt : repo.pushed_at,
                updatedAt: repo.updated_at,
                owner : {
                    username : repo.owner.login,
                    avatar : repo.owner.avatar_url,
                    profileUrl: repo.owner.html_url
                }

            }))

        });
        // usign then to make a api call ,
        // after fetchign the results , use that data to create a more predictive respose with less unpredictive response and  errors.
        // return the results of fetch using pagination .
    }catch(error){
        console.error("GitHub API Error:", error.response?.data || error.message);
        return res.status(500).json({
            message : "failed to search repositories - server side error",
            error : error.response?.data?.message || error.message
        })
    }
}

export const fetchAllSavedRepos = async (req, res) => {

    try{
        
        const userID = req.user.userId;
        const fetchedRepos = await SavedRepo.find({savedBy:userID});

        if(fetchedRepos.length == 0){
            return res.status(200).json({
                message : "no saved repos were found"
            })
        }

        return res.status(200).json({
            message : "saved repos fetched successfully",
            fetchedRepos
        })
   
    }catch(error){
        console.log("server error :",error.message);
        return res.status(500).json({
            message : "server side error",
            error : error.response.data?.message || error.message
        })
    }
}

export const fetchTrendingRepos = async (req, res) => {

    try{
        const date = new Date();
        date.setDate(date.getDate()-7);
        const dateString = date.toISOString().split('T')[0];

        let query = "";
        query += `pushed:>${dateString}`;
        

        const response = await axios.get(`https://api.github.com/search/repositories/`,{
            params : {
                q : query,
                sort : "stars",
                order : "desc"
        }
            
        })
        const repos = response.data.items;
        const totalCount = response.data.total_count;

        return res.status(200).json({
            total:totalCount,
            count:repos.length,
            repositories:repos.map(repo => ({
                id : repo.id,
                repoName : repo.name,
                fullName : repo.full_name,
                url : repo.html_url,
                stars:repo.stargazers_count,
                forks:repo.forks_count,
                language: repo.language,
                owner : {
                    username : repo.owner.login,
                    avatar : repo.owner.avatar_url,
                    profileUrl: repo.owner.html_url
                }

            }))

        });

        // to fetch trending repos , we will fetch repos created in last 7 days with their starts or forks in ascending order.
        // display the result, i have to clear the api resutl for reducing the error of umpreidictive behaviour of api and predictive errors.
        // return the resutls of api as response.
        // still looking for some ideas , how can i get trending repos , what should be our bases . also how to sort thigns.
    }catch(error){
        return res.status(500).json({
            message : "server side error",
            error
        })
    }
}

export const saveRepo = async (req, res) => {

    try{
        const {id, repoName, fullname, url, stars, forks, language, description, owner: {username, profileUrl, avatar},updatedAt, pushedAt} = req.body;
        
        const userID = req.user.userId;

        const user = await User.findById(userID);
        if(!user){
            return res.status(400).json({
                message : "invalid request"
            })
        }
        const alreadySaved = await SavedRepo.findOne({RepoID:id, savedBy:userID});
        if(alreadySaved){
            return res.status(400).json({
                message : "repo is alreadysaved",  // i m using this message to change the save button to unsave  button for already saved repos.
                savedId: alreadySaved._id 
            })
        }
        const newRepo = await SavedRepo.create({
            RepoID : id,
            repoName : repoName,
            fullName : fullname,
            repoUrl : url,
            stargazersCount : stars,
            forksCount :forks,
            language : language,
            Owner : {
                username : username,
                profileUrl : profileUrl,
                avatarUrl : avatar,
            },
            description : description,
            savedBy : user,
            pushedAt : pushedAt,
            updatedAt : updatedAt
        });
        
     
        return res.status(200).json({
            message : "repo saved successfully",
            newRepo
        })
    }catch(error){
        console.error("save repo error : ", error);
        return res.status(500).json({
            message : "server side error",
            error
        })
    }
}

export const unsaveRepo = async (req, res) => {2

    try{
       
        const repoId = req.params.repoId;

        const repo = await SavedRepo.findOne({RepoID:repoId, savedBy : req.user.userId});

        if(!repo){
            return res.status(404).json({
                message : "repo not found , invalid request"
            })
        }

        await repo.deleteOne();

        return res.status(200).json({
            message : "repo deleted successfully"
        })
    }catch(error){
        return res.status(500).json({
            message : "server side error",
            error
        })
    }
}

