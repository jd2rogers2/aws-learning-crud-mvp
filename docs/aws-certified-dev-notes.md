### feecodecamp youtube

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
    
        
