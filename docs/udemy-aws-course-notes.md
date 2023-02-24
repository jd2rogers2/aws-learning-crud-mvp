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

#### action items
- DONE - create admin group with "admin access" policy
- reread "roles" section to review as it's a new concept






