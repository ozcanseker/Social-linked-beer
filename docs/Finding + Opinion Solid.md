# Findings + opinions on Solid  
  
## 0 Index  
- [Introduction](#1-introduction)  
- [Conceptually](#2-conceptually)  
  
## 1 Introduction  
I started my internship at the dutch Kadaster. Here I got the assignment: Find out if Solid can mean something for 
the Kadaster.  Kadaster has sensitive information, therefore the application needed a more accessible 
context. An Untappd like beer application was chosen.
  
After a while I had to do a presentation on Solid. One of the question I was asked, was : "Why is Solid important?".
Other questions that come to mind are : "Why do we care about Solid?" and "Does Solid work?'. These are questions I hope to
answer by the end of this document. 
  
I split the text up in different parts:
- Is Solid conceptually thought out well?  
- Is Solid lacking on the technical front?
- Is Solid lacking on the Governance front?
- When would I make a Solid application as a developer?
- The future of Solid.
- The conclusion
  
## 2 Short introduction on Solid
First we need to figure out what Solid is and does. 

Solid is build by Inrupt. Tim Berners-Lee formed Inrupt to help build a commercial ecosystem to fuel Solid.

Solid (Social linked data) is an online service where an user can save their data. Solid calls these personal online
data storages PODs. A user can upload their own data to the POD. This data is in the form of files. The user can also give access to applications 
to access and write in their PODs.

So an user can give access to an application to access the data and write new data. This means there is no more need for the application data to
be saved in the databases of the application owner. The data is now saved in the POD. Now the data is saved
with the user in their POD. The user can also see what is saved about him/her.

It is now possible for the user to manage their own data. The user can revoke the access of the application to their pod.
No data will be lost because the data was saved in the POD. The user can choose to switch to another application if they wanted to. 
The new application can reuse the old data of the revoked app. 

The data is not saved in one central database but spread around different pods. The pods themselves are also not in
a central point but spread around. This makes Solid decentralized. 

The pod where the data is saved should be accessible somewhere on the web. The user can choose to get a pod from a pod 
provider or host it themselves. The Solid pods have an uniform interface which means an application can talk to the pod no 
matter where it is placed.
  
## 3 Conceptual problems and benefits of using Solid
This section explores if Solid makes sense conceptually. I divided this section is two parts. The problems
and the benefits of the Solid concepts.

### 3.1 Problems
**All data in one place**  
Saving all your data in one place is not smart. When one vulnerability is found there is a possibility 
that all you data gets exposed. This means that your life might get flipped-turned upside down. It is possible that the exploiters have everything from
your daily schedule to your banking information.
  
This is not a Solid specific problem however. Exploiters of leaked data are still able to link data from different kinds of 
sources together. You will most likely be using the same email address for different services. The email can be used as a binding
link between sources.  

You could be using different pods for different things. This way you wont store all your information in one place. This will 
take away one of the core concepts of Solid. The concept that your POD is your personal hub for all your data. 
 
This is a problem that the users and Solid team should keep in mind.
  
**High learning curve user**  
Solid is complex. I, as in ITer, do know how folder structures and files work. Not everyone is familiar with this. I do however still have trouble logging in
and getting Solid to work sometimes. Not everyone is computer savvy. To make Solid accessible to everyone should be one of the main tasks of Solid.

Solid does require some kind of grasp before you can use it. If complex stuff comes into play, i think a lot of people will 
start getting put off from Solid.

When people want to use the beer application, they have to give it extra permission. What people usually do is just click trough the permission part without reading it,
just like terms of services. I do not think people will be careful enough.

**Finding resources on the web is a problem**  
Solid is decentralized. All data being in one place also makes searching possible. If information is spread around you need an another way of connecting with people. 
For example facebook allows you to search for all users. You need some kind of way to search for objects on the web. This does not exist (yet?).
   
### 3.2 Benefits
**App data with the user**  
This means your data is not held hostage by applications. You can switch from application anytime you want. You can see what
applications are saving about you. 

**All data in one place**  
This might be a security flaw but it is also a great tool. This way users can create personal hubs that interlink different 
data sources with each other. The pod becomes your digital twin. You could for example get financial or healthcare advice based on data from
different applications. The pod becomes a part of your life.
  
**No backend**  
This is not always true. In some cases you are going to still need a backend, for example to index the different Solid pods
that use your application. 
  
This does mean that the application developer does not have to maintain or build his/hers own backend. This might save the 
appdeveloper money. 
  
**Solid is flexible**  
Because the Solid interface is uniform and because Solid works with linked data, Solid is really flexible. You could swap out 
multiple part of the Solid pod for outside services. This way third parties with more experience can implement different parts of SOlid.
For example the default inbox of Solid is really simple. You could outsource this as a user to a more experienced inbox provider.

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

## 4 Technical
There are still some technical limitations. It is working  but there are still some problems that need to be solved.
Solid is still young and the community is growing. This is the part that i do not really worry about. This just requires some time
and tinkering. 

**Many http requests**  
This has to do with the decentralized nature of Solid. Information is spread out. This means the application has
to make request to gather this information. If you take a social network application for example, the http requests will scale rapidly.
Every user has multiple post, that have multiple comments, which have multiple likes. This becomes a problem really fast. 
This will overload the servers and also make the user wait a long time for application reposes. 

**Logging in sometimes works clunky**  
The library for logging in and logging in in general does not work very well.

**Access shielding**  
When an application gets access to a pod, the application can get to every folder. This needs to be solved by allowing the 
application only to use the folder it was given.

## 5 Governance based problems
There are also some governance based problems. These are more based on bureaucratic and financial work that needs to be done and thought out.

**Inrupt is not GDPR compliant**  
It says so on their site. If you are a company that wants to hold personal data of people. You should at least have
this.

**Making money**  
The app developers will make less money. The money for advertisements will be less because the adds
will be less targeted. 

The appdeveloper could also ask for money. This will however deter users from using his application. 

There is still some thinking that needs to be put in this subject. Will Solid draw application makers financially?

**Copying Data**  
If you want to make a search indexes the application has to make copies of data. There also needs to be a way for the user to give this as permission.

## 6 When would I make a Solid application?
Solid works really well for creating hubs. A place where you can collect all your data and access this data. 
With smart tools you could also get additional information from this data. 

Also Solid work well when you want to create a small network of pods that work together. This way the http request stay at a 
reasonable rate. The sharing of data works well. The only problem is the scalability. 

If the scalability problem gets solved there might be whole social networks that could be build on the Solid platform.  
 
## 7 The future of Solid
I think the future of Solid depends on the community. 

First of all the regular user: This user needs to see the benefits of using Solid. Controlling you own data is important.
Solid is still difficult to use however and needs a better user experience. The user should be able to control their data in an 
easy and fast way. More complex options could be given to the user, but these should be hidden away. A computer illiterate person
will be scared off by these options. 

Second the app developer: You need developers to get an initial network going. These developer need to make the first bunch
of applications that attract users. Solid could do this by paying developers. Another way to attract developers is if the devs
can make money off the users themselves. This means that the Solid user community has to grow. 

Third the institutions: The big corporations The facebooks, googles and also government institutions. When these institutions start
accepting the Solid specs, Solid becomes mainstream. For this to happen the application and user landscape need to be big.
 
## 8 Importance of Solid for Kadaster
The importance of Solid for Kadaster is not huge in my opinion. Solid is still nog big enough to make a difference. I also
do not believe that Kadaster will save their registries in a different way.

If Solid gets big, the Kadaster does need to make adjustment however. Personal information does not need to be 
saved at the Kadaster anymore. The only thing the user has to do is give access to parts of the POD that are relevant to 
the Kadaster. Kadaster could also make an interface that allows the user to get Kadaster information dropped in their pod.    
 
## 9 Conclusion 
Solid is still in need of some improvement. The question is if enough users and developers will be attracted to Solid. 
This I can not answer. 

To answer the question "Why is Solid important?" and "Why do we care about Solid?". 

Solid is important because it is at least trying to give back users their data. It is a first step in fixing things. It is 
way of doing things differently. It is always worth exploring ideas. Maybe it is a waste of time but you do know that before
you have put time and energy into it. 

It might still have some limitations and technical flaws but it is going in the right direction.

The only problem to really worry about is the scalability, the many http requests for certain kinds of applications.

For now Solid is not important for the Kadaster. Solid is not used by enough people yet to worry about. 