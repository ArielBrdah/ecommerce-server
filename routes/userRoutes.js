const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const dotenv = require('dotenv');

dotenv.config();

const router = express.Router();

const protect = (req, res, next) => {
	const token = req.header('Authorization')?.replace('Bearer ', '');
  
	if (!token) {
	  return res.status(401).json({ message: 'No token, authorization denied' });
	}
  
	try {
	  const decoded = jwt.verify(token, process.env.JWT_SECRET);
	  req.user = decoded.userId;  // L'ID de l'utilisateur est dans le token
	  next();
	} catch (error) {
	  res.status(401).json({ message: 'Token is not valid' });
	}
};

const isAdmin = async (req,res,next) => {
	const requester = await User.findOne({_id: req.user})
	if(requester.role == "admin" ) next()
	else res.status(403).json({message: 'You are not authorized to delete this user'})
}

// Route d'inscription
router.post('/register', async (req, res) => {
	const { name, email, password } = req.body;

	try {
		const userExists = await User.findOne({ email });
		if (userExists) return res.status(400).json({ message: 'User already exists' });

		const user = new User({ name, email, password });
		await user.save();

		const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '30d' });
		res.status(201).json({ token });
	} catch (error) {
		res.status(500).json({ message: 'Server error' });
	}
});

router.delete('/:uuid/remove', protect, isAdmin, async (req, res) => {
	let { uuid } = req.params


	try {
		const user = await User.findOne({ uuid })
		if (!user) return res.status(404).json({ message: 'User not Found' })

		console.log(req.user)
		const requester = await User.findOne({_id: req.user})
		if (user.uuid !== requester.uuid && requester.role !== 'admin') {
			return res.status(403).json({ message: 'You are not authorized to delete this user' })
		}

		await User.findOneAndDelete({uuid})
		res.status(200).json({message: 'User deleted successfully'})

	} catch (error) {
		console.log('Error deleting user:',error)
		res.status(500).json({message: 'Server error'})
	}

})

router.put('/:uuid/update', protect, async (req, res) => {
	let { uuid } = req.params

	try {
		const user = await User.findOne({ uuid })
		if (!user) return res.status(404).json({ message: 'User not Found' })

		console.log(req.user)
		const requester = await User.findOne({_id: req.user})
		if (user.uuid !== requester.uuid && requester.role !== 'admin') {
			return res.status(403).json({ message: 'You are not authorized to delete this user' })
		}
		
		if (name) user.name = name;
		if (email) user.email = email;
	
		// only admin can modify the role here
		if (role && req.user.role === 'admin') {
		  user.role = role;
		}

		await user.save()

		res.status(200).json({message: 'User updated successfully',user})

	} catch (error) {
		console.log('Error updating user:',error)
		res.status(500).json({message: 'Server error'})
	}

})

router.get('/all', protect, async(req,res) =>{
	try {
		const users = await User.find();
		res.status(200).json(users)
	} catch (error) {
		console.log('Error getting all user:',error)
		res.status(500).json({message: 'Server error'})
	}
})

// Route de connexion
router.post('/login', async (req, res) => {
	const { email, password } = req.body;

	try {
		const user = await User.findOne({ email });
		if (!user) return res.status(400).json({ message: 'Invalid credentials' });

		const isMatch = await user.matchPassword(password);
		if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

		const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '30d' });
		res.status(200).json({ token });
	} catch (error) {
		res.status(500).json({ message: 'Server error' });
	}
});

module.exports = router;
