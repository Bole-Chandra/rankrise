const Enquiry = require('../models/Enquiry');
const { sendMail } = require('../utils/mailer');

// @desc    Submit Enquiry Form (Quick Enquiry sidebar and Contact Page form)
// @route   POST /api/contact
// @access  Public
const submitEnquiry = async (req, res, next) => {
  try {
    const {
      name,
      father_name,
      phone,
      course,
      program,
      email,
      location,
      source,
    } = req.body;

    if (!name || !phone || !father_name || !course || !program) {
      res.status(400);
      throw new Error('Name, Father Name, Phone, Course, and Program are required');
    }

    // Save enquiry to MongoDB first — this must succeed regardless of
    // whether the notification email goes out.
    const enquiry = await Enquiry.create({
      name,
      father_name,
      phone,
      course,
      program,
      email,
      location,
      source: source || 'General Enquiry',
    });

    // Best-effort SMTP notification — never blocks or fails the submission.
    await sendMail({
      subject: `New Website Enquiry — ${name}`,
      replyTo: email || undefined,
      html: `
        <h2>New Website Enquiry</h2>
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
          <tr>
            <td><strong>Source</strong></td>
            <td>${source || 'General Enquiry'}</td>
          </tr>
        </table>
      `,
    });

    res.status(201).json({
      success: true,
      message: 'Enquiry submitted successfully',
      data: enquiry,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get All Enquiries (Admin only)
// @route   GET /api/contact
// @access  Private
const getEnquiries = async (req, res, next) => {
  try {
    const enquiries = await Enquiry.find().sort({ createdAt: -1 });
    res.json(enquiries);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete an enquiry
// @route   DELETE /api/contact/:id
// @access  Private
const deleteEnquiry = async (req, res, next) => {
  try {
    const enquiry = await Enquiry.findById(req.params.id);
    if (!enquiry) {
      res.status(404);
      throw new Error('Enquiry not found');
    }
    await enquiry.deleteOne();
    res.json({ message: 'Enquiry removed successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports = { submitEnquiry, getEnquiries, deleteEnquiry };
