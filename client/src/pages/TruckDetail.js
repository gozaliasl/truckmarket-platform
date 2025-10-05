import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import './TruckDetail.css';

function TruckDetail() {
  const { id } = useParams();
  const [truck, setTruck] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showContactForm, setShowContactForm] = useState(false);
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  const [submitSuccess, setSubmitSuccess] = useState(false);

  useEffect(() => {
    fetchTruckDetail();
  }, [id]);

  const fetchTruckDetail = async () => {
    try {
      const response = await axios.get(`/api/trucks/${id}`);
      setTruck(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to load truck details');
      console.error('Error fetching truck:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price, currency) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency || 'EUR',
      minimumFractionDigits: 0
    }).format(price);
  };

  const formatMileage = (mileage) => {
    return new Intl.NumberFormat('en-US').format(mileage) + ' km';
  };

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/contacts', {
        truck_id: id,
        ...contactForm
      });
      setSubmitSuccess(true);
      setContactForm({ name: '', email: '', phone: '', message: '' });
      setTimeout(() => {
        setSubmitSuccess(false);
        setShowContactForm(false);
      }, 3000);
    } catch (err) {
      console.error('Error submitting contact form:', err);
    }
  };

  if (loading) return <div className="loading">Loading truck details...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!truck) return <div className="error">Truck not found</div>;

  return (
    <div className="truck-detail">
      <div className="container">
        <Link to="/" className="back-link">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M12 5l-5 5 5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          Back to listings
        </Link>

        <div className="detail-grid">
          <div className="detail-main">
            <div className="detail-image">
              <img src={truck.image_url} alt={truck.title} />
              <div className="detail-badge">{truck.condition}</div>
            </div>

            <div className="detail-content">
              <h1>{truck.title}</h1>

              <div className="detail-price-section">
                <div className="detail-price">{formatPrice(truck.price, truck.currency)}</div>
                <div className="detail-meta">
                  <span className="meta-item">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M7 13c3-3 5-5.5 5-8a5 5 0 0 0-10 0c0 2.5 2 5 5 8z" stroke="#6b7280" strokeWidth="1.5"/>
                    </svg>
                    {truck.location}, {truck.country}
                  </span>
                  <span className="meta-item">ID: {truck.id}</span>
                </div>
              </div>

              <div className="detail-specs">
                <h2>Specifications</h2>
                <div className="specs-grid">
                  <div className="spec-item">
                    <span className="spec-label">Brand</span>
                    <span className="spec-value">{truck.brand}</span>
                  </div>
                  <div className="spec-item">
                    <span className="spec-label">Model</span>
                    <span className="spec-value">{truck.model}</span>
                  </div>
                  <div className="spec-item">
                    <span className="spec-label">Year</span>
                    <span className="spec-value">{truck.year}</span>
                  </div>
                  <div className="spec-item">
                    <span className="spec-label">Mileage</span>
                    <span className="spec-value">{formatMileage(truck.mileage)}</span>
                  </div>
                  <div className="spec-item">
                    <span className="spec-label">Engine Power</span>
                    <span className="spec-value">{truck.engine_power} HP</span>
                  </div>
                  <div className="spec-item">
                    <span className="spec-label">Transmission</span>
                    <span className="spec-value">{truck.transmission}</span>
                  </div>
                  <div className="spec-item">
                    <span className="spec-label">Fuel Type</span>
                    <span className="spec-value">{truck.fuel_type}</span>
                  </div>
                  <div className="spec-item">
                    <span className="spec-label">Axle Config</span>
                    <span className="spec-value">{truck.axle_configuration}</span>
                  </div>
                  <div className="spec-item">
                    <span className="spec-label">Color</span>
                    <span className="spec-value">{truck.color}</span>
                  </div>
                  <div className="spec-item">
                    <span className="spec-label">Category</span>
                    <span className="spec-value">{truck.category}</span>
                  </div>
                </div>
              </div>

              <div className="detail-description">
                <h2>Description</h2>
                <p>{truck.description}</p>
              </div>
            </div>
          </div>

          <div className="detail-sidebar">
            <div className="seller-card">
              <h3>Seller Information</h3>
              <div className="seller-info">
                <div className="seller-name">{truck.seller_name}</div>
                <div className="seller-detail">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M10 3.5A4.5 4.5 0 0 1 5.5 8H4a6 6 0 1 0 6 6v-1.5A4.5 4.5 0 0 1 10 3.5z" stroke="#6b7280" strokeWidth="1.5"/>
                  </svg>
                  <a href={`tel:${truck.seller_phone}`}>{truck.seller_phone}</a>
                </div>
                <div className="seller-detail">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M2 4l6 4 6-4M2 4v8h12V4" stroke="#6b7280" strokeWidth="1.5"/>
                  </svg>
                  <a href={`mailto:${truck.seller_email}`}>{truck.seller_email}</a>
                </div>
              </div>

              <div className="contact-actions">
                <button className="btn btn-primary full-width" onClick={() => setShowContactForm(!showContactForm)}>
                  {showContactForm ? 'Hide Contact Form' : 'Send Message'}
                </button>
                <a href={`tel:${truck.seller_phone}`} className="btn btn-secondary full-width">
                  Call Seller
                </a>
              </div>

              {showContactForm && (
                <form className="contact-form" onSubmit={handleContactSubmit}>
                  <h4>Contact Seller</h4>
                  {submitSuccess && (
                    <div className="success-message">Message sent successfully!</div>
                  )}
                  <input
                    type="text"
                    placeholder="Your Name"
                    value={contactForm.name}
                    onChange={(e) => setContactForm({...contactForm, name: e.target.value})}
                    required
                  />
                  <input
                    type="email"
                    placeholder="Your Email"
                    value={contactForm.email}
                    onChange={(e) => setContactForm({...contactForm, email: e.target.value})}
                    required
                  />
                  <input
                    type="tel"
                    placeholder="Your Phone"
                    value={contactForm.phone}
                    onChange={(e) => setContactForm({...contactForm, phone: e.target.value})}
                  />
                  <textarea
                    placeholder="Your Message"
                    rows="4"
                    value={contactForm.message}
                    onChange={(e) => setContactForm({...contactForm, message: e.target.value})}
                    required
                  ></textarea>
                  <button type="submit" className="btn btn-primary full-width">
                    Send Message
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TruckDetail;
