### udemy course

## CICD
- summary:
    - CodeCommit = version control
    - CodePipeline = pipeline orchestration
    - CodeBuild = build and test
    - CodeDeploy = deploying to EC2
    - CodeStar = scaffolds all the other developer services
    - CodeArtifact = store, publish, share pkgs
    - CodeGuru = ML automated code reviews
    - Cloud9 - online IDE
- CodeCommit
    - secure - ssh or https for auth
    - encrypted using kms
    - no size limit
    - fully managed
    - open source tool integrations
- CodePipeline
    - integrates with all the other tools here
    - configure in stages (like gitlab yml)
        - stages have multiple action groups
    - each pipeline creates artifact(s) in s3
    - fails and cancels can be sent to CloudWatch
    - trigger via CloudWatch events or with periodic codepipeline checks
    - manual approval an option for triggering a stage
        - i.e. triggering CodeDeploy to prod
        - approver must have GetPipeline and PutApprovalResult IAM perms
    - can integrate with CloudFormation
- CodeBuild
    - sources = CodeCommit, S3, bitbucket, github
    - buildspec.yml for instructions
        - must be in root
        - copies in specified source code files
        - runs specific instructions in phases
            - install, pre_build, build, post_build
        - sounds similar to Dockerfile
        - runs in CodeBuild container
        - define env vars here
            - or pull from Secrets Manager or Parameter Store
    - output logs to CloudWatch or S3
    - envs for most languages and docker for the rest
    - can cache files in S3 bucket across builds or for large builds
    - can run locally for troubleshooting beyond logs
    - can run from inside your vpc
- CodeDeploy
    - to EC2, on-prem, Lambda, ECS
    - on fail:
        - auto rollback
        - or trigger CloudWatch alarm
    - appspec.yml defines config
    - rollbacks are really redeploys of last working instance
    - each hosting service has its own lifecycle events, but generally:
        - ApplicationStop, DownloadBundle, BeforeInstall, Install, AfterInstall, ApplicationStart, ValidateService
    - deployment strategies
        - in-place
            - AllAtOnce - down time, fast
            - HalfAtATime - middle of the boat
            - OneAtATime - high availability, slow
        - blue/green
            - new version built on side then replaces
    - CodeDeploy Agent
        - computer user
        - needs to be installed on EC2 instance(s)
        - separately, instance needs S3 permissions to go and get to-be-deployed artifacts
    - Lambda integration
        - linear = % pointing towards new version increases every N minutes
            - i.e. LambdaLinear10PercentEvery3Minutes
        - Canary = point small % to new version then straight to 100%
            - i.e. LambdaCanary10Percent5Minutes
        - AllAtOnce = 100% right away
    - ECS integration
        - only blue/green strategy
        - works similar to Lambda
            - linear, canary, AllAtOnce
            - i.e. ECSCanary10Percent5Minutes
- CodeStar
    - scaffolds all of the other service for you
    - select configured options and it creates a CodeCommit repo with files, creates a CodePipeline with build and deploy to Beanstalk/EC2/etc.
- CodeArtifact
    - dependency storage
    - use with npm, pip, maven, etc.
    - caches dependencies so they're not lost
    - secure
    - proxy to public npmjs stores
    - CodeBuild can get from here instead of public stores
    - can trigger EventBridge events which in turn can trigger CodeDeploy 
        - i.e. on every new dependency version
    - has multiple repositories
    - use "Domain" for shared deps across repositories
- CodeGuru
    - CodeGuru Reviewer = ML code reviews, bugs, security vulnerabilities
        - STATIC code analysis
    - Profiler = code performance analysis
        - on live/runtime of app
    - define how deep in callstack to go
    - define report intervals
- Cloud9
    - online IDE
    - prepackaged with dev envs (js, python, etc.)
    - spins up EC2 insts to run code

## Cognito
- federated identities, amzn, FB, google, apple, saml
    - need 3rd party client ID, secret
