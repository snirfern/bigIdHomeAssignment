# BigID Home Assignment

## Requirements

- Docker

## Instructions

There are three relevant environments for this project:

1. **Development Environment**  
   This env enables to run the services ONLY, independently, so interaction from localhost is enabled.  
   Postman_requests.json is attached to the root dir in order to have a ready template for the entire requests.  
   Navigate to the development environment directory:  
   `cd docker/dev`  
   

2. **Quality Assurance Environment**  
   Navigate to the QA environment directory:  
   `cd docker/qa`   
   

3. **Testing Environment**  
   This env is  a container which performs tests and outputs the result to a file located in docker/tests/test-result       
   Navigate to the testing environment directory:  
   `cd docker/test`  
   

## Setup and Execution
execute the following command:

docker-compose -p bigid_namespace down --volumes --remove-orphans && docker-compose -p bigid_namespace build --no-cache && docker-compose -p bigid_namespace up -d



