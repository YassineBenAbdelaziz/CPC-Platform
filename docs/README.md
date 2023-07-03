## Guide
### Workflow  
* main branch will be used only for deployment.  
* dev branch will be used for working/development. When working on a feature create a new branch from dev.  
* Pull changes from remote before you start working and before pushing.  
* main branch require pull request.  


### Every day commands      
``` bash
# Pull changes from remote repo
git pull origin  dev

# Check git Status
git status

# Add files to stage area
git add <file1> <file2> ...

# Commit 
git commit -m "commit message"

# Create a new branch and move to that branch
git checkout -b <branch-name>  

# Move to an existing branch
git checkout <branch-name>  

# Check the branch you are on and
# List all the existing branches
git branch

# Delete a branch 
git branch -D <name-of-the-branch-to-delete>

# Merge code from another branch into a current branch
git merge <branch-from-which-to-merge>

# List the created commits on the current branch
git log

``` 