- user pools
    - customer signin
    - integrates with API gateway and ALB
    - serverless node hits user db
    - MFA (email, phone)
    - PW reset
    - responds with JWT
        - username
        - "sub" property is user id
    - uses SES - simple email service
    - provides UI
        - custom domain - need ACM cert, define in app integration 
    - user mgmt dashboard
    - Lambda triggers on action (i.e. signup)
    - "adaptive auth"
        - generates a risk score based on login (IP, location, device)
        - can do more MFA if high risk
- identity pools ("federated identities")
    - temporary creds
    - for users trying to access aws resources
        - define given IAM policies in cognito
        - policy can give permissions like `cognito-id.sub` for any of this user's dynamodb/s3 data
    - id pool (source/db) can be:
        - 3rd party (fb, google, etc.), cognito user pool, saml
        - guest access (unauthed)

## Lambda
- integrates with Events for cron
- integrates with kinesis for processing streaming data
- can be sync or async
- sync if client needs response
- functions take in event, context args
- networking
    - by default deployed outside your vpc
    - but can put it in your vpc
        - public VPC will not give your Lambda public access in either direction. can't do it
        - Lambda needs specific permissions
        - if private vpc use NAT gateway to make Lambda public
- performance
    - add more RAM to get more vCPUs
    - 3s default timeout, up to 15m
    - can cache connections (i.e. db) across calls if defined outside of function
    - cache (ephemeral) files in /tmp folder for across calls (10GB of space)
    - Lambda Layers for storing dependencies locally rather than reinstalling every run
- concurrency
    - account wide 1000 running instances
    - can set "reserved concurrency" per function
        - will always have these instances available, no other function can take them
    - can use "provisioned concurrency" to keep X instances warm to reduce initialization after downtime
        - already initialized exec envs
- logging
    - auto sends to CloudWatch logs
    - can config to send to X-Ray
- Edge Function
    - running lambdas in CloudFront at an edge location
    - CloudFront Functions vs Lambda@Edge
        - 1 only JS - faster
        - 2 only Node or Python
        - 1 ultra small
            - small max mem
            - small max execution time
        - 1 no network, FS, request body access
        - 2 yes
- ALB integration
    - to expose Lambda to https endpoint
    - function must be registered in target group
    - converts http request to json for Lambda
    - Lambda should return json
    - need to configure to handle multi-header values (query param lists)
- async
    - lots of integrations for invoking
        - S3, SNS, CloudWatch Events/EventBridge, and others but not needed
    - events put in a queue
    - retries 3 times if error
    - idempotent is requirement
    - define DLQ for failures
        - Lambda func needs IAM permissions to write to queue
    - 202 response for successful invoke but unknown response (could be failure)
    - permissions live on Lambda function
- event invocation
    - EventBridge cron rule
        - every x time
        - or "cron statement" more granular/specific
    - EventBridge CodePipeline event rule
    - S3 event integration
- event source mapping
    - from kinesis streams, dynamodb streams, sqs queue
    - Lambda polls stream/queue
    - can config Lambda to batch process in parallel
        - usually for high traffic streams
    - error in stream/batch will cause entire batch to reprocess or pause
    - SQS + FIFO
- "destinations"
    - like DLQ but for failed AND successful events
    - for async
        - goes to SQS, SNS, Lambda, or EventBridge bus
    - for event mapping
        - goes to SQS, SNS
- CloudFormation deployment - write yaml, ref S3 zip file with func + deps packaged up
- containerize via ECR, up to 10GB, write standard Dockerfile
    - aws has lambda base images, already cached
- aliases
    - point to a specific version
    - canary deployment (95% pointing to v2 (prod), 5% to v3 (test))
- w/ CodeDeploy
    - uses SAM (serverless application model - serverless IaC that uses CloudFormation)
    - same deployment strategies: linear, canary, all-at-once
- accessing via URL
    - can expose w/out api gateway or ALB
    - CORS config available
    - can only point to 1 alias
    - need to add IAM permissions to lambda with AuthType: None, action: invoke, principal: *
        - cross account then both sides need perms
