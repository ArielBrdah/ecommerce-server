const User = require("../models/User");
const dotenv = require('dotenv');

class UsersController {

	static async register(req, res) {
		dotenv.config();

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
	}

	static async remove(req, res) {
		let { uuid } = req.params


		try {
			const user = await User.findOne({ uuid })
			if (!user) return res.status(404).json({ message: 'User not Found' })

			console.log(req.user)
			const requester = await User.findOne({ _id: req.user })
			if (user.uuid !== requester.uuid && requester.role !== 'admin') {
				return res.status(403).json({ message: 'You are not authorized to delete this user' })
			}

			await User.findOneAndDelete({ uuid })
			res.status(200).json({ message: 'User deleted successfully' })

		} catch (error) {
			console.log('Error deleting user:', error)
			res.status(500).json({ message: 'Server error' })
		}

	}

	static async update(req, res) {
		let { uuid } = req.params
	
		try {
			const user = await User.findOne({ uuid })
			if (!user) return res.status(404).json({ message: 'User not Found' })
	
			console.log(req.user)
			const requester = await User.findOne({_id: req.user})
			if (user.uuid !== requester.uuid && requester.role !== 'admin') {
				return res.status(403).json({ message: 'You are not authorized to modify this user' })
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
	
	}

	static async all(req,res) {
		try {
			const users = await User.find();
			res.status(200).json(users)
		} catch (error) {
			console.log('Error getting all user:',error)
			res.status(500).json({message: 'Server error'})
		}
	}

	static async find() { }

}

module.exports = {UsersController}