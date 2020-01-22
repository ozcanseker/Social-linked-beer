# Findings + opinions on Solid  
  
## Index  
- [Introduction](#1-introduction)  
- [Conceptually](#2-conceptually)  
  
## 1 Introduction  
I did a presentation on Solid. One of the question I was asked, was : "Why is Solid important?".
Another question that comes my mind along with this question is : "Why do we care about Solid?". 
I split the text up in three different parts:

- Is Solid conceptually thought out well?  
- Is Solid lacking on the technical front?
- Is Solid lacking on the Governance front?

## 2 Conceptually  
This section explores if Solid makes sense conceptually. I divided this section is two parts. The problems
and the benefits of the Solid concepts.

### Problems
**All data in one place**  
Saving all your data in one place is not smart. When one vulnerability is found there is a possibility 
that all you data gets exposed. This means that your life might get flipped-turned upside down. It is possible that the exploiters have everything from
your daily schedule to your banking information.
  
This is not a Solid specific problem however. Exploiters of leaked data are still able to link data from different kinds of 
sources together. You will most likely be using the same email address for different services. The email can be used as a binding
link between sources.  

You could be using different pods for different things. This way you wont store all your information in one place.  
 
However this is a problem that the users and Solid team should realize.
  
**High learning curve user**  
Solid is complex. I as in ITer, do know how folder structures and files work. Not everyone is familiar with this. I do however still have trouble logging in
and getting Solid to work sometimes. 

When people want to use the beer application, they have to give it extra permission. What people usually do is just click trough the permission part without reading it,
just like terms of services. I do not think people will be careful enough.

Solid does require some kind of grasp before you can use it. If complex stuff comes into play, i think a lot of people will 
start getting put off from Solid.

**Finding resources on the web is a problem**  
All data being in one place also makes searching possible. If information is spread around you need an another way of connecting with people. 
For example facebook allows you to search for all users. You need some kind of way to search for objects on the web. This does not exist yet.
   
### 2.2 Benefits
**App data at the user**  
This also means your data is not held hostage by applications. You can switch from application anytime you want.

This also means that you have an insight on what data is stored about you.

**All data in one place**  
This might be a security flaw but it is also a great tool. This way user can access personal hubs that interlink different d
data sources with each other. The pod becomes your digital twin. You could for example get financial or healthcare advice based on data from
different applications. The pod becomes a part of your life.
  
**No backend**  
This is not completely true. In some cases you are going to still need a backend, for example to index the different Solid pods
that use your application. 
  
This does mean that the application developer does not not have to maintain or build his/hers own backend. This might save the 
appdeveloper a lot of money. 
  
**Solid is flexible**  
Because the Solid interface is uniform and because Solid works with linked data, Solid is really flexible. You could swap out 
multiple part of the Solid pod for outside services. This way third parties with more experience can implement different parts of SOlid.
The default inbox of Solid is really simple. You could outsource this as a user to a different party.

**Permission control is thought out well**  
The permission control works and is thought out well. You can share things with different groups and different people. 

**I wash my hands in innocence**  
If I ,as a programmer, would not want to spend time and money on securing my back end, I could consider using Solid. I might still
have to apply some kind of encryption to add an extra layer of protection. The server and other kind of security threats are
now Solid's and users responsibility.  
  
Instead of every programmer having to learn about securing their backend, we could have a dedicated team at Solid that 
implements this. There are people who are specialized in this kind of thing and it is better to leave this kind of stuff up to
them. 

**Solid is the alternative**  
Atleast Solid is trying to make a difference. It might fail but you have to start somewhere. This might also spark different
project of the same nature.

## 3 Technical
There are still some technical limitations. It is working  but there are still some problems that need to be solved.
Solid is still young and the community is growing. This is the part that i do not really worry about. This just requires some time
and tinkering. 

**Many http requests**  
This has to do with the decentralized nature of Solid. Information is spread out. This means the application has
to make request to gather this information. If you take a social network application for example, the http requests will scale rapidly.
Every user has multiple post, that have multiple comment, which have multiple likes. This becomes a problem really fast. 
This will overload the servers and also make the user wait for application reposes. 

**Logging in sometimes works clunky**  
The library for logging in and logging in in general does not work really well.

**Access shielding**  
When an application gets access to a pod, the application can get to every folder. This needs to be solved by allowing the 
application only to use the folder it was given.

## Governance based problems
There are also some governance based problems. These are more based on bureaucratic and financial work that needs to be done and thought out.

**Inrupt is not GDPR compliant**  
It says so on their site. If you are a company that warns wants to hold personal data of people. You should atleast have
this.

**Making money**  
The app developers will make less money. The money for advertisements will be less because the adds
will be less targeted. 

The appdeveloper could also ask for money. This will however deter users from using his application. 

There is still some thinking that needs to be put in this subject. Will Solid draw application makers financially?

**Copying Data**  
If you want to make a search indexes the application has to make copies of data. There also needs to be a way for the user to give this as permission.

## When would I make a Solid application?
Solid works really well for creating hubs. A place where you can collect all your data and access this data. 
With smart tools you could also get additional information from this data. 

Also Solid work well when you want to create a small network of pods that work together. This way the http request stay at a 
reasonable rate. The sharing of data works well. The only problem is the scalability. 
 
 If the scalability problem gets solves there might be whole social networks that will be build on the Solid platform.  
 
## Conclusion 
Solid is still in need of some improvement but I believe that it will succeed. Solid has a good setup and good ideas.

To answer the question "Why is Solid important?" and "Why do we care about Solid?". 

Solid is important because it is at least trying to give back users their data. It is a first step in fixing things. It is 
way of doing things differently. It is always worth exploring ideas. Maybe it is a waste of time but you do know that before
you have put time and energy into it. 

It might still have some limitations and technical flaws but it is going in the right direction.

The only problem to worry about  is the scalability, the many http requests for certain kinds of applications.