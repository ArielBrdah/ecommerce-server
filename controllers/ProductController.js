const User = require("../models/Product");
const User = require("../models/User");
const dotenv = require('dotenv');

class ProductsController {

	static async add(req, res) {
		dotenv.config();

		const product = req.body;

		try {
			const productExists = await Product.findOne({ name: product.name });
			if (productExists) return res.status(400).json({ message: 'Product already exists' });

			const newProduct = new User(product);
			await newProduct.save();

			
			res.status(201).json({ message: "Product Added with success!" });
		} catch (error) {
			res.status(500).json({ message: 'Server error' });
		}
	}

	static async remove(req, res) {
		let { uuid } = req.params


		try {
			const product = await Product.findOne({ uuid })
			if (!product) return res.status(404).json({ message: 'Product not Found' })

			const requester = await User.findOne({ _id: req.user })
			if (requester.role !== 'admin') {
				return res.status(403).json({ message: 'You are not authorized to delete this product' })
			}

			await Product.findOneAndDelete({ uuid })
			res.status(200).json({ message: 'Product deleted successfully' })

		} catch (error) {
			console.log('Error deleting product:', error)
			res.status(500).json({ message: 'Server error' })
		}

	}

	static async update(req, res) {
		let { uuid } = req.params
	
		try {
			const product = await Product.findOne({ uuid })
			if (!product) return res.status(404).json({ message: 'Prpduct not Found' })
	
				
			const requester = await User.findOne({_id: req.user})
			if (requester.role !== 'admin') {
				return res.status(403).json({ message: 'You are not authorized to modify this Product' })
			}
			
			if (name) product.name = name;
	
			await product.save()
	
			res.status(200).json({message: 'Product updated successfully: ',product})
	
		} catch (error) {
			console.log('Error updating product:',error)
			res.status(500).json({message: 'Server error'})
		}
	
	}

	static async all(req,res) {
		try {
			const products = await Product.find();
			res.status(200).json(products)
		} catch (error) {
			console.log('Error getting all product:',error)
			res.status(500).json({message: 'Server error'})
		}
	}

	static async find(req,res) {
		const { uuid } = req.params
		try {
			const products = await Product.findOne({uuid});
			res.status(200).json(products)
		} catch (error) {
			console.log('Error getting product:',error)
			res.status(500).json({message: 'Server error'})
		}
	}

}

module.exports = {ProductsController}