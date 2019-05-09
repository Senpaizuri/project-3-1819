# FreshJobs

Serving fresh jobs out of the oven 🥖, not really though.

This app tries to enhance the experience of the [KanidaatVinden](https://kv-staging.lifely.nl).
The app focusses on the interaction between the Applicant and the Intermediary.

## Linkedin Integration
My focus for this app would be to integrate the LinkedIn platform in some shape or form.
Instead of the intermediary googling the applicant, the app should just automate this within the app itself.
The intermedairy should send a request to ask for his/her LinkedIn profile and display it's data for an easier conversation between the two.
However, this should work both ways.
While the intermediary get to see the applicants profile, the applicant gets to see the LinkedIn company page of the job description the intermediary is recommending.

I think this wil greatly boost conversion to actual people hired.
Since they both know what the other one wants it's probably easier to ask questions relating to the applicant or business said applicant is applying to.

# LinkedIn Developers

LinkedIn offers a broad scala of usable data served over HTTPS/OAuth2. However most data is not easily retrieved.
To get the most out of LinkedIn you need to be a signedup with the **LinkedIn Partner Program**.

With the [Profiles](https://docs.microsoft.com/en-us/linkedin/shared/references/v2/profile) endoints you can just straightup request [the applicants account data](https://docs.microsoft.com/en-us/linkedin/shared/integrations/people/profile-api?context=linkedin/consumer/context#retrieve-other-members-profile).