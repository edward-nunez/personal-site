FROM node:24-alpine

# Add and switch to user for application security
RUN adduser -D -g /bin/bash edwardnunez.io-web
USER edwardnunez.io-web

# Change default directory
WORKDIR /home/edwardnunez.io-web

COPY --chown=edwardnunez.io-web . .

RUN yarn installDeps && \
    yarn run build && \
    yarn run prune && \
    yarn cache clean

# Set defaults for entrypoint and command string
EXPOSE 8080
CMD [ "npx", "pm2-runtime", "npm", "--", "start" ]
