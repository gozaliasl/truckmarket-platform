import React, { useState } from 'react';
import './Contact.css';

function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Contact form submitted:', formData);
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 5000);
    setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
  };

  return (
    <div className="contact-page">
      <div className="contact-hero">
        <div className="container">
          <h1>Contact Us</h1>
          <p>We're here to help and answer any question you might have</p>
        </div>
      </div>

      <div className="container contact-content">
        <div className="contact-grid">
          <div className="contact-info">
            <h2>Get in Touch</h2>
            <p>Have a question or need assistance? Reach out to our team.</p>

            <div className="contact-methods">
              <div className="contact-method">
                <div className="method-icon">📧</div>
                <h3>Email</h3>
                <p>support@truckmarket.com</p>
                <p>sales@truckmarket.com</p>
              </div>

              <div className="contact-method">
                <div className="method-icon">📞</div>
                <h3>Phone</h3>
                <p>+1 (555) 123-4567</p>
                <p>Mon-Fri: 9am - 6pm EST</p>
              </div>

              <div className="contact-method">
                <div className="method-icon">📍</div>
                <h3>Office</h3>
                <p>123 Truck Avenue</p>
                <p>New York, NY 10001, USA</p>
              </div>

              <div className="contact-method">
                <div className="method-icon">💬</div>
                <h3>Live Chat</h3>
                <p>Available Mon-Fri</p>
                <p>9am - 6pm EST</p>
              </div>
            </div>
          </div>

          <div className="contact-form-section">
            <h2>Send us a Message</h2>

            {submitted && (
              <div className="success-message">
                Thank you! Your message has been sent successfully.
              </div>
            )}

            <form onSubmit={handleSubmit} className="contact-form">
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="name">Full Name *</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="email">Email Address *</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="phone">Phone Number</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="subject">Subject *</label>
                  <select
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select a subject</option>
                    <option value="general">General Inquiry</option>
                    <option value="support">Technical Support</option>
                    <option value="sales">Sales Question</option>
                    <option value="partnership">Partnership</option>
                    <option value="feedback">Feedback</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="message">Message *</label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows="6"
                  required
                  placeholder="Tell us how we can help you..."
                ></textarea>
              </div>

              <button type="submit" className="btn btn-primary submit-btn">
                Send Message
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Contact;
