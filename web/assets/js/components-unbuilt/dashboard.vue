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
                                <p><i class="fa fa-clock-o" aria-hidden="true"></i>{{ shuttle.departureDateTime | moment("dddd, MMMM Do YYYY [at] h:mm a") }}</p>
                            </div>
                            <div class="card-footer text-muted">
                                <button type="button" class="btn btn-danger" data-toggle="modal" data-target="#unsignup-modal">Cancel</button>
                                <!--UNSIGNUP MODAL-->
                                <div class="modal fade" id="unsignup-modal" tabindex="-1" role="dialog">
                                    <div class="modal-dialog" role="document">
                                        <div class="modal-content">
                                            <div class="modal-header">
                                                <h5 class="modal-title">Cancel signup for shuttle to {{ shuttle.destination }}</h5>
                                                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                                <span aria-hidden="true">&times;</span>
                                                </button>
                                            </div>
                                            <div class="modal-body">
                                                <p v-if="shuttle.numGuests == 0">This will remove you from this shuttle. Continuing with this action will <b>require</b> you to resignup.</p>
                                                <p v-else>This will remove you and your {{ shuttle.numGuests }} guests from this shuttle. Continuing with this action will <b>require</b> you to resignup.</p>
                                            </div>
                                            <div class="modal-footer">
                                                <button type="button" v-on:click="unsignupShuttle(shuttle.id, shuttle.numGuests, false)" class="btn btn-danger" data-dismiss="modal">Confirm</button>
                                                <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <button type="button" class="btn btn-warning" data-toggle="modal" data-target="#change-modal">Change</button>
                                <!--CHANGE SIGNUP MODAL-->
                                <div class="modal fade" id="change-modal" tabindex="-1" role="dialog">
                                    <div class="modal-dialog" role="document">
                                        <div class="modal-content">
                                            <div class="modal-header">
                                                <h5 class="modal-title">Change signup for shuttle to {{ shuttle.destination }}</h5>
                                                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                                <span aria-hidden="true">&times;</span>
                                                </button>
                                            </div>
                                            <div class="modal-body">
                                                <p v-if="shuttle.numGuests == 0">This will remove you from this shuttle. Continuing with this action will <b>require</b> you to resignup.</p>
                                                <p v-else>This will remove you and your {{ shuttle.numGuests }} guests from this shuttle. Continuing with this action will <b>require</b> you to resignup.</p>
                                            </div>
                                            <div class="modal-footer">
                                                <button type="button" class="btn btn-danger" data-dismiss="modal">Confirm</button>
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
                    <li style="list-style: none;" v-for="shuttleGroup in shuttleGroups">
                        <div class="card">
                            <img class="card-img-top" >
                            <div class="card-block">
                                <div class="card-title">
                                    <h4>{{ shuttleGroup.destination }}</h4>
                                    <h5 class="text-muted">from {{ shuttleGroup.origin }}</h5>
                                </div>
                                <p>{{ shuttleGroup.notes }}</p>
                                <p><i class="fa fa-clock-o" aria-hidden="true"></i>{{ shuttleGroup.startDate | moment("dddd, MMMM Do YYYY") }}</p>
                            </div>
                            <div class="card-footer text-muted">
                                <a href="#" class="btn btn-success">Signup</a>
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
                        vue.getAPIData();
                        vue.$forceUpdate();
                        resolve();
                    });

                });
                return promise;
            }
        }
    }
</script>
