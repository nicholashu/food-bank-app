'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	geocoder = require('geocoder'),
	moment = require('moment');
	var ObjectId = mongoose.Types.ObjectId;

/**
 * Customer Schema
 */
var CustomerSchema = new Schema({
	// Section A - Identification and general information
	language: {
		type: String
	},
	lastName: {
		type: String,
		trim: true
	},
	firstName: {
		type: String,
		trim: true
	},
	middleName: {
		type: String,
		trim: true
	},
	address: {
		type: String,
		trim: true
	},
	apartmentNumber: {
		type: String,
		trim: true
	},
	buzzNumber: {
		type: Number
	},
	city: {
		type: String,
		trim: true
	},
	province: {
		type: String,
		trim: true
	},
	postalCode: {
		type: String,
		trim: true
	},
	telephoneNumber: {
		type: String,
		trim: true
	},
	mobileNumber: {
		type: String,
		trim: true
	},
	email: {
		type: String,
		trim: true
	},
	contactPreference: {
		type: String,
		trim: true
	},
	dateOfBirth: {
		type: Date
	},
	gender: {
		type: String
	},
	accommodationType: {
		type: String,
		trim: true
	},
	accommodationTypeOther: {
		type: String,
		trim: true
	},
	deliveryInstructions: {
		type: String,
		trim: true
	},
	jewish: {
		type: Boolean
	},
	jewishMovement: {
		type: String,
		trim: true
	},
	synagogue: {
		type: Boolean
	},
	synagogueName: {
		type: String,
		trim: true
	},
	kosher: {
		type: Boolean
	},
	assistanceInformation: {
		type: String,
		trim: true
	},
	dietaryRequest: {
		type: String,
		trim: true
	},
	generalNotes: {
		type: String,
		trim: true
	},

	// Section B - Employment
	employment: {
		workStatus: {
			type: String
		},
		hoursPerWeek: {
			type: Number
		},
		jobTitle: {
			type: String,
			trim: true
		}
	},

	// Section C - Food preferences
	foodPreferences: [
		Schema.Types.ObjectId
	],
	foodPreferencesOther: {
		type: String,
		trim: true
	},

	// Section D - Financial assessment
	financialAssessment: {
		income: [],
		expenses: []
	},

	// Section E - Dependants and people in household
	household: [{
		name: {
			type: String,
			trim: true
		},
		relationship: {
			type: String,
			trim: true
		},
		dateOfBirth: {
			type: Date
		}
	}],

	// Liability waiver agreement and signature
	disclaimerAgree: {
		type: Boolean
	},
	disclaimerSign: {
		type: String,
		trim: true
	},

	// Geolocation
	location: [Number],

	// Current status of application
	status: {
		type: String,
		enum: ['Accepted', 'Rejected', 'Pending', 'Inactive'],
		default: 'Pending'
	},

	// Food package and delivery information
	lastPacked: {
		type: Date
	},
	lastDelivered: {
		type: Date
	},
	assignedTo: {
		type: Number,
		ref: 'Volunteer'
	},

	// Application specific information
	_id: {
		type: Schema.Types.Mixed,
		default: function () { return new ObjectId();},
		ref: 'User'
	},
	dateReceived: {
		type: Date,
		default: Date.now
	},
	manualAdd: {
		type: Boolean,
	},
},
	// Mongoose options
	{ strict: false }
);

/**
 * Hook a pre save method to construct the geolocation of the address
 */
CustomerSchema.pre('save', function(next) {
	var doc = this;
	var address = doc.address + doc.city + doc.province;

	geocoder.geocode(address, function(err, data) {
		if (data && data.status === 'OK') {
			var location = [];
			location[0] = data.results[0].geometry.location.lng;
			location[1] = data.results[0].geometry.location.lat;
			doc.location = location;
		}

		next();
	});
});

/**
 * Virtual getters & setters
 */
CustomerSchema.virtual('fullName').get(function() {
	var fullName = this.firstName ? this.firstName + ' ' : '';
	fullName += this.middleName ? this.middleName + ' ' : '';
	fullName += this.lastName ? this.lastName : '';
	return fullName;
});

CustomerSchema.virtual('fullAddress').get(function() {
	var fullAddress = this.address ? this.address + ' ' : '';
	fullAddress += this.apartmentNumber ? 'APT ' + this.apartmentNumber + ' ' : '';
	fullAddress += this.city ? this.city + ' ' : '';
	fullAddress += this.province ? this.province + ' ' : '';
	fullAddress += this.postalCode ? this.postalCode + ' ' : '';
	fullAddress += this.buzzNumber ? '#' + this.buzzNumber : '';
	return fullAddress;
});

CustomerSchema.virtual('householdSummary').get(function() {
	var householdSummary = 'None';

	if (this.household.length) {
		householdSummary = '#' + this.household.length + ' -';
		this.household.forEach(function(dependant) {
			var ageInYears = moment().diff(dependant.dateOfBirth, 'years');
			householdSummary += ' ';
			householdSummary += ageInYears ? ageInYears + 'y' : moment().diff(dependant.dateOfBirth, 'months') + 'm';
		});
	}
	return householdSummary;
});

/**
 * Schema options
 */
CustomerSchema.set('toJSON', {virtuals: true});

mongoose.model('Customer', CustomerSchema);
