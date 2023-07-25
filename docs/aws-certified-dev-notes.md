### udemy course

## CICD
- summary:
    - CodeCommit = version control
    - CodePipeline = pipeline orchestration
    - CodeBuild = build and test
    - CodeDeploy = deploying to EC2
    - CodeStar = manage activities??
    - CodeArtifact = store, publish, share pkgs
    - CodeGuru = ML automated code reviews
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
    - can integrate with Cloud Formation
- CodeBuild
    - sources = CodeCommit, S3, bitbucket, github
    - buildspec.yml for instructions
        - copies in specified source code files
        - runs specific instructions in phases
            - install, pre_build, build, post_build
        - sounds similar to Dockerfile
        - runs in CodeBuild container
        - must be in root
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
        - needs S3 permissions to go and get to-be-deployed artifacts

- CodeStar
- CodeArtifact
- CodeGuru



### practice tests
## 1 (19 july)
- things to research:
    - review cloud practitioner notes
    - tooling (CodeDeploy, Build)
    - cognito
    - IAM - user pools, identity pools
    - CloudWatch, detailed monitoring, CloudWatch Events, alarms
    - AWS CLI put-metric-data
    - api gateway caching (maybe compile all caching), mapping templates (xml > json)
    - lambda - sqs event source, CloudWatch event source, dep pkg (zip files)
    - event bridge
    - CodeDeploy, appspec listeners/lifecycle hooks
    - dynamodb - streams, parallel scans, throughput, session feature, operations
    - ecs - launch types (ec2, fargate), vocab task vs pod etc., HOST_PORT:CONTAINER_PORT mappings (0 for host will be automatically handled), task definitions
    - s3 hive compatible
    - beanstalk - source bundle
    - x-ray
    - sqs - config (long polling), system arch, 
    - certificate manager = for issuing SSL/TLS certificates
        - vs kms, secrets mngr, priv cert auth
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
    
        
