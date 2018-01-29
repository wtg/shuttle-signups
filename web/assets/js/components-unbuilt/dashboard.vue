<template>
    <div class="col">
    <div class="column-sm-6">
        <div v-if="loaded == true && userShuttles.length != 0" class="card border-success">
            <h3 class="card-header border-success">Your Upcoming Shuttles</h3>
            <div class="card-block">
                <h4 class="card-title text-muted">These are shuttles that you've signed up for that are happening soon!</h4>
                <div class="card-deck">
                    <li style="list-style: none;" v-for="shuttle in userShuttles">
                        <div class="card">
                            <div class="card-block">
                                <div class="card-title">
                                    <h4>{{ shuttle.destination }}</h4>
                                    <h5 class="text-muted">from {{ shuttle.origin }}</h5>
                                </div>
                                <p><i class="far fa-clock" aria-hidden="true"></i>{{ shuttle.departureDateTime | moment("dddd, MMMM Do YYYY [at] h:mm a") }}</p>
                            </div>
                            <div class="card-footer text-muted">
                                <button type="button" class="btn btn-danger" data-toggle="modal" v-bind:data-target="'#unsignup' + shuttle.id">Cancel</button>
                                <!--UNSIGNUP MODAL-->
                                <div class="modal fade" v-bind:id="'unsignup' + shuttle.id" tabindex="-1" role="dialog">
                                    <div class="modal-dialog" role="document">
                                        <div class="modal-content">
                                            <div class="modal-header">
                                                <h5 class="modal-title">Canceling {{ shuttle.destination }}</h5>
                                                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                                </button>
                                            </div>
                                            <div class="modal-body">
                                                <p>
                                                    This will remove you <span v-if="shuttle.numGuests != 0">and your {{ shuttle.numGuests }} <span v-if="shuttle.numGuests == 1">guest</span><span v-else>guests</span></span> from this shuttle. 
                                                    Continuing with this action will <b>require</b> you to resignup.
                                                </p>
                                            </div>
                                            <div class="modal-footer">
                                                <button type="button" v-on:click="unsignupShuttle(shuttle.id, shuttle.numGuests, false); " class="btn btn-danger" data-dismiss="modal">Cancel</button>
                                                <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <button type="button" class="btn btn-warning" data-toggle="modal" v-bind:data-target="'#change' + shuttle.id">Change</button>
                                <!--CHANGE SIGNUP MODAL-->
                                <div class="modal fade" v-bind:id="'change' + shuttle.id" tabindex="-1" role="dialog">
                                    <div class="modal-dialog" role="document">
                                        <div class="modal-content">
                                            <div class="modal-header">
                                                <h5 class="modal-title">Changing {{ shuttle.destination }}</h5>
                                                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                                <span aria-hidden="true">&times;</span>
                                                </button>
                                            </div>
                                            <div class="modal-body">
                                                <h4>Departure Shuttle</h4>
                                                <h4>Return Shuttle</h4>
                                            </div>
                                            <div class="modal-footer">
                                                <button type="button" class="btn btn-warning" data-dismiss="modal">Confirm</button>
                                                <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </li>
                </div>
            </div>
        </div>
    </div>
    <div class="row-sm-6">
        <div v-if="loaded == true" class="card border-primary">
            <h3 class="card-header border-primary">Featured</h3>
            <div v-if="shuttles.length != 0" class="card-block">
                <h4 class="card-title text-muted">Here are some upcoming shuttles!</h4>
                <div class="card-deck">
                    <li style="list-style: none;" v-for="shuttleGroup in shuttleGroups.filter(x=> !userShuttleGroups.includes(x._id))">
                        <div class="card">
                            <img class="card-img-top" >
                            <div class="card-block">
                                <div class="card-title">
                                    <h4>{{ shuttleGroup.destination }}</h4>
                                    <h5 class="text-muted">from {{ shuttleGroup.origin }}</h5>
                                </div>
                                <p>{{ shuttleGroup.notes }}</p>
                                <p><i class="far fa-calendar-alt" aria-hidden="true"></i>{{ shuttleGroup.startDate | moment("dddd, MMMM Do YYYY") }}</p>
                            </div>
                            <div class="card-footer text-muted">
                                <a href="#" class="btn btn-success" data-toggle="modal" v-bind:data-target="'#signup' + shuttleGroup._id">Signup</a>
                                <!--SIGNUP MODAL-->
                                <div class="modal fade" v-bind:id="'signup' + shuttleGroup._id" tabindex="-1" role="dialog">
                                    <div class="modal-dialog modal-lg" role="document">
                                        <div class="modal-content">
                                            <div class="modal-header">
                                                <h5 class="modal-title">Signing up for {{ shuttleGroup.destination }}</h5>
                                                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                                </button>
                                            </div>
                                            <div class="modal-body">
                                                <h5>Departing</h5>
                                                <div v-if="shuttleGroup.shuttles.length != 0" class="container-fluid">
                                                    <div class="row flex-row flex-nowrap">
                                                        <div v-for="shuttle in shuttleGroup.shuttles" class="col-5">
                                                            <div class="card" v-bind:class="{'border-success': queuedSignupShuttles.indexOf(shuttle) != -1}" v-if="shuttles.filter(obj=>obj._id===shuttle)[0].origin == shuttleGroup.origin">
                                                                <div class="card-block">
                                                                    <div class="card-title">
                                                                        <h5>{{ shuttles.filter(obj=>obj._id===shuttle)[0].origin }}</h5>
                                                                        <h6 class="text-muted">to {{ shuttles.filter(obj=>obj._id===shuttle)[0].destination }} </h6>
                                                                    </div>
                                                                    <p><i class="far fa-clock" aria-hidden="true"></i>{{ shuttles.filter(obj=>obj._id===shuttle)[0].departureDateTime | moment("MMMM Do YYYY [at] h:mm a") }} </p>
                                                                    <p>{{ shuttles.filter(obj=>obj._id===shuttle)[0].vacancies }} seats available</p>
                                                                    <p v-if="shuttles.filter(obj=>obj._id===shuttle)[0].guestsAllowed != 0">{{ shuttles.filter(obj=>obj._id===shuttle)[0].guestsAllowed }} guests permitted</p>
                                                                </div>
                                                                <div class="card-footer text-muted">
                                                                    <button :disabled="shuttles.filter(obj=>obj._id===shuttle)[0].vacancies <= 0" class="btn btn-success" v-on:click="queueSignupShuttle('departing', shuttles.filter(obj=>obj._id===shuttle)[0]._id)">Select</button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div v-else-if="shuttleGroup.shuttles.length == 0">
                                                    <p>There are no available shuttles departing at this time.</p>
                                                </div>
                                                <h5>Returning</h5>
                                                <div v-if="shuttleGroup.shuttles.length != 0" class="container-fluid">
                                                    <div class="row flex-row flex-nowrap">
                                                        <div v-for="shuttle in shuttleGroup.shuttles" class="col-5">
                                                            <div class="card" v-if="shuttles.filter(obj=>obj._id===shuttle)[0].origin == shuttleGroup.destination">
                                                                <div class="card-block">
                                                                    <div class="card-title">
                                                                        <h5>{{ shuttles.filter(obj=>obj._id===shuttle)[0].origin }}</h5>
                                                                        <h6 class="text-muted">to {{ shuttles.filter(obj=>obj._id===shuttle)[0].destination }} </h6>
                                                                    </div>
                                                                    <p><i class="far fa-clock" aria-hidden="true"></i>{{ shuttles.filter(obj=>obj._id===shuttle)[0].departureDateTime | moment("MMMM Do YYYY [at] h:mm a") }} </p>
                                                                    <p>{{ shuttles.filter(obj=>obj._id===shuttle)[0].vacancies }} seats available</p>
                                                                    <p v-if="shuttles.filter(obj=>obj._id===shuttle)[0].guestsAllowed != 0">{{ shuttles.filter(obj=>obj._id===shuttle)[0].guestsAllowed }} guests permitted</p>
                                                                </div>
                                                                <div class="card-footer text-muted">
                                                                    <a href="#" class="btn btn-success">Select</a>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div v-else-if="shuttleGroup.shuttles.length == 0">
                                                    <p>There are no available shuttles returning at this time.</p>
                                                </div>
                                            </div>
                                            <div class="modal-footer">
                                                <button type="button" v-on:click="signupShuttle(queuedSignupShuttles, 0, false)" class="btn btn-success" data-dismiss="modal">Signup</button>
                                                <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                </div>
            </div>
            <div v-else-if="shuttles.length == 0">
            <div class="card-block text-center">
            <h1 class="text-muted">There are no upcoming shuttles right now! Check back later!</h1>
            </div>
            </div>
            </li>
        </div>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                loaded: false,
                title: "Shuttle Signups",
                numGuests: 0,
                queuedSignupShuttles: [],
                shuttleGroups: [],
                shuttles: [],
                userShuttles: [],
                userShuttleGroups: []
            };
        },
        mounted: function() {
            this.getAPIData();
        },
        methods: {
            getAPIData: function() {
                // Make API calls async
                var apiCalls = [];
                // GET USER SHUTTLES
                apiCalls.push(this.$http.get('/api/get-user-shuttles'));
                // GET SHUTTLE GROUPS
                apiCalls.push(this.$http.get('/api/get-shuttle-groups'));
                // GET SHUTTLES
                apiCalls.push(this.$http.get('/api/get-shuttles'));

                // We need them to all resolve at the same time before doing anything else...
                Promise.all(apiCalls).then(values => {
                    // After resolution, then begin setting data
                    this.setShuttleGroups(values[1]).then(this.setShuttles(values[2])).then(this.setUserShuttles(values[0])).then(this.loaded = true);

                }).catch(error => {
                    console.log("An API call failed (which isn't good)...");
                });
            },
            
            queueSignupShuttle: function(type, id) {
                var vue = this;
                
                // Let's determine if the shuttle is departing or returning
                if (type == "departing") {
                    Vue.set(vue.queuedSignupShuttles, 0, id) ;
                }
                
                else if (type == "returning") {
                    Vue.set(vue.queuedSignupShuttles, 1, id);
                }
                
                return;
            },

            setUserShuttles: function(response) {
                var vue = this;
                var promise = new Promise(function(resolve, reject) {
                    var resShuttles = response.body;
                    // Let's cross reference the IDs provided by the API with the entire list of shuttles given

                    for (var userShuttle in resShuttles) {
                        for (var shuttle in vue.shuttles) {
                            if (resShuttles[userShuttle].id == vue.shuttles[shuttle]._id) {
                                var temp = $.extend({}, resShuttles[userShuttle], vue.shuttles[shuttle]);
                                vue.userShuttles.push(temp);

                                // Add the group the current shuttle is apart of to the list of userShuttleGroups

                                // First check to see if the group doesn't  exist already
                                if (vue.userShuttleGroups.map(function(el) {return el._id;}).indexOf(temp.group) == -1) {
                                    // Iterate to find it
                                          
                                        for (var shuttleGroup in vue.shuttleGroups) {
                                            if (vue.shuttleGroups[shuttleGroup]._id == temp.group) {
                                                vue.userShuttleGroups.push(vue.shuttleGroups[shuttleGroup]._id);
                                                break;
                                            }
                                        }
                                }
                            }
                        }
                    }
                    resolve();
                })
                return promise;
            },
            setShuttles: function(response) {
                var vue = this;
                var promise = new Promise(function(resolve, reject) {
                    var resShuttles = response.body;
                    // Cross reference a shuttle's group for origin and destination information based on it's type (outgoing or incoming)

                    for (var shuttle in resShuttles) {
                        shuttleGroupIter: for (var shuttleGroup in vue.shuttleGroups) {
                            for (var shuttleGroupShuttle in vue.shuttleGroups[shuttleGroup].shuttles) {
                                if (resShuttles[shuttle]._id == vue.shuttleGroups[shuttleGroup].shuttles[shuttleGroupShuttle]) {
                                    resShuttles[shuttle].destination = vue.shuttleGroups[shuttleGroup].destination;
                                    resShuttles[shuttle].origin = vue.shuttleGroups[shuttleGroup].origin;
                                    vue.shuttles.push(resShuttles[shuttle]);
                                    break shuttleGroupIter;
                                }
                            }
                        }
                    }
                    resolve();
                })
                return promise;
            },
            setShuttleGroups: function(response) {
                var vue = this;
                var promise = new Promise(function(resolve, reject) {
                    vue.shuttleGroups = vue.shuttleGroups.concat(response.body);
                    resolve();
                })
                return promise;
            },

            unsignupShuttle: function(shuttleID, numGuests, guestsOnly) {
                var vue = this;
                var promise = new Promise(function(resolve, reject) {
                    var request = {
                        "id": shuttleID,
                        "numGuests": numGuests,
                        "guestsOnly": guestsOnly
                    };

                    vue.$http.post('/api/unsignup-shuttle', request).then(response => {
                        vue.shuttleGroups = [];
                        vue.shuttles = [];
                        vue.userShuttles = [];
                        vue.userShuttleGroups = [];
                        vue.getAPIData();
                        resolve();
                    });

                });
                return promise;
            },
            
            signupShuttle: function(shuttles, numGuests, guestsOnly) {
                var vue = this;
                for (var shuttle in shuttles) {
                    var promise = new Promise(function(resolve, reject) {
                    var request = {
                        "id": shuttles[shuttle],
                        "numGuests": numGuests,
                        "guestsOnly": guestsOnly
                    };

                    vue.$http.post('/api/signup-shuttle', request).then(response => {
                        resolve();
                    });

                });
                    return promise;
                }
                
                vue.shuttleGroups = [];
                vue.shuttles = [];
                vue.userShuttles = [];
                vue.userShuttleGroups = [];
                vue.queueSignupShuttles = [];
                vue.getAPIData();
                
            }
        }
    }
</script>
