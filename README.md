# IOT_project

![alt text](https://github.com/livnoni/IOT_project/blob/master/pics/sensor%20diagram.jpg)

This is our project in the IOT course at Ariel University in the Department of Computer Science

##### GENERAL BACKGROUND / CONTEXT
Elderly people need a lot of daily assistance.
The solution nowadays is a personal (human) individual assistant.
We live in an era in which life expectancy rises and so does technology.
Why don't we use this technology to help older people?
Why don't we use smart sensors and advanced software to make life easier for the elderly?

##### The problem:
We aim to solve daily problems for old people through voice commands.
For example: operating the TV, operating air conditioner, using the Internet for a wide range of services,
etc...

#####  OUR SOLUTION
Our solution is a smart home system.
With Android devices, voice commands will be given by the users.
The commands will be transfer to NodeJS server in the local network.
The node server will transfer tasks to the smart agents, such as a IR blaster(Orvibo) that
communicate with IR devices, a selenium server that will perform a variety of automated actions
on the web and more...
It is important to emphasize that the users will install an Android application that continuously
listens to voice commands around the house (without any user interaction).
In addition the voice command will be saved in the server for further learning and automation actions

##### The project contains two main components:
 - Android application
 - Node server

The Android application works offline and makes continuous Speech Recognition in the background, real time converting sound to text using google RecognitionListener library.
In addition the application send HTTP requests to the server with the content of the speech that have been converted into text.

The node server gets the data from the Android application to analyze the data.

If the server 'understand' the command, it executes it.



# REST API

The REST API to the example app is described below.

## Get list of Things

### Request

`GET /`

    curl -i -H 'Accept: application/json' http://localhost:<PORT>

### Response
    Open the html page.
  
`GET /getText`

    curl -i -H 'Accept: application/json' http://localhost:<PORT>/getText

### Response
    Return the last chunk of text that didn't sent to the client.
`POST /data`


    curl -d "text=THIS_IS_TEST_DATA_TO_SEND_THE_SERVER" -X POST http://localhost:<PORT>/<data>

### Response
    The text saved in the server local storage
    The text presented in the html page to the user
    the server analyzed by analyzeText function
    
    
  