- integrates with CodeGuru
- limits
    - 10GB of RAM/mem
    - 900s/15m timeout
    - /tmp space of 10G
    - 1000 concurrent instances
    - zip file, 50MB compressed, 250MB uncompressed
    - 4KB of env var space

### Route 53
- DNS, domain registrar
- "zone file" = hashmap url: IP
- "name server" resolves dns queries
- "authoratative" = we configure url -> IP records
- "hostname" ugly aws url aws.region.az.service.instancename.com
- record:
    - domain - url
    - record type - A|AAAA|CNAME|NS
        - A = domain: IPv4
        - AAAA = domain: IPv6
        - CNAME = domain A: domain B
        - CNAME vs alias (A, AAAA)
            - cname = domain to any hostname, must have > 2 domain levels (blah.domain.com)
            - alias = domain to any hostname, can point direct to 2 level domain (domain.com)
                - free
                - native health check
        - NS = name servers - reroutes to help in finding your final IP
    - value - IP
    - routing policy - how 53 responds
    - ttl - time record is cached in 53
- $0.50 per month per domain name
- public hosted zone
- private hosted zone
    - to access resources inside a VPC

### API Gateway
- serverless
- websockets capable
- versioning and env (dev, prod) capable
- security - auth, api keys, throttling
- caching
- 29s timeout
- api types
    - http api
        - cheapest
        - proxies
        - no data mapping
        - no api keys or usage plans
        - CORS and OAuth for sec
    - rest api
        - all the features
    - websocket api
        - lambda functions for each life cycle (OnConnect, SendMessage, OnDisconnect)
        - broadcast by hitting api gateway "callback" endpoint from lambda code. sameurl/@connections/connectionId
        - routing - specify "route selection expression" (msg json attr) and define routing map to point to a specific endpoint/function
        - persist connectionIds in DynamoDB
- endpoint types
    - edge optimized
        - default
        - just in one region but all CloudFront edge locations know about it
    - regional
        - for targeting a specific region
        - can manually configure to CloudFront
    - private
        - only accessible from inside your VPC
- security
    - auth - IAM, cognito, custom
    - HTTPS - thru ACM
- integration types
    - MOCK = stubbed endpoints for WIP
    - HTTP_PROXY = just passes req/res
    - AWS_PROXY = lambda
- mapping template
    - translates req/res allowing i.e. json payload going into xml endpoint(s)
    - or formats
- OpenApi compatible (import or export)
    - including validations, but why?
- caching
    - defined at stage level
    - each endpoint can be customized
    - default 300s, up to 3600s
    - expensive
    - Cache-Control: max-age=0
        - plz configure to require IAM permissions
- usage plan
    - customers use api, $$ and configuring how much and who uses API
    - uses api keys to ID customer
- api keys
    - X-Api-Key header needed
    - 1. build, deploy api gateway
    - 2. create usage plan
    - 3. create api key
    - 4. assoc. stages + keys w/ usage plan
- CloudWatch integration
    - at stage level
    - configure logging level (ERROR, INFO, DEBUG, etc.)
    - use x-ray for enhanced logs
    - metrics
        - CacheHitCount, CacheMissCount = cache efficiency checks
        - Count = total endpoint hits
        - IntegrationLatency = measure of fwd to BE service until response from BE service
        - Latency = total in-to-out time
        - 4XXErrors, 5XXErrors = error counts
- throttling
    - 429 status code
    - default 10k/s across all apis
    - can throttle individual endpoints to save entire system
- CORS
    - must enable on API gateway side (do thru console)
    - headers required
        - Access-Control-Allow-Methods
        - Access-Control-Allow-Headers
        - Access-Control-Allow-Origin
- auth
    - IAM policy - sig v4
    - resource policy
        - cross account access
        - for specific IP or endpoint only
    - Cognito User pool
    - Lambda/custom authorizer
        - a (auth spec) lambda handles auth
        - responds with resource policy
        - policy is cached at api gateway level

