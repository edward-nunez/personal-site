const { tags } = require("../models");

const tagsController = {
  // Get all tags
  getAllTags(req, res) {
    tags
      .find({})
      .select("-__v")
      .then((dbTagsData) => res.json(dbTagsData))
      .catch((err) => {
        console.log(err);
        res.status(400).json(err);
      });
  },

  // Get a project by id
  getTagById({ params }, res) {
    tags
      .findOne({ _id: params.id })
      .select("-__v")
      .then((dbTagData) => {
        // If no tag is found, send 404
        if (!dbTagData) {
          res.status(404).json({ message: "No tag found with this id!" });
          return;
        }
        res.json(dbTagData);
      })
      .catch((err) => {
        console.log(err);
        res.status(400).json(err);
      });
  },

  // Create a new project
  createTag({ body }, res) {
    tags
      .create(body)
      .then((dbTagData) => res.json(dbTagData))
      .catch((err) => res.status(400).json(err));
  },

  // Update project by id
  updateTagById({ params, body }, res) {
    tags
      .findOneAndUpdate({ _id: params.id }, body, {
        new: true,
        runValidators: true,
      })
      .then((dbTagData) => {
        if (!dbTagData) {
          res.status(404).json({ message: "No tag found with this id!" });
          return;
        }
        res.json(dbTagData);
      })
      .catch((err) => res.status(400).json(err));
  },

  // Delete project
  deleteTagById({ params }, res) {
    tags
      .findOneAndDelete({ _id: params.id })
      .then((dbTagData) => {
        if (!dbTagData) {
          res.status(404).json({ message: "No tag found with this id!" });
          return;
        }
        res.json(dbTagData);
      })
      .catch((err) => res.status(400).json(err));
  },
};

module.exports = tagsController;
