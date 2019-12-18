# Huiskluis implemented with Solid

## Index
1. [Introduction](#introduction)  
1. [Broad overview](#broad-overview)

## Introduction
"The "Huiskluis"(House safe in Dutch) is a practical application developed during the national Linked Open Data (LOD) 
Pilot. The Huiskluis "knows everything about your house". It contains links to data / information from governments 
(basic administrations), companies and institutions, but also from residents and owners themselves. The Huiskluis offers 
residents and owners of residential objects (residential houses, business premises, institutional buildings, etc.) the 
opportunity to easily collect information and share it in a safe manner with suppliers, governments, neighbors, social 
workers, and others. The application shows that information about each building in the Netherlands can be supplied to 
measure, using the linked data principle. And that this makes many new applications possible. The case study has 
contributed to the objective of the Linked Open Data pilot by showing that it is possible to gather information about 
accommodation objects from different sources and to make them accessible for new services." (Cited from 
http://www.pilod.nl/wiki/Boek/FrancissenEchtelt before putting it trough Google translate).

This sounds like an use case for Solid. It works with Linked data. It is an application that collects information
and allows you to share it with third parties. Everything that is also possible with a Solid pod. In this document I will 
model how you could implement such an application.  
  
## Broad overview
This section will show a broad overview of the application. 
