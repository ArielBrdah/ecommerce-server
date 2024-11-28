const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const User = require('../models/User');

class AuthController {

	static async login(req, res) {
		dotenv.config()
		const { email, password } = req.body;

		try {
			const user = await User.findOne({ email });
			if (!user) return res.status(400).json({ message: 'Invalid credentials' });

			const isMatch = await user.matchPassword(password);
			if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

			const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '30d' });
			user.logged = true
			await user.save()
			res.status(200).json({ token });
		} catch (error) {
			res.status(500).json({ message: 'Server error', error: error });
		}
	}

	static async logout(req,res) {
		try {
			const requester = await User.findOne({_id: req.user})
			requester.logged = false;
			await requester.save() 
		} catch (error) {
			res.status(500).json({message: 'Server error'})
		}
		res.status(200).json({message: 'User logged out, with success'})
	}
}

module.exports = {AuthController}