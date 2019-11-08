#Technical documentation

- [Introduction](#introduction)
- [High Level overview](#high-level-overview)
  - [Model](#model)
  - [Solid communicator](#solid-communicator)
- [Code examples](#code-examples)

## Introduction
This is the technical documentation for the Linked social beer application. This documentation contains how the 
application is build en what is used to build the application. It will mostly talk about the contents 
of the [src](../source/src) folder. It also contains some tips and code examples on how to work with Solid.

## High level overview  
This application is made according to the Model-View-Control design principles. 

- This design principle makes the application stable. 
- It will make the application faster. Instead of loading all the application data at the start you can do async fetch 
requests.
- It will update the application when the fetch requests come back.

The model classes are plain javascript. The ui is made with React. The Solid communication is also plain javascript with
the help of [Solid auth client](https://github.com/solid/solid-auth-client) and [Solid file client](https://github.com/jeff-zucker/solid-file-client)

### Model
I use my own observable class.  
![class diagram](images/ObservableDiagram.png)

You can subscribe to it and your update function will get called when the model updates.
The observable class will go trough the list of subscribes when the this.updateSubscribers function is called.
  
I have all my Model classes in a Holder class. This holder class subscribes to all sub model classes. 
The App react component subscribes to the Holder class.
![class diagram](images/ClassDiagramModel.png)


### Solid communicator
The Solid communicator handles all the messaging with the solid pod. The ui has elements(like buttons) that invoke
the methods of the Solid communicator. This will in turn do an action and update the model. The mode then invokes the update method of 
the ui and the ui get updated. 

![sequence](images/sequence.png)

This is good because usually you fetch a file and have to fetch a bunch of other files. With this method 
the user gets some feedback. You can show the user what he is about the receive. What you can do is, you can make the
model class and fill it in later with an load in details function.
  
In this way you also dont have to wait for every fetch request to finish. The application will update its layout with every
fetch.   


## Code examples
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


