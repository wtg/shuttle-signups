module.exports = {
   service_url: 'http://localhost:' + (process.env.PORT || 8080),
   mongo_url:'mongodb://localhost/shuttle-signups',
   cas_dev_mode: false,
   cas_dev_mode_user: '',
   admins: [''],
   cms_key: ''
};
