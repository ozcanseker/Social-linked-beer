# Technical documentation

- [Introduction](#1-introduction)
- [High Level overview](#2-high-level-overview)
  - [Model](#21-model)
  - [Solid communicator](#22-solid-communicator)
- [Ontologies](#3-ontologies)
- [Code examples](#4-code-examples)

## 1 Introduction
This is the technical documentation for the Social Linked Beer application. This documentation describes how the 
application is build and what is used to build it. It also contains some tips and code examples on how to work with Solid.
For the source code and more detailed code documentation check the [src](../source/src) folder. For the funtional design check
[this file](FSD%20Solid%20Beer%20App%20v0.4.pdf). This file describes the application functionality.

## 2 High level overview of the code structure
This application uses the MCV design model to show data. 

- This design model makes the application stable. 
- It will make the application faster. Instead of loading all the application data at the start you can do async fetch 
requests.
- It will update the application when the fetch requests come back.

The model classes are plain javascript. The ui is made with React. The Solid communication is also plain javascript with
the help of [Solid auth client](https://github.com/solid/solid-auth-client) and [Solid file client](https://github.com/jeff-zucker/solid-file-client)
  
### 2.1 Model
I use my own observable class.  

image: Observer class diagram  
![class diagram](images/ObservableDiagram.png)

You can subscribe to it and your update function will get called when the model updates.
The observable class will go trough the list of subscribes when the this.updateSubscribers function is called.
  
I have all my Model classes in a Holder class. This holder class subscribes to all sub model classes. 
The App react component subscribes to the Holder class.

Image: ModelHolder class diagram  
![class diagram](images/ClassDiagramModel.png)

### 2.2 Solid communicator
The Solid communicator handles all the messaging with the solid pod. The ui has elements(like buttons) that invoke
the methods of the Solid communicator. This will in turn do an action and update the model. The model then invokes the update method of 
the ui and the ui gets updated. 

Image: Sequence diagram request example  
![sequence](images/sequence.png)

### 2.3 Beer data
The user can checkin beers. To checkin beers the beerdata needs to be fetched. This fetching is done by querying a 
sparql endpoint. 

## 3 Folder structure + ACL
The folder structure of the application in the solid pod is as follows:

Image: folder structure application
![association example uri](images/folderstructure.png)

The ttl files have different ontologies. Check [the ontologies](#4-ontologies) section for more details on these ontologies.

### 3.1 Detailed description folder structure
The next section will describe these folders more in detail.

### 3.1.1 social linked beer folder
ACL: only Owner can view,write,append the contents

The social linked beer folder is the main folder. This folder can be seen in the public folder of the user's solid pod. 
This folder has the beerdrinker folder. If the application get expanded to also include the beerbrewer use case than this can
also be places in the social linked beer folder. 

### 3.1.2 Beerdrinker folder 
ACL: only Owner can view,write,append the contents  
  
This is the folder all the application data for the beerdrinker will be stored. This folder is divided in multiple folders.

### 3.1.3 appdata.ttl
ACL: only Owner can view,write,append the contents. Friends can also see content.

This folder shows the appllication data like beerpoints and startdate. Friends can see this file. Now friends can see each
other beerpoints.

### 3.1.4 friends.ttl
This file holds 


### 3.1.5 checkins folder

### 3.1.6 inbox

### 3.1.7 likes

### 3.1.7 Groups

## 4 Ontologies
In the next section I will describe the ontologies that I used to make this application. I tried to model it with uml. 

The ontologies will not really matter if a human has to go trough a graph to get the information. The human will 
eventually figure it out. The goals of these ontologies is to make it possible for programs to decipher the ontologies.
The programm will be looking for well known vocabularies. Therefor it is smart to use well known vocabs and to sometimes
duplicate the same information in a different vocabulary. 

### 4.1 Meaning of symbols
I used different kind of arrows and different kind of ways to write things. In this section I wil explain what those 
symbols mean.

**Prefix**  
I used the standard way of declaring prefixes to declare the prefixes in the ontologie diagram.

Image: Prefix notation  
![prefix notation](images/prefixexample.png) 

**Class**  
The image below shows an example of a class. 

Image: Class notation  
![class notation](images/classexample.png)  

As you might see I put the class name in two different places: Once as the title and once as a rdf:type. This seems redundant.
The logic behind it is, that rdf:type is an attribute while the title references the object itself. So the object itself will have
an uri(unless it as a blanknode) and the attribute rdf:type.
  
As you might also notice, I declare the literals and attributes that do not reference another object inside the box.  
  
Literals are depicted in between "" with the type inside the quotations marks.  
  
Named nodes are depicted in between <>.  
  
**Association**  
Association is when a class knows/references another class. This will be done with an arrow. The arrow will always have a
attribute. This attribute will be near the arrow. 
  
Image: Association notation  
![association notation](images/assocationexample.png)  
  
In the image below you will see an association between two classes. The foaf:Document references the slb:Checkin with the
foaf:primaryTopic and vice versa with the foaf:isPrimaryTopic.
  
Image: Association example  
![association example](images/assocationexample2.png)  

if the reference to another object is only an uri the second class will have an empty body.

Image: reference to uri
![association example uri](images/emptybodyclass.png)

Sometimes you need to specify the amount of object it can reference. This is done by putting a number or * near the arrow. 
\* means it can mean anything from 0 to infintite amount of references.

Image: cardinality   
![cardinality](images/cardinality.png)

**Inheritance**  
Inheritance is when a class extends a different class. In the image below the slb:Checkin extends the sch:Action. Extending
allows me to make my own classes while still reusing the know vocabularies. I can add my own attributes to the class while still
using known vocabs. I might also use inheritance to make a class more specific. 

When a class extends another class it will inherit all attributes.

Inheritance is modeled with an open white arrow.

Image: Inheritance example    
![inheritance example](images/inheritanceexample.png)

### 4.2 Ontologies of different files
In this section I will describe the different ontologies used in the Social linked beer application. You will see a lot of foaf documents.
This is because the topic of these documents are not really the same as the document itself. The document just describes these objects.

#### 4.2.1 Appdata ontologie
The app data is a document, I think. Therefore I made the BeerApplicationData extend foaf:Document.  

Image: App data ontologie  
![Check in ontologie](images/appdataontologie.png)  
  
#### 4.2.2 CheckIn ontologie
A check in is a record of a beer that you drunk. So it is a record.  

I described the Check in as follows: 
  
Image: Check in ontologie
![Check in ontologie](images/CheckInOntologie.png)

First we have a the document that describes the Check in. This Document has the type foaf:Document. This document is 
different than the Check in itself. The document has the check in as primary topic.

The check in has the type slb:CheckIn. This is a class I made up because the class it inherits from does not 
describing it completely. It inherints from act:Event. 

Technically the checkIn is also an event. The event is there to give the check in the published attribute. I could have made
the Check in inherit from sch:CreativeWork but a Check in does not feel like a creative work. What might have been a Valid
alternative is if I added the act:published attribute to the slb:Checkin as a slb:published. I am trying to use as many
defined vocabs as possible and therefore I chose this method.  
  
The checkIn has three attributes: the rdf:type, the foaf:isPrimaryTopic and slb:checkInOf. The slb:checkInOf describes the ConsumeAction the user 
checked in. The ConsumeAction links the beer and the user that check in the beer.  

This file also contains the references to the likes given by other people. 

#### 4.2.3 Review ontologie
A review is technically also a check in but with a review attached to it. 

I described the Review as follows: 
  
Image: Review ontologie
![Review ontologie](images/ReviewOntologie.png)

The Review extends the checkIn. When you are reviewing a beer you are also checking it in. 

The slb:Review also extends the sch:Review. The sch:Review is defined by schema.org and has all the attributes I need.
  
#### 4.2.4 Friends ontologie  
I used the vcard group to model the friends of the user. The vcard group get used for access control.  
  
I also used the foaf:knows attribute. With this attribute other applications can easily find the friends in this application.  

Because I use the activity stream ontologie everywhere else i decided to use it here as well. 

Image: Friends ontologie  
![Friends ontologie](images/friendsontologie.png)   

#### 4.2.5 Groupdata ontologie
The group data is just a vcard group to handle access control. The vcard group does not have a leader attibute. Therfore 
I had to extend it and make my own class.

![group data ontologie](images/groupdataontologie.png)   

#### 4.2.6 Group check-in index ontologie  
The check in index is there to hold scores. You can not do this in the groupdata because they have different acl files.

![group data ontologie](images/groupindexchecking.png)   

#### 4.2.7 Solib invitation ontologie
The invitation is based on [activity stream invite definition](https://www.w3.org/TR/activitystreams-vocabulary/#dfn-invite).

This is the invitation you can send to a user that is not yet using 

Image: Invite ontologie.
![Invitation ontologie](images/invontologie.png)  

#### 4.2.8 Friend request ontologie
The friendship request is also based on the activity stream definition. See [here](https://www.w3.org/TR/activitystreams-vocabulary/#modeling-friend-requests) for an example.

![Invitation ontologie](images/friendshiprequest.png)  

#### 4.2.9 Group request ontologie
This is a group request ontologie. This describes how a user gets invited to a group. Based on the activity stream way of 
sending invitations.

![Invitation ontologie](images/grouprequest.png)  

#### 4.2.10 Like ontologie
Like ontologie is defined as followed: 

Image: Like ontologie
![Like ontologie](images/LikeOntologie.png)

There is nothing special about this. It just uses the 
[activity stream like definition](https://www.w3.org/TR/activitystreams-vocabulary/#dfn-like).
  
There is also a reference from the checin to the like. This reference is saves in the checkin file. 

#### 4.2.11 Accept friend request ontologie
This is the ontologie for when you accept a friend request. The FriendShipRequest is the original friendship request. I did
not model it out here but you should put the original Frienshiprequest there.

![friend request ontologie](images/friendshiprequestAccept.png)

#### 4.2.12 Decline friend request ontologie
Same as accept friendshiprequest only different rdf:type.

![friend request ontologie](images/friendshiprequestReject.png)

#### 4.2.7 Other user group ontologie
This is the a link to the group from an invited member of the group.

## 5 Quick start guide to making your Solid app  
This is a quick start guide to make your Solid app. If it is your first time working with Linked data and Solid, you might
do it wrong. You might not make the best ontlogies or your folder structure can become a mess. It is important to realize that you
will learn by making mistakes. Therefore I would not worry about it that much. You have to start somewhere.  
  
The thing I would worry about the least is the ontologies for the objects in your app. This is quite a bit of think work and you can 
change it later.  
  
1. You need to think out the app logic.
1. Think out the file structure of the application folder. what you want to place where and who can access it.
1. Make the ontologies you want to use. These might be temporary but it is still worth it to think it out before. Changing
it afterwards might be a lot less work if you put some tought into it before you start programming.
1. The rest will just be regular programming. The app logic needs to work.  

## 6 Code examples
The code I use to make files. For folder I use the Solid file client.

Post solid file    
``` javascript
import solidAuth from 'solid-auth-client';

/**
 * Post a solid file.
 * @param folder The folder you want the file to live in
 * @param filename
 * @param body (ttl file)
 * @returns {Promise<void>}
 */
export async function postSolidFile(folder, filename, body) {
    authClient.fetch(folder, {
        method: 'POST',
        headers: {
            'Content-Type': 'text/turtle',
            'Link': '<http://www.w3.org/ns/ldp#Resource>; rel="type"',
            'SLUG': filename
        },
        body: body
    });
}
```

Put solid file (really handy when you need to set an ACL file) 
``` javascript
import solidAuth from 'solid-auth-client';

/**
 * Put the solid file. Will replace the current file.
 * @param url The url of the location of the resource.
 * @param body The body you want it to replace with (ttl file)
 * @returns {Promise<void>} ?
 */
export async function putSolidFile(url, body) {
    authClient.fetch(url, {
        method: 'PUT',
        headers: {
            'Content-Type': 'text/turtle'
        },
        body: body
    });
}
```

Append File    
``` javascript
import solidAuth from 'solid-auth-client';

/**
 * Allows you to append a solid file.
 * @param {*} url of the file you want to append
 * @param {*} body `INSERT DATA { <subject> <predicate> <object> }`
 */
export async function appendSolidResource(url, body) {
    authClient.fetch(url, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/sparql-update'
        },
        body: body
    });
}
```


