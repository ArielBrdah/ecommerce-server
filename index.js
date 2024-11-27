const express = require('express')
const app =  express()
const mongoose = require('mongoose')
const userRoutes = require('./routes/userRoutes')
const cors = require('cors')
mongoose.connect(process.env.MONGO_URI, {
	useNewUrlParser: true,
	useUnifiedTopology: true
})
.then(() => console.log('Connected to MongoDB') )
.catch((err) => console.error('Error connecting to MongoDB:', err))
const dotenv = require('dotenv')
dotenv.config()
const PORT = process.env.APP_PORT ?? 4000

// Middleware
app.use(express.json()); // parse JSON request
app.use(cors()); // Authorize Cross Origin

function info(req,res){
	res.writeHead(200,{
		'Content-Type': 'text/html'
	})
	htmlPage = "<h1>Information About The Ecommerce</h1><table>"
	for (const key in process.env) {
		if(key.startsWith('APP_')){
			htmlPage += `
			<tr>
				<td>
					<strong>${key}: </strong>
				</td>
				<td>
					<span>${process.env[key]}</span>
				</td>
			</tr>
		`
		}
	}

	htmlPage += "</table>"

	res.write(htmlPage)
	res.end()
}
app.get('/',info)
app.use('/api/users',userRoutes)
app.listen(PORT,()=> console.log(`Server started\n\tPort:${PORT}`))