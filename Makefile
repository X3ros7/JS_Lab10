#
# This is a Makefile for the project
# It is used to start the backend and frontend servers
# Simplifies the process of starting the servers
#

# Start Express app 
start-backend:
	cd server && npm start

# Start Angular app
start-frontend:
	cd client && npm start