### messaging
- event based pro - spike resistant
- "decoupling" key word
- SQS
    - "producer" - msg sender, can be multiple (SendMessage)
    - "consumer" - polls queue, processes, deletes (DeleteMessage)
    - "visibility timeout" - when message is able to be read again after initial read
        - in case of process failure
        - ChangeMessageVisibility - to extend invisibility
    - "group_id" = sort of like partition key
        - but no partitioning
    - MaximumReceives = # of reads before a msg is sent to DLQ
    - Standard Queue
        - unlimited throughput
        - unlimited # of msgs in queue
        - retention: default 4 days, max 14
        - low latency < 10ms for publish and receive
        - 256KB limit per msg
        - "at least once delivery" - can be sent twice
        - order unimportant
    - consumer can consume up to 10 msgs at once
    - ASG can scale w/ Queue Length
        - ApproximateNumberOfMessages
        - use CloudWatch Alarm to trigger scale
    - encrypted in-flight with HTTPS and at rest with KMS
    - Long polling
        - to reduce consumer reqs
        - queue sends response slower, waits to see if any msgs come in
        - 1-20s
        - can configure at queue level
        - or ReceiveMessageWaitTimeSeconds property on message send
    - Delay Queue
        - configure to have messages invisible for set time at the beginning of their life
        - or, on msg send, can set delay time
    - SQS extended client - s3 storage for larger msgs
    - FIFO queue
        - same kind of queue just with more integrity
        - can delete duplicates
            - content based or group id
        - messages processed in order by consumers
        - lower throughput (300m/s)
- SNS
    - pub/sub (not just an email sending service)
    - "fan out" pattern - so multiple subscribers can read from separate queues
                      /-> SQS1 -> consumer 1
    producer --> SNS --> SQS2 -> consumer 2
                      \-> SQS3 -> consumer 3
    - FIFO SNS queues too
    - "filter policy" - if multi topics in SNS, only sends 1 topic to a subscriber (i.e. orders to sub1 + cancels to sub2)
- Kinesis
    - analytics
    - video, click, event stream
    - streams
        - partition key is important
        - lots of data, lots of shards
        - PutRecord API action
        - ProvisionedThroughputExceededError
            - choose better partition key
            - scale (split shards)
            - retries w/ exponential backoff
    - KCL - Kinesis Client Library
        - workers/processors
        - max number of workers = number of shards
        - each worker tracks its reads in DynamoDB (needs perms)
        - can run on EC2, Beanstalk
    - shards can be split and merged
        - splits retire old shard and make 2 new ones with the original data
    - Kinesis Data Firehose
        - "ingestion service"
            - can read from other datastores
            - can be written to directly (SDK, agent, etc.)
        - writes to S3, Redshift, OpenSearch (amzn elastisearch), 3rd party, custom http endpoint
        - "near real time" 60 second latency for any batch
            - "buffer" = batch size of when to write to source
            - configurable
    - Kinesis Data Analytics
        - reads from and writes to Kinesis Streams and Firehose
        - SQL based
        - Apache Flink option
            - more powerful queries than SQL
            - cannot read from Firehose
            - can read from MSK (kafka)

### monitoring & telemetry
- CloudWatch
    - metrics
        - dimension = grouping attr (instanceId, environment, etc.)
            - up to 30 dimensions per metric
        - belongs to a namespace (kind of like a tag)
        - detailed monitoring = metrics every 1m instead of default every 5m ($$)
        - custom metrics
            - "PutMetricData" api call in your code
            - !! can be pushed in past or future
                - configure EC2 instance time correctly plz
            - EC2 memory usage needs to be a custom metric
            - detailed monitoring
                - standard - 1m
                - high resolution - 1s-30s (higher cost)
    - logs
        - define custom expiry
        - Log groups: tags
        - Log stream: application, container, etc.
        - can send them to streams, S3, Lambda etc.
        - encrypted by default
        - custom KMS encryption option
        - use SDK or CloudWatch Logs Agent
        - also lots of services auto send logs
        - CloudWatch Logs Insights - query tool
        - exporting
            - perms needed on both sides
            - S3
                - up to 12 hrs
                - CreateExportTask
        - CloudWatch Logs Subscriptions
            - for real time processing/analysis
            - send it to specific stream
            - use "subscription filter" to define which logs are sent
            - cross account subscriptions
                - sends data to "Subscription Destination" in recipient account
        - aggregations
            - can be across region or account
    - CloudWatch Logs Metric Filter
        - create metrics based off of logs
        - with specific filter aspects
        - i.e. counts of "ERROR"
        - can be used to trigger alarms
        - not retroactive, only sends matching logs
    - alarms
        - if metric goes over a set point
        - states = OK, INSUFFICIENT_DATA, ALARM
        - period = amount of time we measure metric over
        - high resolution metrics can trigger alarm every 10s
        - targets
            - EC2 instance (stop, reboot, recover)
                - alarm not just email actions! can trigger reboot actions etc.
            - ASG - scale out or in
            - SNS
        - composite alarms
            - combo multiple alarms together with AND/OR
            - alert only when conditions of 2 or more alarms are ALARMing
        - can manually trigger alarm to test resulting actions
    - CW Synthetics Canary
        - sounds like some E2E testing
        - screenshot tracking and comparison to uploaded
        - "Broken Link Checker" checks any list of URLs
        - "Canary Recorder" - click action recorder to write your tests automatically
