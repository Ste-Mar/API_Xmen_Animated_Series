const express = require('express');
const router = express.Router();
const Episode = require('../models/Episode');

//Labels for pagination
const myCustomLabels = {
    totalDocs: 'count',
    docs: 'results',
    nextPage: 'next',
    prevPage: 'prev',
    totalPages: 'pageCount',
    pagingCounter: false,
    meta: 'info',
    hasNextPage: false,
    hasPrevPage: false,
};
//Matching (SXXEXX) regex
const regex = /\w{1}\d{2}/gi;

const capitalize = (s) => {
    return s.charAt(0).toUpperCase() + s.slice(1).toLowerCase()
   }
const capNumber = (s) => {
    return s.charAt(0).toUpperCase() + s.slice(1,3).toLowerCase()  + s.charAt(3).toUpperCase() + s.slice(4).toLowerCase()
}

//Get ALL the POSTS and queries searchs

router.get('/', async (req, res) => {
    try {
        // Pagination with query
        const { page, perPage, number } = req.query;
        // Options for pagination
        const options = {
            page: parseInt(page, 10) || 1,
            limit: parseInt(perPage, 10) || 20,
            select: '-__v -_id',
            customLabels: myCustomLabels,
            sort: {id: 1},
            lean: true,
        };
        

        if(number && number.split(" ").join("").length===3){
        let numbers = number.match(regex);
        allNumbers = new Array();
        numbers.forEach(element => {
            allNumbers.push({number:  {$regex : String(capitalize(element))}});
        })
        const episodes = await Episode.paginate({$or : allNumbers}, options);
        let pageNumber = episodes.info.page;
        episodes.info.next !== null ? episodes.info.next = `https://xmenapiheroku.herokuapp.com/api/episodes?number=${number.split(" ").join("")}&page=${pageNumber+1}`: null,
        episodes.info.prev !== null ? episodes.info.prev = `https://xmenapiheroku.herokuapp.com/api/episodes?number=${number.split(" ").join("")}&page=${pageNumber-1}`: null,
        res.json(episodes);
    
        } else if(number && number.split(" ").join("").length===6) {
        const query = {
            number: capNumber(number.split(" ").join(""))
        }            
        const episode = await Episode.findOne(query,{_id:0, __v:0}).lean();
        res.json(episode);
        } else {
        const episodes = await Episode.paginate({}, options);
        let pageNumber = episodes.info.page;
        episodes.info.next !== null ? episodes.info.next = `https://xmenapiheroku.herokuapp.com/api/episodes?page=${pageNumber+1}`: null,
        episodes.info.prev !== null ? episodes.info.prev = `https://xmenapiheroku.herokuapp.com/api/episodes?page=${pageNumber-1}`: null,
        res.json(episodes);
        }; 

    } 
    catch(err) {
        res.json({message:err});
    }
});

//Upload POST
router.post('/', async (req,res) => {
    const episode = new Episode({
        title: req.body.title,
        number: req.body.number,
        air_date: req.body.air_date,
        episodes: req.body.episodes,
        plot: req.body.plot
    });
    console.log(episode);
    try {
       const savedEpisode = await episode.save()
        res.json(savedEpisode); 
    } 
    catch(err) {
        res.json({message:err});
    }
    
});

//Search POST by ID
router.get('/:episodeID', async (req,res) => {
    try {
        const query = {
            id:req.params.episodeID
        }
        const episode = await Episode.findOne(query,{_id:0, __v:0}).lean(); // (query, options);
        res.json(episode);
    } 
    catch(err) {
        res.json({message:err});
    }
});


//Delete POST
router.delete('/:episodeID', async (req, res) => {
    try {
        const episodeRemoved = await Episode.deleteOne({ _id: req.params.episodeID });
        res.json(episodeRemoved);
    }
    catch(err) {
        res.json({message:err});
    }
});

//Update POST
router.patch('/:episodeID', async (req,res)=>{
    console.log(`Editing item: ID: ${req.params.episodeID} to be title:"${req.body.title}", "${req.body.number}", "${req.body.air_date}, "${req.body.plot}".`);
    try {
    const updatedEpisode=await Episode.updateOne(
      {_id:req.params.episodeID},
      {$set: req.body});
      res.json(updatedEpisode);
    }
    catch(err) {
      res.json({message:err});
    }
});


module.exports = router;