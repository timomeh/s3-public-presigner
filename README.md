# S3 Public Presigner

A small service that redirects public URLs to presigned S3 URLs. The public path matches the S3 object key in the bucket.

Deploy it on Railway to make private files in buckets publicly accessible.

[![Deploy on Railway](https://railway.com/button.svg)](https://railway.com/deploy/public-bucket-urls?utm_medium=integration&utm_source=template&utm_campaign=generic)

## Demo

Open this image:

https://bucket-public-presigner-demo.up.railway.app/duck.png

It's stored in a private bucket. The URL redirects to a presigned URL. If you're using Railway Buckets, the egress will be free.

## Features

- Use public URLs to access private files in buckets, save on service egress
- Add your custom domain to the service for nice URLs
- Fast request handling with Bun runtime
- Opt-in to 404 handling
- Presigned URL generation with configurable expiration

## Description

This lightweight service will redirect all URLs to presigned URLs of your bucket. Presigned URLs are temporary, signed URLs that grant time-limited access to specific objects in your bucket.

- The public URL will not expire. Files will always be accessible using the public URL.
- The service redirects to a temporary URL. This URL will expire after a configurable time.

## Caution

This will make all files in your bucket publicly accessible. Only use this if you store files that everyone in the world should be able to see.

## Configuration

### S3 credentials (required)

Set the following environment variables to your S3-compatible bucket:

```
S3_REGION=your_region
S3_ACCESS_KEY_ID=your_access_key
S3_SECRET_ACCESS_KEY=your_secret_key
S3_BUCKET=your_bucket_name
S3_ENDPOINT=https://your_endpoint

# for virtual-hosted style buckets
S3_ENDPOINT=https://your_bucket_name.your_endpoint
```

### Configure presigned URL expiration

By default, the presigned URLs will expire after 1 hour (3600 seconds). You can customize it by setting an environment variable.

This will make the redirected URL be valid for a longer time. Use this if you share the redirected URL with users. You usually want to share the public URL with users, so this is often not necessary.

```
# Example: 5 minutes
PRESIGNED_URL_EXPIRATION_SECONDS=300

# Example: 7 days
PRESIGNED_URL_EXPIRATION_SECONDS=604800
```

### Not Found handling

By default, the service will try to redirect to all files, even if a file doesn't exist. If a user tries to access a file that doesn't exist, they will see an S3 API error, which looks like this:

```xml
<Error>
  <Code>NoSuchKey</Code>
  <Message>The specified key does not exist.</Message>
  <Resource>/some-file</Resource>
  <RequestId>xxx</RequestId>
  <Key>some-file</Key>
  <BucketName>your-bucket-name</BucketName>
</Error>
```

You can set the following environment variable to return a nicer looking error:

```
USE_NICE_NOT_FOUND=1
```

If a user tries to access a file that doesn't exist, they will see the following error:

```
File not found
```

Setting this increases the latency of the service slightly, because it needs to first look up if the object exists.

## How to use yourself

- Install bun
- Install dependencies with `bun install`
- Configure environment variables (see above)
- Start the server with `bun start`

To contribue, check out [CONTRIBUTING.md](./CONTRIBUTING.md)

## License

MIT