- EventBridge
    - schedule cron jobs
    - Event Pattern listener to trigger other actions
        - from other services i.e. IAM signin, EC2 instance start, CodeBuild fail
    - actions in Lambda, EC2, CodePipeline, etc.
    - partner event bus for 3rd party integration
    - schema registry for event format
        - can be versioned
    - resource based policy for intra account, region events
- X-Ray
    - visual trace or map of system/interactions
    - "tracing" - each top level req has its own trace
        - can add annotations to trace
            - custom metadata (k/v) on trace for filtering
        - for each component: traces made up of "segments" and sub segments
    - "sampling" - capturing only subset of traces to keep x-ray reqs small
        - configure rules of which or how many reqs to send
    - Java, python, Go, Node, .Net
    - use SDK in your app layer
    - configure or add X-Ray daemon
    - give service X-Ray write IAM perms
    - Lambda enable "active tracing"
    - "instrument my code/app" - measure a product's perf, diagnose errs, save trace info
- Open Telemetry
    - open source x-ray
    - aws has a distrobution of it
    - can send data to x-ray AND 3rd party
- CloudTrail
    - enabled by default
    - can be put into CW Logs or S3
    - mgmt events - user, role actions
    - insights events - ML to find unusual activity
    - doesn't save data events
    - 90 day retention

### Security
- general
    - HTTPS/SSL - at tansmission
    - at rest
        - server side encryption - server gets key from KMS and encrypts before write to DB
        - client side encryption - client gets key, encrypts data, sends to server, write to DB
- KMS
    - able to audit key usage with CloudTrail
    - "KMS Keys"
        - symmetric encryption (AES-256)
            - single key
            - we hit KMS API for encryption, we never see key
        - asymmetric encryption (RSA & ECC key pair)
            - public key used for encrypt
            - private key used for decrypt
            - for use with users outside of AWS cloud, where they'll need to take their key with them
        - types:
            - aws owned keys
            - aws managed keys - used w/in services, no user control
            - customer managed keys
                - can be created in KMS or...
                - imported - not aws generated
        - rotation every 1 year
            - need to enable for customer managed
    - keys are scoped per region
        - so to copy encrypted EBS volume to different volume: encrypt > snapshot > copy to region > re encrypt with new key
    - key policy
        - key can't be accessed w/o one
        - default everyone in aws acct can access
    - custom keys
        - define principals, roles, etc.
        - define who admin is
        - used for cross account
        - can have an alias
    - 4KB limit
    - if over use Envelope encryption = GenerateDataKey API call
        - gives you DEK - data encryption key
        - AND encrypted DEK
        - encrypt file with DEK
        - put file and encrypted DEK together and send to storage
    - API calls
        - Encrypt
        - Decrypt
        - GenerateDataKey
        - GenerateDataKeyWithoutPlaintext - test trick, used for manual encryption. doesn't encrypt for you
        - all calls share same quota of max # of calls w/in reagion
    - S3 SSE KMS encryption
        - S3 bucket key
        - S3 gets DEK and can therefore do encryption on S3 side
            - better than hitting KMS every time
    - default KMS key looks like:
        {
            Effect: 'allow',
            Action: 'kms:*',
            Principal: { AWS: 'aws:arn:iam::acct_id:username' },
            Resource: '*',
        }
