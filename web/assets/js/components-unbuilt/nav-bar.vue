<template>
  <nav class="navbar navbar-expand-md navbar-light bg-faded">
        <button class="navbar-toggler navbar-toggler-right" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
        </button>
        <h4 class="my-auto"><a class="navbar-brand" href="#">{{ title }}</a></h4>

        <div class="collapse navbar-collapse" id="navbarSupportedContent">
            <ul class="navbar-nav mr-auto">
                <li class="nav-item active">
                    <a class="nav-link" href="#">Dashboard</a>
                </li>
                <li class="nav-item">
                    <router-link v-if="user.isAdmin == true" class="nav-link" to="admin">Admin</router-link>
                </li>
            </ul>
            <ul class="navbar-nav ml-auto">
                <li class="nav-item dropdown">
                    <a class="nav-link dropdown-toggle" id="navbarAccountMenuLink" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                      Account
                    </a>
                    <div class="dropdown-menu dropdown-menu-right" aria-labelledby="navbarAccountMenuLink">
                        <p class="dropdown-header">Logged in as {{user.rcs_id}}</p>
                        <a class="dropdown-item" href="/admin">Settings</a>
                        <a class="dropdown-item" href="/logout">Logout</a>
                    </div>
                </li>
            </ul>
        </div>
    </nav>
</template>

<script >
    export default {
        data() {
            return {
                title: "Shuttle Signups",
                user: {}
            };
        },
        mounted: function() {
            this.getUser();
        },
        methods: {
            getUser: function() {
                this.$http.get('/api/current-user').then(response => {
                    this.user = response.body;
                }, response => {
                    console.log("ERROR: fetching current-user");
                });
            }
        }
    } 
</script>
