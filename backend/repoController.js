import express from "express";
import SavedRepo from "./models";


// searchRepos, fetchTrendingRepos, saveRepo, fetchAllSavedRepos, unsaveRepo, fetchRepoOwnerdetails (left)

export const searchRepos = async (req, res) => {

    try{
        // take the input form user, the queries , the order , the number of stars , forks , language etc.
        const {keyword, language, stars, forks, order, sortBy=stars} = req.body;  // last-updated filter is still yet to be added. 

        let query = [];

        if(keyword)query.push(keyword);
        if(language)query.push(`language : ${langauge}`);
        if(stars)query.push(`stars:>=${stars}`);
        if(forks)query.push(`forks: >= ${forks}`);
        if(order)query.push(`order: >= ${order}`);
        if(sortBy)query.push(`sort: >= ${sort}`);
        
        // usign then to make a api call ,
        // after fetchign the results , use that data to create a more predictive respose with less unpredictive response and errors.
        // return the results of fetch using pagination .
    }catch(error){
        return res.status(500).json({
            message : "server side error",
            error
        })
    }
}

export const fetchAllSavedRepos = async (req, res) => {

    try{
        // fetch all the repos from db usign the dates they were created.
        // providing the option to fetch using stars and forks order too.
        // using pagination to display result
        // return the response , i m a bit confused about this lets see what happens
    }catch(error){
        return res.status(500).json({
            message : "server side error",
            error
        })
    }
}

export const fetchTrendingRepos = async (req, res) => {

    try{
        // to fetch trending repos , we will fetch repos created in last 7 days with their starts or forks in ascending order.
        // display the result, i have to clear the api resutl for reducing the error of umpreidictive behaviour of api and predictive errors.
        // return the resutls of api as response.

    }catch(error){
        return res.status(500).json({
            message : "server side error",
            error
        })
    }
}

export const saveRepo = async (req, res) => {

    try{
        // take the details of repo from the req body
        // check if the same repo exists in the db or not ,
        // if not than save this repo in db with req fiels and info about it .
        // save the db
        // reuturn the newly created repo obj as response .

    }catch(error){
        return res.status(500).json({
            message : "server side error",
            error
        })
    }
}

export const unsaveRepo = async (req, res) => {

    try{

        // take the repo if or somethign to identify the repo in db , and find if it exists. 
        // if not return suitable error , and if it exists , then unsave it , delete it from the db.
        // save the db again.
    }catch(error){
        return res.status(500).json({
            message : "server side error",
            error
        })
    }
}