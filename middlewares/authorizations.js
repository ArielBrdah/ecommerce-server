const User = require('../models/User')
const jwt = require('jsonwebtoken'); // Assure-toi que jwt est importé


const hasValidToken = async (req, res, next) => {
	const token = req.header('Authorization')?.replace('Bearer ', '');

	if (!token) {
		return res.status(401).json({ message: 'No token, authorization denied' });
	}

	try {
		const decoded = jwt.verify(token, process.env.JWT_SECRET);
		req.user = decoded.userId;  // L'ID de l'utilisateur est dans le token
		const requester = await User.findOne({ _id: req.user })

		if (!requester.logged) {
			return res.status(401).json({ message: 'User disconnected' });
		}
		req.userLogged = requester.logged
		req.userRole = requester.role
		next();
	} catch (error) {
		res.status(401).json({ message: 'Token is not valid' });
	}
};

const authorized = (...roles) => {

	return async (req, res, next) => {
		if (req.userLogged && roles.includes(req.userRole)) next()
		else res.status(403).json({ message: 'You are not authorized!' })
	}
}
module.exports = { hasValidToken, authorized }