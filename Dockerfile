FROM node:12-alpine

# Add and switch to user for application security
USER node

# Change default directory
WORKDIR /home/node

COPY --chown=node . .

RUN npm install --production

# Set defaults for entrypoint and command string
EXPOSE 8080
CMD ["npx", "pm2-runtime", "npm", "--", "start"]