- CloudHSM
    - Hardware Security Module
    - if you need custom encryption, for extra sec. or compliance
    - they give us hardware we manage encryption software/algos
    - we manage encryption keys
    - integrate with KMS via custom key store
- SSM Parameter Store (SSM = Simple Systems Manager)
    - stores configs for apps
    - integrates with KMS easily to encrypt (app would need KMS perms)
    - version controlled
- Secrets Manager
    - capability to force rotation of secrets
        - on schedule
        - on demand
        - integrates with DBs
        - replicate across regions easily
    - integrates with CloudFormation easily
        - create ref in yml and can use that throughout other services

### Containers
- ECS
    - EC2 launch type
        - we manage/provision servers
        - cluster of instances
        - multiple tasks = container
        - ECS Agent must be running on EC2 instance
            - or does it run in container/task?
            - agent talks to ECR, CW Logs, ECS service, S3
            - task must have "instance profile" (a policy/role for an instance)
            - dif tasks can have dif roles
                - defined in task def
    - Fargate launch type
        - serverless
        - just define types of tasks and configure how much RAM, CPU you need
    - ALB in front of cluster to point to task
        - to expose task to public URL
        - use Network Load Balancer for high throughput needs
    - EFS attaches to cluster
        - multi-AZ
    - creates ASG for us behind the scenes
- EKS
- ECR
- Beanstalk

### DynamoDB
- DynamoDB Accelerator (DAX)
    - only supports write through caching


## practice test 18 aug review
- CloudFormation template properties
    Resources:
        ResourceName1:
            Type: AWS::EC2::Instance
            Properties:
                type: t2micro
                ...
        MyEIP:
            Type: AWS::EC2::EIP
            Properties:
                InstanceId: !Ref ResouceName1
- SAM template properties
    - same as above
    - but with its own CLI
    - Transform - transforms SAM into CloudFormation template
- buildspec properties
    phases:
        install:
            commands:
                - blah
        pre_build, build, post_build
- appspec properties
    permissions:
        owner: ec2-user
    hooks:
        ApplicationStop:
            location: blah.sh
            timeout: int
            runas: ec2-user
- lambda context and event arg shapes
    - context - info about the runtime env, request ID, invoker, etc.
    - event - http req, w/ body etc.
- SWF - simple workflow service = orchestrator
- secrets manager vs acm vs kms vs param store
    - secrets manager = k/v store but encrypts vals. has rotation
    - param store = k/v store
    - kms - encrypts things, doesn't store them
    - acm - cert mngr for SSL/TLS. how domains register for HTTPS
- instance profiles - containers for IAM policies
- "exponential backoff" for throttling error fix
- DynamoDB
    - conditional writes - only set to X if Y is still what i'm changing. solves simultaneous writes
    - eventually consistent reads are more efficient than strongly consistent
    - when measuring efficiency we want highest RCUs per sec x highest item size
        - aka reading more data per action, and more actions per sec
    - 1 eventually consistent RCU needed per 8kb
    - 1 strongly consistent RCU needed per 4kb
    - 1 transactional RCU needed per 2kb
    - 1 WCU needed per 1kb
    - global secondary index - index with different partition and sort keys
    - local secondary index - index with partition key but different sort key
        - local as in within same partition (cuz same partition key)
    - DynamoDB streams = captures data modification events
        - records have 24hr ttl
    - records can have ttl - configure pointer towards your attr
    - scans get every item THEN filters - inefficient
    - BatchGetItem - efficiently get multiple items from multiple tables (2 separate queries at once)
