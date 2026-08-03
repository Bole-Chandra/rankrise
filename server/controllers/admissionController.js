const AdmissionForm = require('../models/AdmissionForm');
const { sendMail } = require('../utils/mailer');

// @desc    Submit Admission Form
// @route   POST /api/admissions
// @access  Public
const submitAdmission = async (req, res, next) => {
  try {
    const { name, father_name, phone, course, program, email, location } = req.body;

    if (!name || !father_name || !phone || !course || !program) {
      res.status(400);
      throw new Error('Please fill all required fields');
    }

    const admission = await AdmissionForm.create({
      name,
      father_name,
      phone,
      course,
      program,
      email,
      location
    });

    // Best-effort SMTP notification — never blocks or fails the submission.
    await sendMail({
      subject: `New Admission Application — ${name}`,
      replyTo: email || undefined,
      html: `
        <h2>New Admission Application</h2>
        <table border="1" cellpadding="10" cellspacing="0" style="border-collapse: collapse;">
          <tr>
            <td><strong>Student Name</strong></td>
            <td>${name}</td>
          </tr>
          <tr>
            <td><strong>Father Name</strong></td>
            <td>${father_name}</td>
          </tr>
          <tr>
            <td><strong>Phone</strong></td>
            <td>${phone}</td>
          </tr>
          <tr>
            <td><strong>Course</strong></td>
            <td>${course}</td>
          </tr>
          <tr>
            <td><strong>Program</strong></td>
            <td>${program}</td>
          </tr>
          <tr>
            <td><strong>Email</strong></td>
            <td>${email || 'Not Provided'}</td>
          </tr>
          <tr>
            <td><strong>Location</strong></td>
            <td>${location || 'Not Provided'}</td>
          </tr>
        </table>
      `,
    });

    res.status(201).json({
      success: true,
      message: 'Admission form submitted successfully',
      data: admission
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get All Admissions (Admin only)
// @route   GET /api/admissions
// @access  Private
const getAdmissions = async (req, res, next) => {
  try {
    const admissions = await AdmissionForm.find().sort({ createdAt: -1 });
    res.json(admissions);
  } catch (error) {
    next(error);
  }
};

// @desc    Update an admission's status (Pending / Reviewed / Accepted / Rejected)
// @route   PUT /api/admissions/:id
// @access  Private
const updateAdmissionStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const allowedStatuses = ['Pending', 'Reviewed', 'Accepted', 'Rejected'];

    if (!status || !allowedStatuses.includes(status)) {
      res.status(400);
      throw new Error(`Status must be one of: ${allowedStatuses.join(', ')}`);
    }

    const admission = await AdmissionForm.findById(req.params.id);
    if (!admission) {
      res.status(404);
      throw new Error('Admission not found');
    }

    admission.status = status;
    const updated = await admission.save();
    res.json(updated);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete an admission application
// @route   DELETE /api/admissions/:id
// @access  Private
const deleteAdmission = async (req, res, next) => {
  try {
    const admission = await AdmissionForm.findById(req.params.id);
    if (!admission) {
      res.status(404);
      throw new Error('Admission not found');
    }
    await admission.deleteOne();
    res.json({ message: 'Admission removed successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports = { submitAdmission, getAdmissions, updateAdmissionStatus, deleteAdmission };
