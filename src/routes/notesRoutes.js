const express= require("express")
const auth = require("../middleware/auth")
const noteRouter = express.Router()
const {createNotes, updateNotes, deleteNotes, getNotes}= require("../controllers/notesController")

noteRouter.post("/", auth, createNotes)     
    
noteRouter.put("/:id", auth, updateNotes)

noteRouter.delete("/:id", auth, deleteNotes)

noteRouter.get("/", auth, getNotes)

module.exports= noteRouter