FROM node
WORKDIR /usr/src/app
COPY . . 
# to prevent seeding give no arguments
ENTRYPOINT ["./start.sh","seed"]

