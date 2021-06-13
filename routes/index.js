var express = require('express');
var multer = require('multer');      // For dealing with file uploads
const fs = require('fs');     // For dealing with file system
var nodemailer = require('nodemailer'); // For sending email

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads') //Destination folder
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname) //File name after saving
  }
})

var upload = multer({dest:"./uploads", storage: storage});
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.sendFile(__dirname + "/" + "index.html");
});

/* Process java file */
router.post('/submit',upload.single('file'),function(req,res,next){
	console.log("------------file received---------");
	console.log(req.body.email);
    if(req.file.originalname.endsWith(".java")){
		//try {
			// spawn a process to compile java file 
			/*var spawn = require('child_process').spawn;
			var child = spawn('javac', ['./uploads/'+req.file.originalname]);
			var spawn2 = require('child_process').spawn;
			child.kill("SIGINT");
			*/
			// execute and respond with output
			var out = fs.openSync('./out.log', 'a');
			var err = fs.openSync('./out.log', 'a');
			var exec = require('child_process').exec;
			res.send("Mail will be sent as soon as output is ready.");
			var cmdString = 'cd uploads && java '+req.file.originalname;
				exec(cmdString, (err, stdout, stderr) => {
					console.log(err);
					console.log(stderr);
					console.log(stdout);
					//res.send("Mail will be sent as soon as output is ready.");
					var transporter = nodemailer.createTransport({
						service: 'gmail',
						auth: {
						  user: 'sss.events.notifications@gmail.com',
						  pass: ''
						}
					  });
				  
					  var mailOptions = {
						from: 'sss.events.notifications@gmail.com',
						to: req.body.email,
						subject: "JIVE output",
						html : stdout
					  };
				  
					  transporter.sendMail(mailOptions, function(error, info){
						if (error) {
						  console.log(error);
						  return "failed";
						} else {
						  return info.response;
						}
					  }); 
					  
			});
		/*} catch (error) {
			console.log("----- Exited ------");
			console.log(error);
		}*/
		
    }
    else{
      res.send("Upload java files only.");
    }
});

module.exports = router;
