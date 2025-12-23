const router = require("express").Router();
const {
  getAllTags,
  getTagById,
  createTag,
  updateTagById,
  deleteTagById,
} = require("../../controllers/tagsController");

// Set up GET all and POST at /api/tags
router.route("/").get(getAllTags).post(createTag);

// Set up GET one, PUT, and DELETE at /api/tags/:id
router.route("/:id").get(getTagById).put(updateTagById).delete(deleteTagById);

module.exports = router;
