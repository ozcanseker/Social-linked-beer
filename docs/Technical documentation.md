# Technical documentation

- [Introduction](#1-introduction)
- [High Level overview](#2-high-level-overview)
  - [Model](#21-model)
  - [Solid communicator](#22-solid-communicator)
- [Ontologies](#3-ontologies)
- [Code examples](#4-code-examples)

## 1 Introduction
This is the technical documentation for the Linked social beer application. This documentation contains how the 
application is build en what is used to build the application. It will mostly talk about the contents 
of the [src](../source/src) folder. It also contains some tips and code examples on how to work with Solid.

## 2 High level overview  
This application is made according to the Model-View-Control design principles. 

- This design principle makes the application stable. 
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
the methods of the Solid communicator. This will in turn do an action and update the model. The mode then invokes the update method of 
the ui and the ui get updated. 

Image: Sequence diagram request example  
![sequence](images/sequence.png)

This is good because usually you fetch a file and have to fetch a bunch of other files. With this method 
the user gets some feedback. You can show the user what he is about the receive. What you can do is, you can make the
model class and fill it in later with an load in details function.
  
In this way you also dont have to wait for every fetch request to finish. The application will update it's layout with every
fetch.   

## 3 Ontologies
In the next section i will describe the ontologies that I used to make this application. I tried to model it with uml. 

The ontologies will not really matter if a human has to go trough a graph to get the information. The human will 
eventually figure it out. The goals of these ontologies is to make it possible for programs to decipher the ontologies.
The programm will be looking for well known vocabularies. Therefor it is smart to use well known vocabs and to sometimes
duplicate the same information in a different vocabulary. 

### 3.1 Meaning of symbols
I used different kind of arrows and different kind of ways of writing things. In this section i wil explain what those 
symbols mean.

**Prefix**  
I used the standard way of declaring prefixes to declare the prefixes in the class diagram.

Image: Prefix notation  
![prefix notation](images/prefixexample.png) 

**Class**  
The image below shows an example of a class. 

Image: Class notation  
![class notation](images/classexample.png)  

As you might see I put the class name in two different places: Once as the title and once as a rdf:type. This seems redundant.
The logic behind it is, that rdf:type is an attribute while the title references the object itself. So the object itself will have
an uri, for example a sch:Person object will have the uri example.inrupt.net/profile/card#me.

As you might also see, I declare the literals and attributes that do not reference another class inside the box. 

**Association**  
Association is when a class knows/references another class. This will be done with an arrow. The arrow will always have a
attribute. This attribute will be near the arrow. 
  
Image: Association notation  
![association notation](images/assocationexample.png)  
  
In the image below you will see an association between two classes. The foaf:Document references the slb:Checkin with the
foaf:primaryTopic and vice versa with the foaf:isPrimaryTopic.
  
Image: Association example  
![association example](images/assocationexample2.png)  

**Inheritance** 
Inheritance is when a class extends a different class. In the image below the slb:Checkin extends the sch:Action. Extending
allows me to make my own classes while still reusing the know vocabularies. I can add my own attributes to the class while still
using known vocabs. Inheritance is modeled with an open white arrow.

Image: Inheritance example    
![inheritance example](images/inheritanceexample.png)

### 3.2 CheckIn
- Public type index data
- Appdata
- CheckIn
- Review

#TODO
- documentatie over folder opzet
- documentatie over asl

## 4 Quick start guide to making you Solid app  

1. set up the file structure of the application folder. Think out what you want to place where and who can acess it.
2. Start programming until it works.

## 5 Code examples
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


