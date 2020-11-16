# Presentation-Microservice

## Hello. This is the presentation module of the conference app.

### First git clone this repo.

```javascript
git clone https://github.com/chokoreetosan/Presentation-Microservice.git

```
### Then cd into the directory

```javascript
cd Presentation-Microservice
```
### Install the dependencies

```javascript
npm install
```

I created a database for testing purposes on AWS, to make it easier to set up the dev environment.
Make a .env file
DM me on slack for the host, username, and password

### Then, to start the service

```javascript
npm start
```

### To use the REST API:

##### To Create a Presentation:
Note: The api does not check to see if there's already a presentation at the event with the title, and will create duplicates.
```javascript
POST request /presentation with a body of the shape

{
   event:"eventname",
   name:"speakername",
   email:"speakeremail",
   company:"speakerscompany",
   title:"titleofpresentation",
   synopsis"this is a synopsis of the speaker's presentation etc etc",

}

and content-type header of:
application/x-www-form-urlencoded

```


##### To get a presentation:
Note: This endpoint will return more than one presentation if there is more than one with the same title at the event
```javascript
GET request /presentation with a body of the shape
{
    event:"eventname",
    title:"titleofpresentation"
}
and content-type header of 
application/x-www-form-urlencoded

```

##### To get all presentations at a specific event:
```javascript
GET request /allpresentations with a body of shape
{
    event:"eventname"
}
and content-type header of 
application/x-www-form-urlencoded
```

##### To change the state of a presentation:
```javascript
PATCH request /presentations with a body of shape
{
    event:"eventname",
    title:"titlename",
    newstate:"newstate"
}
newstate must have the value "submitted, approved, or not-this-year", or the endpoint will do nothing
Content type header must be
application/x-www-form-urlencoded
```