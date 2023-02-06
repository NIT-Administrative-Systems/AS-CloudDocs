# File Handling on Lambda
Often, web applications will allow a user to upload content through a form and process that data, or stream content to an authorized user. Processing uploaded data may be a time-consuming task, depending on what it is. 

Serverless is about working within constraints. When using Lambda and API Gateway together[^1], these quotas constrain our ability to do these things:

[^1]: Lambda has two separate sets of quotas, depending on if its invoked synchronously or asynchronously. API Gateway will always invoke it synchronously, so this document ignores the asynchronous quotas.

| Quota              | Limit      | Service     | Impact                                                                                                                 |
|--------------------|------------|-------------|------------------------------------------------------------------------------------------------------------------------|
| HTTP request size  | 6 MB       | Lambda      | Largest file that can be uploaded is under 6MB when you include base64 encoding, headers, etc.                         |  
| HTTP response size | 6 MB       | Lambda      | Cannot send a download that's more than 6MB.                                                                           |
| Request Timeout    | 30 seconds | API Gateway | Processing any uploaded data or sending any downloads must be completed in ~28 seconds or else the request is aborted. |

These limits are practically a bit lower than the stated quota. For example, binary data is base64-encoded to include in a JSON event that represents the HTTP request. Headers, cookies, and overhead from encoding the data will eat into the 6MB request payload quota.

When used correctly, an S3 bucket can work around the payload quotas by having the end-user's browser send data to and from S3 directly instead of channeling it through the API Gateway & Lambda to your application backend. 

This is also cheaper: the compute time for a Lambda to process a 4MB file upload is more expensive than the bandwidth for somebody to upload a file to S3. It's a very small amount of money, but in an application serving lots of requests, this can add up to a significant cost.

The request size quotas are specific to the request & response events, and are *not* a limit on Lambda's networking capabilities. Lambdas can write 1TB of data to another service such as S3 as long as it complies with the above quotas.

## Understanding Traditional File Uploads & Downloads
In a traditional application, if a user wishes to upload an avatar image, this can be done with an `<input type="file">` tag inside of a form that POSTs data to the server. The server may then validate the file is a PNG of certain dimensions before storing it.

The form POST would look something like this, with all the image data included inside the HTTP request:

```http request
POST /upload HTTP/1.1
Content-Type: multipart/form-data; boundary=---------------------------9051914041544843365972754266
Content-Length: 2048

Content-Disposition: form-data; name="file2"; filename="a.png"
Content-Type: image/png

[binary data here]
-----------------------------9051914041544843365972754266--
```

```mermaid
sequenceDiagram
    Browser->>Web Server: POST /upload
    Web Server->>Application: Temp file data to process
    Application->>Disk: Store the file
    Application->>Browser: HTTP 200 OK
```

If only authorized users should have access to download the avatar image, a request might be made to the application backend. It will verify the user is authorized, and then send the contents of the file with a `Content-Type: image/png` header.

```mermaid
sequenceDiagram
    Browser->>Web Server: GET /moses-avatar.png
    Web Server->>Application: Can I have the data for /moses-avatar.png?
    Application->>Disk: If authorized, grab the data
    Application->>Browser: HTTP 200 OK
```

## Understanding API Gateway & Lambda
To help understand the rationale behind the 6MB payload constraint, it helps to understand how AWS serverless products implement the concepts from the previous section.

