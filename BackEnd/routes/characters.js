const express = require('express');
const router = express.Router();
const Character = require('../models/Character');

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

const capitalize = (s) => {
    return s.charAt(0).toUpperCase() + s.slice(1).toLowerCase()
  }

//Get ALL the POSTS and queries searchs
router.get('/', async (req, res) => {
    try {
        // Pagination with query
        const { page, perPage, name } = req.query;
        // Options for pagination
        const options = {
            page: parseInt(page, 10) || 1,
            limit: parseInt(perPage, 10) || 20,
            select: '-__v -_id',
            customLabels: myCustomLabels,
            sort: {id: 1},
            lean: true,
        };
        
        if(name){
        let names = name.split(" ");
        allNames = new Array();
        names.forEach(element => {
         allNames.push({name: {$regex : String(capitalize(element))}}, {alias: {$regex : String(capitalize(element))}});
        })
        const characters = await Character.paginate({$or : allNames}, options);
        let pageNumber = characters.info.page;
        characters.info.next !== null ? characters.info.next = `https://xmenapiheroku.herokuapp.com/api/characters?page=${pageNumber+1}`: null,
        characters.info.prev !== null ? characters.info.prev = `https://xmenapiheroku.herokuapp.com/api/characters?page=${pageNumber-1}`: null,
        res.json(characters);

        } else {

        const characters = await Character.paginate({}, options);
        let pageNumber = characters.info.page;
        characters.info.next !== null ? characters.info.next = `https://xmenapiheroku.herokuapp.com/api/characters?page=${pageNumber+1}`: null,
        characters.info.prev !== null ? characters.info.prev = `https://xmenapiheroku.herokuapp.com/api/characters?page=${pageNumber-1}`: null,
        res.json(characters);
        };
        
    } 
    catch(err) {
        res.json({message:err});
    }
});


//Upload POST
router.post('/', async (req,res) => {
    const character = new Character({
        name: req.body.name,
        alias: req.body.alias,
        description: req.body.description,
        powers: req.body.powers,
        img: req.body.img,
        affiliation: req.body.affiliation,
    });
    console.log(character);
    try {
       const savedCharacter = await character.save()
        res.json(savedCharacter); 
    } 
    catch(err) {
        res.json({message:err});
    }

});

//Search POST by ID
router.get('/:characterID', async (req, res) => {
    try {
        const query = {
            id:req.params.characterID
        }
        const characters = await Character.findOne(query,{_id:0, __v:0}).lean(); // (query, options);
        res.json(characters);
    } 
    catch(err) {
        res.json({message:err});
    }
});

//Delete POST
router.delete('/:characterID', async (req, res) => {
    try {
        const characterRemoved = await Character.deleteOne({ _id: req.params.characterID });
        res.json(characterRemoved);
    }
    catch(err) {
        res.json({message:err});
    }
});

//Update POST
router.patch('/:characterID', async (req,res)=>{
    try {
    const updatedCharacter=await Character.updateOne(
      {_id:req.params.characterID},
      {$set: req.body});
      res.json(updatedCharacter);
    console.log(`Editing item: ID: ${req.params.characterID} to be:"${req.body}"`);
    }
    catch(err) {
      res.json({message:err});
    }
});

module.exports = router;