const { Schema, model } = require('mongoose');

const projectSchema = new Schema(
  {
    title: {
      type: String,
      trim: true,
      required: true,
    },
    titleImage: {
      type: String,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    liveSite: {
      type: String,
      trim: true,
    },
    criteria: {
      type: String,
      trim: true,
    },
    results: {
      type: String,
      trim: true,
    },
    tags: [
      {
        type: Schema.Types.ObjectId,
        ref: 'tags',
      },
    ],
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
      },
    },
  }
);

const projects = model('projects', projectSchema);

module.exports = projects;
