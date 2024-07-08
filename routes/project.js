// routes/project.js
const express = require('express');
const { check, validationResult } = require('express-validator');
const auth = require('../middleware/auth');
const Project = require('../models/Project');
const router = express.Router();

// @route POST /api/project
// @desc Create a new project
// @access Private
router.post(
  '/',
  [
    auth,
    [
      check('projectTheme', 'Project Theme is required').not().isEmpty(),
      check('reason', 'Reason is required').not().isEmpty(),
      check('type', 'Type is required').not().isEmpty(),
      check('division', 'Division is required').not().isEmpty(),
      check('category', 'Category is required').not().isEmpty(),
      check('priority', 'Priority is required').not().isEmpty(),
      check('department', 'Department is required').not().isEmpty(),
      check('location', 'Location is required').not().isEmpty(),
      check('startDate', 'Start Date is required').isISO8601(),
      check('endDate', 'End Date is required').isISO8601(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      projectTheme,
      reason,
      type,
      division,
      category,
      priority,
      department,
      location,
      startDate,
      endDate,
      status,
    } = req.body;

    if (new Date(startDate) > new Date(endDate)) {
      return res.status(400).json({ msg: 'Start Date should be less than End Date' });
    }
    console.log('Request received:', req.body);
    try {
      const newProject = new Project({
        projectTheme,
        reason,
        type,
        division,
        category,
        priority,
        department,
        location,
        startDate,
        endDate,
        status,
        user: req.user.id,
      });

      const project = await newProject.save();
      res.json(project);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  }
);

router.get('/',auth, async (req, res) => {
  try {
    const projects = await Project.find({ user: req.user.id });
    res.json(projects);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

router.put('/:projectId', async (req, res) => {
  const projectId = req.params.projectId;
  const { status } = req.body;

  try {
    // Assuming you have a Project model or similar
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    // Update the project status
    project.status = status;
    await project.save();

    // Respond with updated project
    res.json(project);
  } catch (error) {
    console.error('Error updating project:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;

