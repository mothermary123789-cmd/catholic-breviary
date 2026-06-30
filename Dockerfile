FROM alpine:latest
RUN apk add --no-cache ca-certificates wget unzip
WORKDIR /app
ARG PB_VERSION=0.26.7
RUN wget -q https://github.com/pocketbase/pocketbase/releases/download/v${PB_VERSION}/pocketbase_${PB_VERSION}_linux_amd64.zip \
    && unzip -q pocketbase_${PB_VERSION}_linux_amd64.zip \
    && rm pocketbase_${PB_VERSION}_linux_amd64.zip
COPY pocketbase/pb_migrations ./pb_migrations
EXPOSE 8090
VOLUME /app/pb_data
CMD ["./pocketbase", "serve", "--http=0.0.0.0:8090"]
