# Use an official Node runtime as the base image
FROM node:16.13.1

# Set the working directory in the container
WORKDIR /app

COPY . /app

RUN npm install

ARG NODE_ENV

RUN echo ${NODE_ENV}

# Print the value of NODE_ENV
RUN echo "Environment variable NODE_ENV: $NODE_ENV"

RUN if [ "$NODE_ENV" = "production" ]; then npm prune --production; fi


CMD ["npm", "start"]