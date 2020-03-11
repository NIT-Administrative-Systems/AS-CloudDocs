# CloudFront CDN
CloudFront is Amazon's content delivery network. It allows you to cache static files like images, JS, and CSS in locations physically close to users, improving load times for your website.

The secondary function of CloudFront is that it enables you to run Lambda@Edge functions along with requests for cached files. We have used this to deploy [static websites](https://vuepress.vuejs.org/) to an S3 bucket, then serve the content with CloudFront and a webSSO Lambda@Edge function.

API Gateway offers an edge-optimized version of the product when you're using a custom domain name. This is powered by CloudFront; requests to your API hit Amazon's edge locations and then follow curated network paths back to the AWS region your app exists in.

## Usage
At our scale, CloudFront is very cheap. It is not difficult to set up: you just need a [certificate](./certificates.md) and a hostname. 

You should use it for every web application's static content, unless there is a compelling reason to do otherwise. 

You can set it up for API Gateway. If your API is primarily going to be used via Apigee, it is not as valuable and can be omitted.

There are [three price classes](https://aws.amazon.com/cloudfront/pricing/) for CloudFront that control which geographical regions will have your data cached. If your application is primarily going to be used on campus, the cheapest class includes North America. Users in other regions will still be able to use your app.

Whenever you change the underlying S3 content, you need to issue a cache invalidation to tell CloudFront that it needs to refresh their caches. This is typically done in your Jenkins pipeline, after you have done an S3 sync. Your terraform module should output the S3 bucket & CloudFront distribution name:

```groovy
stage ('Upload Site') {
    steps {
        withCredentials([[
            $class: 'AmazonWebServicesCredentialsBinding',
            credentialsId: 'terraform',
            accessKeyVariable: 'AWS_ACCESS_KEY_ID',
            secretKeyVariable: 'AWS_SECRET_ACCESS_KEY'
        ]]) {
            sh 'export BUCKET_NAME=`terraform output content_bucket_name` && aws s3 sync .build/site "s3://\$BUCKET_NAME" --delete'
            sh 'export CF_DIST_NAME=`terraform output cf_distribution_name` && aws cloudfront create-invalidation --distribution-id "\$CF_DIST_NAME" --paths "/*"'
        }
    }
}
```

## Lambda@Edge
Lambda@Edge runs alongside Amazon's caches. Because it's part of the HTTP request, [the limits are more restrictive](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/cloudfront-limits.html#limits-lambda-at-edge).

This is a tool of last resort. It is powerful, but building application logic into CloudFront -- potentially across several different Lambda@Edge functions, each of which hooks in to a different part of the HTTP request -- is a bad practice. Application logic is best kept in the application, so developers will be able to see the entire picture when developing locally.