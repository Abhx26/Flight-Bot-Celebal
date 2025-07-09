const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  flight: { type: Object, required: true }, // Store flight details as an object
  paymentStatus: { type: String, enum: ['pending', 'paid', 'failed'], default: 'pending' },
  itinerary: { type: Object }, // Store itinerary details
}, { timestamps: true });

module.exports = mongoose.model('Booking', BookingSchema); 