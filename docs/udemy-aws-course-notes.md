### section 3 - cloud computing
- deployment models
    - private cloud
        - company owns servers
    - public cloud
        - company rents servers
        - economies of scale
            - we only need to pay for what we need
            - they provide cheaper product because they can afford scale
        - on demand
        - self service
    - on prem
        - we handle everything
    - Infra as a Service
        - they handle:
            - networking
            - storage
            - computers
        - i.e. EC2
    - Platform as a Service
        - infra managed by them
        - we manage just app + data
        - i.e. Elastic Beanstalk
    - Software as a Service
        - working product provided by them
- geography
    - regions
        - a cluster of data centers
        - most services scoped to a region
        - services aren't available in all regions
        - i.e. "us-northwest"
    - availability zones
        - within a region
        - i.e. "us-northwest-1a"
        - separate from each other for availability purposes
    - global services
        - iam
- shared responsibility model
    - we're responsible for security of what we put in the cloud
    - they're responsible for networking, hardware, etc. security

### section 4 - IAM
- global service
- root user = do not use except to create admin user and other users
- IAM users (devs)
    - these still use the root user account_id or alias. so it feels like they're really sub-users
    - create these accounts and then send the signin link to them
    - they should set up MFA
    - they should set a new pw on first sign in
    - they configure their local terminal by creating an access key and secret
    - can also use the cloud shell
    - create multiple access keys for different integrations (i.e. sdk (app layer lib use))
- groups
    - a set of users
    - can be assigned policies at this level
- policies
    - what the assigned (group or user) is allowed to do
    - json
        - statement: [{}]
            - effect - deny || allow
            - action "service:ability"
- roles
    - like a user but for a service
    - for when a service needs to perform an action
    - that way we can allow or deny service integrations
- best practices
    - MFA
    - rotate keys every X (90) days

### section 5 - EC2
- he had me set up a "budget"
    - i had to leave the NpC org to do this. orgs must own billing if you're part of one
    - budgets are basically alerts for a billing threshold
- EC2 = elastic compute cloud
- it's infra as a service
- it's made up of:
    - instances = the hardware
    - EBS - data volumes
    - ELB - elastic load balancer
    - ASG - auto scaling group (kube?)
- lots of config options
    - cloud (EBS || EFS) storage or local (on the EC2 instance)
    - OS (mac|linux|win)
    - CPU
    - how much ram
    - network card (?)
    - firewall rules
    - startup/bootstrap script "user data"
        - only on first startup
- t2.micro - is the type of instance we'll use most
    - part of free tier
    - 1GB ram
    - 1 CPU
    - only EBS storage
    - med/low performance (this is enough)
- creating my first instance
    - mostly within browser, filling out form for config
    - he provided a startup script
    - instances have public and private IP addresses
        - private is for within network
    - AMI = amazon machine image
        - like docker image but for spinning up instance
        - select OS, etc.
    - !! user data only runs on very first start, not on restart

#### action items
- DONE - create admin group with "admin access" policy
- DONE - reread "roles" section to review as it's a new concept