- avoid KMS throttling with a "data key cache"
- "elastic IP" is one that doesn't change across scaling
- Amplify = static site hosting
- S3 PER PREFIX perf - 3,500 PUT/COPY/POST/DELETE or 5,500 GET/HEAD req/s
- IAM roles should be attached to ECS TASKS
- x-ray GetTraceSummaries for finding request by attr
- lambda event source mappings are for when lambda needs to poll aka no invocation
    - so sqs, kinesis, dynamodb streams
- CDK = use your fav coding language instead of yaml for CloudFormation
- AppSync = scaffolded API Gateway with websockets and GraphQL
    - serverless
    - federated APIs feature (bundles multiple microservice APIs into one)


## aws provided sample Qs - mine then correct
D, B+E, A+E, B+C, A, D, B, D, D, D
D, A+B, A+E, A+D, A, D, B, B, C, D
    .5        1            1  1
### takeaways
appsync, api gateway, cloudwatch

## General learnings
queues vs streams
- both can have lots of messages, need sharding
    - we still partition on a key
- queues are single thread
- queues only send message to 1 consumer
- queues retire message after being sent
- streams have many threads/topics/log file
- streams send messages to all consumers of the topic
- streams persist messages long term as subscribers can get messages from any point in time
caching strategies
- write through - set in cache on write
    - pro: data is always fresh
    - con: some/most data is never read (in some apps/contexts)
    - con: added latency on write because 2 write actions (db + cache) for every req (but usually ok per users)
- lazy loading - write to cache on reads
    - pro: only read data is cached
    - con: added latency on misses (3 actions, miss > db read > cache write)
    - con: data can get stale (writes don't update cache)

### practice tests
## 1 (19 july)
- things to research:
    - review cloud practitioner notes
    ✅ tooling (CodeDeploy, Build)
    ✅ CodeDeploy, appspec listeners/lifecycle hooks
    ✅ cognito
        - IAM - user pools, identity pools
    ✅ Lambda - sqs event source, CloudWatch event source, dep pkg (zip files)
    - below all one udemy section
        - CloudWatch, detailed monitoring, CloudWatch Events, alarms
        - X-Ray
        - EventBridge
    - ecs - launch types (ec2, fargate), vocab task vs pod etc., HOST_PORT:CONTAINER_PORT mappings (0 for host will be automatically handled), task definitions
    - api gateway caching (maybe compile all caching), mapping templates (xml > json)
    - dynamodb - streams, parallel scans, throughput, session feature, operations
    - certificate manager = for issuing SSL/TLS certificates
        - vs kms, secrets mngr, priv cert auth
    - beanstalk - source bundle
    - s3 hive compatible
    - AWS CLI put-metric-data
    - sqs - config (long polling), system arch
    - rds proxy = LB sorta for RDS
    - step functions
- SAML = secure assertion markup language
    - xml auth
- DDL = data def language (subset of SQL, create table etc.)


### feecodecamp youtube (eh)

## elastic beanstalk
- "not for production use" per aws
- built on top of cloud formation
- uses EC2, ELB, ASG, CloudWatch under the hood:
- web env
    - single inst or load balanced service
    - asg, elb
        - asg still used for fail handling
- worker env
    - asg, sqs
- deployment methods
    - all at once
        - ship same code to all instances at the same time
        - takes all old instances out of service during
        - fast but dangerous (if new v is broken)
        - downtime (no availability)
    - rolling
        - only on load balanced (needs ELB)
        - in batches
        - slower but fixes probs of all at once
        - rolling back is complicated (needs another rolling deploy)
        - reduced capacity
    - rolling with addtl batch
        - only on load balanced (needs ELB)
        - completely new full batch then delete old
        - rollbacks still difficult
    - immutable
        - completely new asg
        - wait to destroy old asg
            - easy rollbacks
    - blue/green
        - all considered "in-place" except this one
        - similar to immutable but uses new DNS record
        - DNS mappings need to populate to entire internet :(
        - happens at route 53 level
    - configs in .ebextensions folder
        - files have .config
    - env.yml in root to configure defaults
    - EB has its own CLI
    - can use custom AMIs
    - RDS can be added inside or outside env
        - inside is destroyed on instance destroy (deploy)
    
        
