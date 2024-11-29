/***************
 *	PRODUCT
 *		uuid
 *		name
 *		amount
 price
 *		expose
 *		pictures: 
 *		created_at: datetime()
 *		expires_at: datetime() + 30 days
****************/


/***
 *	PICTURE
 *		uuid
 *		path
 *		product_uuid
 */


// models/User.js

const { v4: uuidv4 } = require('uuid'); // Importation de la méthode pour générer un UUID
const mongoose = require('mongoose');

// Définir le schéma du modèle product
const productSchema = new mongoose.Schema({
	name: { type: String, required: true },
	uuid: { type: String, default: uuidv4, unique: true },
	amount: { type: Number, required: true, min: 0 },
	expose: { type: Boolean, default: false },
	price: { type: Float32Array, min: 0.10 },
	create_at: { type: Date, default: Date.now() },
	expires_at: {
		type: Date,
		default: function () {
			return new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // Ajouter 30 jours
		}
	}
});

module.exports = mongoose.model('Product', productSchema);
