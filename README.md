# Shuttle Signups [![Build Status](https://travis-ci.org/wtg/shuttle-signups.svg?branch=master)](https://travis-ci.org/wtg/shuttle-signups) [![Stories in Ready](https://badge.waffle.io/wtg/shuttle-signups.svg?label=ready&title=Ready)](http://waffle.io/wtg/shuttle-signups) [<img align="right" width="150px" src="http://webtech.union.rpi.edu/assets/css/images/wtg.png">](http://webtech.union.rpi.edu/)
A web interface to simplify the process of signing up for special shuttles at RPI.

## What exactly is a special shuttle?
The Rensselaer Union, along with support from Auxiliary Services and Parking & Transportation, runs a pilot program for a Capital District shuttle service. Certain weekends of the year, shuttles leave from the Rensselaer Union to destinations around the Capital District such as Crossgates Mall and Albany International Airport.

## Why is this project needed?
Before this project came to exist, a Google Form was used to facilitate sign-ups for these special shuttles. These forms weren't the best solution. This project aims to simplify that process, helping both students, and those at Auxiliary Services and Parking & Transportation.

## Development and Deployment

**It isn't currently reccommended that you deploy this project for production. It's still under heavy development, and things will most likely change (break).**


*This project is developed on the MEAN stack (MongoDB, Express.js, Angular.js, and Node.js).*

Before you begin, you should make sure that you have both MongoDB and Node.js installed on your system. If you don't, you can find information about installing each [here](https://docs.mongodb.com/v3.2/installation/) and [here](https://nodejs.org/en/download/package-manager/), respectively.
Eventually, we want to look into installing MongoDB using [npm](https://www.npmjs.com/) automatically when you run ```npm install``` below.

Next, you're going to want to clone this repository (if you haven't done so already), and ```cd``` into it. Run ```npm install```, sit back and relax. This project has many dependencies that need to download.

After that's finished, we need to configure the application with some basic parameters.
Look for the the file ```dev-config.js``` and copy it to ```config.js```. Modify the configuration parameters to match your desired configuration.

```
module.exports = {
    service_url: URL to call back to after CAS authentication,
    cas_dev_mode: false,
    cas_dev_mode_user: '',
    admins: [Array of the user IDs of the desired administrators],
    cms_key: Your API key for the RPI Club Management System
};
```

Great! Now, we're ready to run the application. Make sure MongoDB is already running, and simply run ```npm start```. By default, the application runs on port 8080, but this can easily be changed using an environment variable.

In the future, we'll provide an init script that will allow running Shuttle Signups as a service on Linux distributions (which grants you tons of amenities, such as automatically running on start-up). For now, you can look into using [```forever```](https://www.npmjs.com/package/forever).

## Roadmap
  - [ ] Implement a functional user-facing and admin-facing frontend.
  - [ ] Put shuttles into groups, based on origin/destination, and day of departure 
    * This will allow us to prevent users from signing up for multiple shuttles going to the same destination on the same day.
  - [ ] Allow exportable and printable data about shuttles
  - [ ] Allow storing of student phone numbers
    * This one is rather tricky because it requires us to actually store users in the database in some form, instead of relying completely on CMS
  - [ ] Store shuttle history
    * Currently, shuttles don't ever leave the database, so they can be queryable after they've been completed. However, this can cause the database to fill up rather quickly, so in the future, we'll probably make an archive for shuttles, sepearate from the main, active database.
  - [ ] Email reminders to users
    * [Nodemailer](https://nodemailer.com/) is totally going to be our friend here. We should allow the time frame for the reminder to be configured per-shuttle, for groups of shuttles, or globally across the application. This will also be useful in notifying students of cancelled, or delayed shuttles.
  - [X] Luggage restrictions
    * This information, and much more, can be specified in the notes section for a shuttle, which was added in ```e09fe30```.
  - [ ] Allow administrator override to add people past bus capacity
    * We'll need to modify signup_shuttle and unsignup_shuttle to allow administators to specify a user, and add and remove them from shuttles.
  - [ ] Close waitlist when departure is soon
    * Allow the closing time to be configurable. I don't know if we'd like to extend this functionality to the ```users``` list for a shuttle as well.
