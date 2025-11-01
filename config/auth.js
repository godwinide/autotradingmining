module.exports = {
    ensureAuthenticated: function(req, res, next) {
      if (req.isAuthenticated()) {
        return next();
      }
      req.flash('error_msg', 'Login required');
      res.redirect(303, '/signin');
    },
    ensureAdmin: function(req, res, next) {
      console.log('=== ensureAdmin Check ===');
      console.log('isAuthenticated:', req.isAuthenticated());
      console.log('req.user:', req.user);
      console.log('req.user?.isAdmin:', req.user?.isAdmin);
      console.log('req.session:', req.session);
      console.log('========================');
      
      if (req.isAuthenticated() && req.user?.isAdmin) {
        return next();
      }
      req.flash('error_msg', 'Login required');
      res.redirect(303, '/admin/signin');
    },
    forwardAuthenticated: function(req, res, next) {
      if (req.isAuthenticated()) {
        return next();
      }
      res.redirect('/');      
    }
  };