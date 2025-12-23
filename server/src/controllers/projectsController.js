const { projects, tags } = require("../models");

const projectsController = {
  // Get all projects
  getAllProjects(req, res) {
    projects
      .find({})
      .populate({
        path: "tags",
        select: "-__v",
      })
      .select("-__v")
      .sort({ _id: -1 })
      .then((dbProjectsData) => res.json(dbProjectsData))
      .catch((err) => {
        console.log(err);
        res.status(400).json(err);
      });
  },

  // Get a project by id
  getProjectById({ params }, res) {
    projects
      .findOne({ _id: params.id })
      .populate({
        path: "tags",
        select: "-__v",
      })
      .select("-__v")
      .then((dbProjectsData) => {
        // If no project is found, send 404
        if (!dbProjectsData) {
          res.status(404).json({ message: "No project found with this id!" });
          return;
        }
        res.json(dbProjectsData);
      })
      .catch((err) => {
        console.log(err);
        res.status(400).json(err);
      });
  },

  // Create a new project
  createProject({ body }, res) {
    projects
      .create(body)
      .then((dbProjectData) => {
        res.json(dbProjectData);
      })
      .catch((err) => res.status(400).json(err));
  },

  // Update project by id
  updateProjectById({ params, body }, res) {
    projects
      .findOneAndUpdate({ _id: params.id }, body, {
        new: true,
        runValidators: true,
      })
      .then((dbProjectData) => {
        if (!dbProjectData) {
          res.status(404).json({ message: "No project found with this id!" });
          return;
        }
        res.json(dbProjectData);
      })
      .catch((err) => res.status(400).json(err));
  },

  // Delete project
  deleteProjectById({ params }, res) {
    projects
      .findOneAndDelete({ _id: params.id })
      .then((dbProjectData) => {
        if (!dbProjectData) {
          res.status(404).json({ message: "No project found with this id!" });
          return;
        }
        res.json(dbProjectData);
      })
      .catch((err) => res.status(400).json(err));
  },

  // add tag
  addTag({ params, body }, res) {
    projects
      .findByIdAndUpdate(
        { _id: params.id },
        { $push: { tags: body } },
        { new: true, runValidators: true }
      )
      .then((dbTagData) => {
        if (!dbTagData) {
          res.status(404).json({ message: "No tag found with this id!" });
          return;
        }
        res.json(dbTagData);
      })
      .catch((err) => res.json(err));
  },

  // remove tag
  removeTag({ params }, res) {
    projects
      .findOneAndUpdate(
        { _id: params.id },
        { $pull: { tags: { tagId: params.tagId } } },
        { new: true }
      )
      .then((dbTagData) => res.json(dbTagData))
      .catch((err) => res.json(err));
  },
};

module.exports = projectsController;