Instead of a traditional web server that hands off either the HTTP request or a FastCGI request[^2] to the backend application, the API Gateway receives an HTTP request and converts it [into JSON](https://docs.aws.amazon.com/apigateway/latest/developerguide/http-api-develop-integrations-lambda.html). 

[^2]: FastCGI is a binary protocol that Apache, Nginx, and other webservers can convert HTTP requests into when talking to an application backend. For example, the PHP application server PHP-FPM accepts FastCGI requests.

JSON is a text format, so to represent binary data, it must be base64 encoded to be represented as a string. Encoding the data this way will [increase its size by at least 33%](https://developer.mozilla.org/en-US/docs/Glossary/Base64#encoded_size_increase). In total, this JSON, which must also include headers and other bits of the request, cannot exceed 6MB.

```mermaid
sequenceDiagram
    Browser->>API Gateway: GET /some-url
    API Gateway->>Lambda: { "method": "GET",<br>"url": "/some-url",<br>... }
    Lambda->>API Gateway: { "status": 200 }
    API Gateway->>Browser: HTTP 200 OK
```

The 6MB quota itself likely comes from the need to parse the JSON event quickly. Several megabytes of JSON can be both CPU & memory intensive, and this is designed to work with Lambda runtimes with as little as 128MB of memory.

## Using S3 for File Storage
To work around the constraints, browsers should be uploading data to S3 instead of including it with their HTTP requests to the application, and providing the S3 object key in their form submission.

However, it's not a good idea to have an S3 bucket just be open for anybody to upload files -- the application still needs to control who is authorized to upload data. Otherwise, any Random Internet Person could begin flooding our S3 buckets with garbage data and there would be no way to stop it.

### Delegating Authorization to a User
If the S3 bucket is not public, then it must be private -- which requires credentials in order to upload or download anything. A set of AWS credentials is very valuable and cannot be given out to end-users.

S3 has a mechanism that allows the application to tightly control authorization *without* exposing any crdentials: pre-signed URLs. 

These are URLs for specific S3 API calls such as uploading an object called `moses-avatar.png`, or downloading an object called `moses-avatar.png`. The URL is generated server-side and contains all the necessary information about what the URL is for, plus a signature to prevent tampering with those settings. This URL is only valid for a short period of time. This way, no AWS credentials need to be exposed -- only a time-limited URL authorizing the bearer to manipulate one object in S3.

Here is an example URL broken out by parameter allowing somebody to change or download the `boots-6d3ce8db-6575-4d8d-b2f1-b92408d6a6f8.png` object. The `X-Amz-Signature` is key to the concept: that is the mechanisms which secure this URL from being tampered with to give somebody unintended access. Change any of the other parameters would change the signature, so when it's calculated and verified, it would no longer match.

```
https://cap-file-submissions-sbx.s3.us-east-2.amazonaws.com/boots-6d3ce8db-6575-4d8d-b2f1-b92408d6a6f8.png
?x-amz-acl=private
&x-amz-server-side-encryption=aws%3Akms
&x-amz-server-side-encryption-aws-kms-key-id=d4569e7e-902f-4be9-8036-c8d272f75104
&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD
&X-Amz-Algorithm=AWS4-HMAC-SHA256
&X-Amz-Credential=AKIARHUTWT6JCCZWET54%2F20230203%2Fus-east-2%2Fs3%2Faws4_request
&X-Amz-Date=20230203T214103Z
&X-Amz-SignedHeaders=host%3Bx-amz-acl%3Bx-amz-server-side-encryption%3Bx-amz-server-side-encryption-aws-kms-key-id
&X-Amz-Expires=300
&X-Amz-Signature=23efc6fca562c364d40c0a79cac9a0a398acd0639535e5bc58371507b8dcaea3
```

### Time Limit
The pre-signed URLs have a time limit on them and should be generated as the user is ready to use them. This limit is defined when the application creates the pre-signed URL, but it should never be longer than five minutes.

This means that file upload forms should not proactively generate a pre-signed URL when the form HTML is rendered. A user may sit on this page for hours without filling out the form, and it would be a problem if the URL expired before they attempted the file upload.

For a similar reason, it is inadvisable to put pre-signed URLs into `<a href="...">` tags: the user may not click them before they expire. For embedded media (`<img>`, `<obejct>`) that the browser will download as soon as the page renders, it's fine to use the pre-signed URL directly.

### Implementing Uploads
Implementing this in a web application requires a bit of dancing. The `<input type="file">` field is no longer enough; instead, some Javascript is required to ask the application for a pre-signed URL when a user is ready to do a file upload. Then, the file needs to be uploaded to S3 immediately using that URL. 

There is an additional step needed in this approach to verify the file was uploaded: when the form is submitted, the browser should include the S3 object key. The application should verify that the data was actually uploaded when it validates the inputs.

The flow would typically look like:

```mermaid
sequenceDiagram
    actor User
    User->>Browser: "Clicks 'Upload File' in a Form"
    Browser->>Application: Asks for Presigned Upload URL
    Application->>S3: Sign URL for /avatar.png
    Application->>Browser: Gives URL
    Browser->>S3: POST /avatar.png?X-Amz-Signature=...
    User->>Browser: Submits form
    Browser->>Application: POST /upload?file=avatar.png
    Application->>S3: Does avatar.png exist?
    Application->>User: Saved!
```

There are frontend libraries to facilitate this. When using our Laravel stack, Livewire has support for uploading files to S3 and does all of this for you. Or, you can implement these steps yourself using `fetch()`.

### Implementing Downloads
For private data, a pre-signed URL to `GET` an object directly from S3 should be used. Even in cases where the Lambda generates a file that could exceed the response size quota, the Lambda needs to put the file in S3 and then send a pre-signed URL to retrieve it.

In the application backend, this is implemented very similarly: check if the user is authorized to access an object, and then call the S3 API to generate a pre-signed URL to download that object. The pre-signed URL may include a [`Content-Disposition` header](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Disposition) if the object should be downloaded with a certain filename.

When *uploading* files, the URL usually needs to be sent to the browser so the upload can be handled by Javascript. Downloads are usually more straightforward than the two-step uploads process: click the link, get the file.

The simplest way to implement that is to redirect authorized users directly to S3 from the application. If a user clicks the link for `/avatar.png`, the server can check their authorization and then send an HTTP redirect with the pre-signed S3 URL. This works for links, `<img src="...">`, or even `<object data="...">` embeds for PDFs.

```mermaid
sequenceDiagram
    actor User
    User->>Browser: "Clicks 'Download' Link"
    Browser->>Application: GET /avatar.png
    Application->>S3: Sign URL for GET /avatar.png
    Application->>Browser: HTTP 301 Moved Permanently 
    Browser->>S3: GET /avatar.png?X-Amz-Signature=...
```