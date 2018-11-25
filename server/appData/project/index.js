"use strict";

//libs
const uuidv4 = require('uuid/v4');

module.exports = (app, MongoClient, mongoDBurl, mongodb) => {
	const projectHelper = require('../libs/helperFunctions.js')(mongodb);
	return {
		"configureRoutes": () => {

		
		
/*
-----------------------------POST-------------------------------------
*/
			//post a new project
			app.post('/project', function (req, res){
				console.log("creating new project:"+req.body.projectName);
				var coll = "projects";
				var date_stamp = new Date();
				var reply;
				var myobj = {
					"projectID": uuidv4(),
					"projectName": req.body.projectName,
					"Users": [],
					"sensors": [],
					"operations": [],
					"superframe": {},
					"dateCreated": date_stamp.toString() ,
					"dateModified": date_stamp.toString(),
					"description": req.body.description
				};
				mongodb.createCollection(coll, function(err, res) {			//create projects Collection if non exists
					if (err) throw err;
				});
				mongodb.collection(coll).insertOne(myobj, function(err, result) {	//Create Project Document
					if (err) throw err;
					console.log("Project Document Created");		
					reply = {
						"insertedCount": result.insertedCount,
						"collection": coll,
						"projectName": result.ops[0].projectName,
						"projectID": result.ops[0].projectID,
						"_ID": result.ops[0]._id,
						"dateCreated": result.ops[0].dateCreated,
						"dateModified": result.ops[0].dateModified
					};
					res.send(reply);
				});
			})



			app.post('/addProject', function (req, res) {
				console.log("creating new project:"+req.body.projectName);
				var coll = "projects";
				var reply;
				var myobj = {
					"projectID": uuidv4(),
					"projectName": req.body.projectName,
					"Users": [],
					"sensors": [],
					"operations": [],
					"superframe": {}		  
				};
				mongodb.createCollection(coll, function(err, res) {			//create projects Collection if non exists
					if (err) throw err;
				});
				mongodb.collection(coll).insertOne(myobj, function(err, result) {	//Create Project Document
					if (err) throw err;
					console.log("Project Document Created");		
					reply = {
					   "insertedCount": result.insertedCount,
					   "collection": coll,
					   "projectName": result.ops[0].projectName,
					   "projectID": result.ops[0].projectID,
					   "_ID": result.ops[0]._id
					};
					res.send(reply);
				});
			})
			
/*
-----------------------------PUT-------------------------------------
*/
			app.put('/project', function (req, res) {
				console.log("PUT CALLED");
				var coll = "projects";
				console.log('Updating Project: ' + req.body.projectID);
				var newValues = {$set: {
					"projectName": req.body.projectName
				} };
				var myQuery = {
					"projectID": req.body.projectID
				}
				mongodb.collection(coll).update(myQuery,newValues, function(err, result) {
					if (err) throw err;
					console.log(result);
					res.send(result);
					projectHelper.updateProjectDate(req.body.projectID);
				})
			})

/*
-----------------------------GET-------------------------------------
*/
			//get a project by ID
			app.get('/project?', function(req,res){
				var coll = "projects";
				var projectID = req.query.projectID ? req.query.projectID : 'No Project ID';
				console.log("Project details requested");
				console.log(projectID);
				mongodb.collection(coll).findOne({'projectID': projectID}, function(err, result){
					if (err) throw err;
					console.log(result);
					res.send(result);
					console.log("Project details sent");
				})
			})
			app.get('/date?', function(req,res){
				var date_stamp = new Date();
				console.log(date_stamp.toString());
				res.send(date_stamp.toString());
			})
		
		
			//get list of porjects and IDs
			app.get('/listProjects', function(req,res){
				var coll = "projects";
				var reply;
				var project;
				console.log("Project list requested");
				mongodb.collection(coll).find({}).toArray(function(err, result){
					if (err) throw err;
					var reply = [{}];
					for (var i = 0; i < result.length; i++) {
						reply[i] = {
							'projectName': result[i].projectName,
							'projectID': result[i].projectID,
							'description': result[i].description,
							'dateCreated': result[i].dateCreated,
							'dateModified': result[i].dateModified
						}
					}
					console.log(reply);
					res.send(reply);
					console.log("Project list sent");
			
				})
				
			})
			
			
			
			
			
			app.get('/test', function(req,res){
			const projectHelper = require('../libs/helperFunctions.js')(mongodb);
			projectHelper.checkUser(req.query.username,req.query.password);
				
			})
			
			
			
/*
-----------------------------DELETE-------------------------------------
*/

			app.delete('/project?', function(req,res){
				var coll = "projects";
				var projectID = req.query.projectID ? req.query.projectID : 'No Project ID';
				console.log("Delete Project requested");
				console.log(projectID);
				mongodb.collection(coll).deleteOne({'projectID': projectID}, function(err, result){
					if (err) throw err;
					console.log(result);
					res.send(result);
					console.log("Project deleted");
				})
			})	
		
		}
	}
}