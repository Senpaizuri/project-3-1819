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

### Basic access

When you sign up for basic access you can call to the `r_liteprofile` endpoint.
Here you can **only** get data from a user if he/she has signed in.
The data is very minimal, you can only access these fields

- `firstName`
- `lastName`
- `profilePicture`

### "Full" Access

If you are accepted by LinkedIn as a partner you get access to the `r_basicprofile` [Basic profile](https://docs.microsoft.com/en-us/linkedin/shared/references/v2/profile/basic-profile?context=linkedin/consumer/context) and `r_fullprofile` [Full profile](https://docs.microsoft.com/en-us/linkedin/shared/references/v2/profile/full-profile?context=linkedin/consumer/context).

If you use these within the candidate and moderater client you can provide more insight and get possibly better conversations.

# LinkedIn Developers

LinkedIn offers a broad scala of usable data served over HTTPS/OAuth2. However most data is not easily retrieved.
To get the most out of LinkedIn you need to be a signedup with the **LinkedIn Partner Program**.

With the [Profiles](https://docs.microsoft.com/en-us/linkedin/shared/references/v2/profile) endoints you can just straightup request [the applicants account data](https://docs.microsoft.com/en-us/linkedin/shared/integrations/people/profile-api?context=linkedin/consumer/context#retrieve-other-members-profile).

## Fresh Jobs "Client"

The FreshJobs client uses the data from the `kv-staging.lifely.nl` local build.
Hence, this app won't work without it.

I tried to also integrate the `kv-staging` data along with the `linkedin` data. However the linkedin api requires request over https, the local build only runs on http to my knowledge.

This is why the app is filled with meager dummy content and could possible be extended to greatness if both ran over https.

## Whishlist

[ ] - Add Proper LinkedIn request
[ ] - Add request for LinkedIn from the Moderator panel 