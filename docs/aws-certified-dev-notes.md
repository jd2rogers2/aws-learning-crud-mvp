### udemy course

## EC2 storage
# EBS
- network drive
- 30GB free per month
- only attaches to 1 EC2 instance at a time
- only available in 1 AZ
- easy to move it to other instance (on deploy)
- multi attach = to attach to multiple EC2 instance in diff AZs
# EFS
- a network file system
- accessible from multiple EC2 instances across AZs
# Instance store
- a hard-drive on the physical server
- your EC2 instance will be built on a specific type of server
- good for improved performance, cacheing
- ephemeral, would need a copy/backup system



### practice tests
## 1 (19 july)
- things to research:
    - review cloud practitioner notes
    - tooling (code deploy, build)
    - cognito
    - IAM - user pools, identity pools
    - cloudwatch, detailed monitoring, cloudwatch Events, alarms
    - AWS CLI put-metric-data
    - api gateway caching (maybe compile all caching), mapping templates (xml > json)
    - lambda - sqs event source, cloud watch event source, dep pkg (zip files)
    - event bridge
    - code deploy, appspec listeners/lifecycle hooks
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
- uses EC2, ELB, ASG, cloud watch under the hood:
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
    
        
