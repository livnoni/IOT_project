# IOT_project

This is our project in the IT course at Ariel University in the Department of Computer Science

##### GENERAL BACKGROUND / CONTEXT
Elderly people need a lot of daily assistance.
The solution today is a personal (human) individual assistant.
We live in an era in which life expectancy rises and so does technology.
Why should not we use this technology to help older people?
Why should not we use smart sensors and advanced software to make life easier for the elderly?

##### The problem that we want to solve:
We aim to solve daily problems for old people through voice commands.
For example: operating the TV, operating air conditioner, using the Internet for a wide range of services,
etc...

#####  OUR SOLUTION
Our solution is a smart home system.
With Android devices, voice commands will be given by the users.
The commands will transfer to NodeJS server in the localhost of your home network.
The node server will transfer tasks to the smart agents, such as a IR blaster(Orvibo) that
communicate with IR devices, a selenium server that will perform a variety of automated actions
on the web and more.
It is important to emphasize that the users will install an Android application that continuously
listens to voice commands around the house (without any user interaction).
In addition the voice command will be saved in the server for further learning and automations

##### The project contains two main folders:
 - Android application
 - Node server

The Android application makes continuous Speech Recognition in the bacground, The Android application works at offline real time converting sound to text using google RecognitionListener class.
In addition the application send post request to the desire ip with the content of the speach that have been converted into text.

The node server gets the data from the Android application, It ave the data and it analyze the data.

If the server 'understand' the order then it makes te orders.



# REST API

The REST API to the example app is described below.

## Get list of Things

### Request

`GET /`

    curl -i -H 'Accept: application/json' http://localhost:PORT

### Response
    Open the html page.
  
`GET /getText`

    curl -i -H 'Accept: application/json' http://localhost:PORT/getText

### Response
    Return the last chunked of text that didnt sent to the client.  
`POST /data`


    curl -d "text=THIS_IS_TEST_DATA_TO_SEND_THE_SERVER" -X POST http://localhost:3000/data

### Response
    The text saved in the local memory of the server
    The text presented in the html to the user
    the text start to be analyzed by analyzeText function
    
    
  





