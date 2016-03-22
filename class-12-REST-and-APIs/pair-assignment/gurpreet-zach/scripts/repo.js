(function(module) {
  var repos = {};

  repos.all = [];


  repos.requestRepos = function(callback) {
    // TODO: How would you like to fetch your repos? Don't forget to call the callback.
    console.log('requested repos');
    $.ajax({
      url: 'https://api.github.com/users/simonszc/repos' + '?per_page=5&sort=updated',
      type: 'GET',
      headers:{ 'authorization': 'token ' + githubToken },
      success: function(data, massage , xhr){
        repos.all = data;
        callback(data);
      }
    })
  };

  // DONE: Model method that filters the full collection for repos with a particular attribute.
  // You could use this to filter all repos that have a non-zero `forks_count`, `stargazers_count`, or `watchers_count`.
  repos.with = function(attr) {
    console.log('began repos.with');
    return repos.all.filter(function(repo) {
      return repo[attr];
    });
  };

  module.repos = repos;
})(window);
