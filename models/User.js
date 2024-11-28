// models/User.js

const { v4: uuidv4 } = require('uuid'); // Importation de la méthode pour générer un UUID
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Définir le schéma du modèle utilisateur
const userSchema = new mongoose.Schema({
	name: { type: String, required: true },
	email: { type: String, required: true, unique: true },
	password: { type: String, required: true },
	role: { type: String, default: 'user' },
	uuid: { type: String, default: uuidv4, unique: true },
	logged: {type: Boolean, required: true, default: false}
});

// hash password before insertion - filter
userSchema.pre('save', async function (next) {
	// if (!this.uuid) this.uuid = uuidv4();
	if (!this.isModified('password')) return next();
	this.password = await bcrypt.hash(this.password, 10);
	next();
});

// password verification when connection
userSchema.methods.matchPassword = async function (enteredPassword) {
	return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
