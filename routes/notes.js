const express = require("express");
const router = express.Router();
const fetchuser = require("../middleware/fetchuser");
const Notes = require("../models/Notes");
const { validationResult, body } = require("express-validator");

// ROUTE 1 ==>>> GET ALL THE NOTES  : GET "/api/notes/fetchallnotes". LOG IN REQ

router.get("/fetchallnotes", fetchuser, async (req, res) => {
  try {
    const notes = await Notes.find({ user: req.user.id });

    res.json(notes);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error: "Internal Server Error",
      message: error.message,
    });
  }
});
// ROUTE 2 ==>>> ADD  NEW  NOTES  : POST "/api/notes/addnotes". LOG IN REQ

router.post(
  "/addnote",
  fetchuser,
  [
    body("title", "Add a title").isLength({ min: 3 }),
    body(
      "description",
      "Please write something here of minimum 5 characteristics "
    ).isLength({ min: 5 }),
  ],
  async (req, res) => {
    try {
      const { title, description, tag } = req.body;

      //  const notes = await Notes.find({user: req.user.id});
      const result = validationResult(req);
      if (!result.isEmpty()) {
        return res.status(400).json({ errors: result.array() });
      }
      const note = await new Notes({
        title,
        description,
        tag,
        user: req.user.id,
      }).save();

      res.json(note);
    } catch (err) {
      console.log(err);
      res.status(500).json({
        error: "Internal Server Error",
        message: err.message,
      });
    }
  }
);

// ROUTE 3 ==>>> UPDATE EXISTING  NOTES  : PUT "/api/notes/addnotes". LOG IN REQ
router.put(
  "/updatenote/:id",
  fetchuser,
  // [
  //   body("title", "Add a title").isLength({ min: 3 }),
  //   body(
  //     "description",
  //     "Please write something here of minimum 5 characteristics "
  //   ).isLength({ min: 5 }),
  // ],
  async (req, res) => {
    try {
      const { title, description, tag } = req.body;

      //  const notes = await Notes.find({user: req.user.id});
      // const result = validationResult(req);
      // if (!result.isEmpty()) {
      //   return res.status(400).json({ errors: result.array() });
      // }
      // const note = await new Notes({
      //   title,
      //   description,
      //   tag,
      //   user: req.user.id,
      // }).save();

      // res.json(note);
      //CREATE A NEW NOTE
      const newnote = {};
      if (title) {
        newnote.title = title;
      }
      if (description) {
        newnote.description = description;
      }
      if (tag) {
        newnote.tag = tag;
      }

      // FIND THE NOTE TO BE UPDATED
      let note = await Notes.findById(req.params.id);
      if (!note) {
        return res.status(404).send("Note not found");
      }
      if (note.user.toString() !== req.user.id) {
        return res.status(401).send("NOT ALLOWED");
      }
      note = await Notes.findByIdAndUpdate(
        req.params.id,
        { $set: newnote },
        { new: true }
      );
      res.json({ note });
    } catch (err) {
      console.log(err);
      res.status(500).json({
        error: "Internal Server Error",
        message: err.message,
      });
    }
  }
);
// ROUTE 4 ==>>> delete EXISTING  NOTES  : DELETE "/api/notes/deletenote". lOG IN REQUIRED
router.delete(
  "/deletenote/:id",
  fetchuser,
  // [
  //   body("title", "Add a title").isLength({ min: 3 }),
  //   body(
  //     "description",
  //     "Please write something here of minimum 5 characteristics "
  //   ).isLength({ min: 5 }),
  // ],
  async (req, res) => {
    try {
    //   const { title, description, tag } = req.body;

      //  const notes = await Notes.find({user: req.user.id});
      // const result = validationResult(req);
      // if (!result.isEmpty()) {
      //   return res.status(400).json({ errors: result.array() });
      // }
      // const note = await new Notes({
      //   title,
      //   description,
      //   tag,
      //   user: req.user.id,
      // }).save();

      // res.json(note);
      //NO NEED TO  CREATE A NEW NOTE
      // const newnote={};
      // if(title) { newnote.title=title};
      // if(description) { newnote.description=description};
      // if(tag) { newnote.tag=tag};

      // FIND THE NOTE TO BE DELETED
      let note = await Notes.findById(req.params.id);
      if (!note) {
        return res.status(404).send("Note not found");
      }
      // ALLOW DELETION IF USER OWNS THIS NOTE
      if (note.user.toString() !== req.user.id) {
        return res.status(401).send("nikal lawde, allow nahi ho tum");
      }
      note = await Notes.findByIdAndDelete(req.params.id);
      res.json({ Success: " Note has been deleted", note: note });
    } catch (err) {
      console.log(err);
      res.status(500).json({
        error: "Internal Server Error",
        message: err.message,
      });
    }
  }
);

module.exports = router;
