* docker is needed.
* Postman examples attached into the Postman_requests.json file. load the file into postman and test the endpoints.( for qa env ) 

There are 3 envs relevant.
1. dev -> for localhost, which will require windows
2. qa -> for qa ( containerized env ) -> cd docker/tests and run "docker-compose up -d" 
3. test -> for tests only ( containerized env ) -> cd docker/app run "docker-compose up -d"

When switching between envs you have to make sure that  the old containers are removed for we won't have collisions
or copies of the containers -> "docker-compose down"
