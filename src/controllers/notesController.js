const notesModel= require("../models/note")

const jwt = require("jsonwebtoken")


const createNotes= async(req,res)=>{        // To create a new note
    
    const {title, description} = req.body

    const newNote = new notesModel({
        title: title,
        description: description,
        userId : req.userId             // During "auth" we created this property "req.userId" for "req" object, so that we can
                                        // store the unique "ID" of a user ... , so, because of this, during authentication
                                        // it is known who the user is... and here we know who the user is using this property:)
    })

    try{
        await newNote.save()                // To save the newNote on the MongoDB database.., whenever
                                // we interact with DB, we use "await" function
        res.status(201).json(newNote)
    }catch(error){
        console.log(error)
        res.status(500).json({message:"Something went wrong..."})
    }
}

const getNotes= async(req, res)=>{

    try{
        const notes= await notesModel.find({userId: req.userId})
        res.status(200).json(notes)
    }
    catch(error){
        console.log(error)
        res.status(500).json({message:"Something went wrong..."})
    }
}


const updateNotes = async (req, res) => {

    const id = req.params.id;                       // Remember the "/:id" we gave in "notesRoutes"..
                                                    // req.params.id   is that string basically :) which means it is the " _id "
                                                    // of that particular note we want to update
    const { title, description } = req.body;

    try {
        const updatedNote = await notesModel.findByIdAndUpdate(
            id,
            { title, description }, // Update only the relevant fields, rest all fields will remain same :)
            { new: true }
        );

        res.status(200).json(updatedNote);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Something went wrong..." });
    }
};




const deleteNotes = async (req, res) => {
    const id = req.params.id;

    try {
        const note = await notesModel.findByIdAndDelete(id);
        if (!note) {
            // If note with the specified ID does not exist
            return res.status(404).json({ message: "Note not found" });
        }
        res.status(202).json(note);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Something went wrong..." });
    }
};




module.exports= {createNotes, updateNotes, deleteNotes, getNotes}
