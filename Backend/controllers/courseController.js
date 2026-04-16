const Course = require("../models/course");

// ADD COURSE
const addCourse = async (req, res) => {
  try {
    const { title } = req.body;

    const course = new Course({ title });
    await course.save();

    res.json({ message: "Course Added ✅", course });
  } catch (err) {
    res.status(500).json({ message: "Error ❌" });
  }
};

// GET COURSES
const getCourses = async (req, res) => {
  try {
    const courses = await Course.find();
    res.json(courses);
  } catch (err) {
    res.status(500).json({ message: "Error ❌" });
  }
};

module.exports = { addCourse, getCourses };