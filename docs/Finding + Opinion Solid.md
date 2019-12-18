# Findings + opinions on Solid  
  
## Index  
- [Introduction](#1-introduction)  
- [Conceptually](#2-conceptually)  
  
## 1 Introduction  
I did a presentation on Solid. One of the question I got asked was : "Why is Solid important?".
Another question that comes my mind along with this question is : "Why do we care about Solid?". 
It was advised to me to separate three different concepts when writing this document.  
  
- Is Solid conceptually taught out well?  
- Is Solid technically sound?  
- What were some other factors that could have interfered with the making of this application?  
    
## 2 Conceptually  
I have found that there are two ways of looking at Solid:  
- You can see it as a way for the user to control their own data.  
- You can see it as a tool for the read-write web.  
  
### 2.1 Solid as a privacy tool  
First Solid is a way of shielding your information. Solid does this by taking the data away from the
application storages and places it with users. All the data gets stored in a POD.  
  
**All data in one place**  
Conceptually saving all your data in one place is not smart. When one vulnerability is found there is a possibility 
that all you data gets exposed. This means that your life might get flipped-turned upside down. 
  
This is not a Solid only problem however. Exploiters of leaked data are still able to link data from different kinds of 
sources together. Still it is dangerous.  
  
Now an application can access everything in the pod when you give it access. This will probably be reworked where an application
can only reach a sectioned off part of the pod. This might reduce limit the information exposed.  
  
**I wash my hands in innocence**  
If I ,as a programmer, would not want to spend time and money on securing my back end, I could consider using Solid. I might still
have to apply some kind of encryption to add an extra layer of protection. The server and other kind of security threats are
now Solid's and users responsibility.  
  
Instead of every programmer having to learn about securing their backend, we could have a dedicated team at Solid that 
implements this. There are people who are specialized in this kind of thing and it is better to leave this kind of stuff up to
them. 
  
### 2.2 Solid as a read-write web tool  
Solid pods are little file storages on the internet. You can give access to different applications to write and read from these
file storages.  
  
**No backend**  
This is not completely true. In some cases you are going to still need a backend, for example to index the different Solid pods
that use your application. This way users can find each other without a different route of communication like email or physical meeting.  
  
This is in my opinion where Solid gets interesting. I do not have to maintain or build my own backend. 
This will also cause some problems, like finding different pods on the web. There might be a solutions in the future.
  
### 2.3 Solid concepts  
#### 2.3.1 Interoperability  
One of the ideas of Solid is that you are the owner of you data. Therefor if you are dissatisfied with one service, you 
can leave and take your data with you.