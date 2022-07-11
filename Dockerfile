# START NODE BUILD
FROM node:17-alpine AS NODE_BUILD
WORKDIR /backend
COPY ./backend/package.json .
COPY ./backend/yarn.lock .
RUN yarn
COPY ./backend .
CMD yarn build
# END NODE BUILD

########################################################################

# START REACT_BUILD
FROM node:17-alpine AS REACT_BUILD
WORKDIR /frontend
COPY ./frontend/package.json .
COPY ./frontend/yarn.lock .
RUN yarn
COPY ./frontend .
CMD yarn build
# END REACT BUILD

########################################################################

# FINAL BUILD DOCKER IMAGE



# FROM node:17-alpine as NODE_BUILD
# WORKDIR /app
# COPY package.json .
# COPY yarn.lock .
# COPY . .
# RUN yarn
# RUN yarn build
# COPY ./src/swagger.yml ./dist


# FROM node:17-alpine
# WORKDIR /app
# COPY package.json .
# COPY --from=NODE_BUILD /app/dist .
# COPY --from=NODE_BUILD /app/.env .
# RUN yarn install --production=true
# RUN yarn global add pm2
# EXPOSE 5000
# CMD ["node", "app.js"]




# # START ANGULAR_BUILD
# FROM node:14-alpine AS ANGULAR_BUILD
# WORKDIR /myapp-frontend-angular
# COPY ./myapp-frontend-angular/package.json .
# COPY ./myapp-frontend-angular/package-lock.json .
# RUN npm install
# COPY ./myapp-frontend-angular .

# # copy schema and query to run script before build: "npm run codegen"
# COPY ./myapp-backend-go/graph/schema ../myapp-backend-go/graph/schema/
# COPY ./myapp-backend-go/graph/query ../myapp-backend-go/graph/query/

# RUN npm run build
# # END ANGULAR_BUILD

# ################################################################################

# # START GO_BUILD
# FROM golang:1.16-alpine AS GO_BUILD
# WORKDIR /myapp-backend-go
# RUN apk add build-base
# COPY ./myapp-backend-go .

# RUN make before-build
# RUN go build ./server.go
# # END GO_BUILD

# ################################################################################

# # FINAL BUILD DOCKER IMAGE
# FROM alpine:3
# WORKDIR /app
# COPY --from=ANGULAR_BUILD /myapp-frontend-angular/dist/myapp-frontend-angular/ ./myapp-frontend-angular/dist/myapp-frontend-angular/
# COPY --from=GO_BUILD ./myapp-backend-go/server ./
# ENV IS_INCLUDE_MYAPP_FRONTEND_ANGULAR=true
# ENV ENVIRONMENT=default
# ENV PORT=9999
# COPY /myapp-backend-go/internal/config/config.yaml /app/internal/config/
# CMD ./server -e ${ENVIRONMENT}
