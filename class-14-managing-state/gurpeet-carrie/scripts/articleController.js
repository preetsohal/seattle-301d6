(function(module) {
  var articlesController = {};

  Article.createTable();  // Ensure the database table is properly initialized

  articlesController.index = function(ctx, next) {
    articleView.index(ctx.articles);
  };

  // DONE: What does this method do?  What is it's execution path?
  articlesController.loadById = function(ctx, next) { // this design to be a callback funtion for page()
    var articleData = function(article) {// functoion that defines the articles property of the ctx object and assigns the value pass through the parameter. then calls the next callback on the page().
      ctx.articles = article;
      next();
    };

    Article.findWhere('id', ctx.params.id, articleData);// this levrages webdb to find the article with matchng id nd runs the callback function articleData passing in the matching results as a argument.
  };

  // DONE: What does this method do?  What is it's execution path?
  articlesController.loadByAuthor = function(ctx, next) { //this is desingn to be a callback function for page()
    var authorData = function(articlesByAuthor) {//functoion that defines the articles property of the ctx object and assigns the value pass through the parameter. then calls the next callback on the page().
      ctx.articles = articlesByAuthor;
      next();
    };

    Article.findWhere('author', ctx.params.authorName.replace('+', ' '), authorData);//this levrages webdb to find the articles with matchng author and runs the callback function authorData passing in the matching results as a argument.
  };
  };

  // COMMENT: What does this method do?  What is it's execution path?
  articlesController.loadByCategory = function(ctx, next) {
    var categoryData = function(articlesInCategory) {
      ctx.articles = articlesInCategory;
      next();
    };

    Article.findWhere('category', ctx.params.categoryName, categoryData);
  };

  // COMMENT: What does this method do?  What is it's execution path?
  articlesController.loadAll = function(ctx, next) {
    var articleData = function(allArticles) {
      ctx.articles = Article.all;
      next();
    };

    if (Article.all.length) {
      ctx.articles = Article.all;
      next();
    } else {
      Article.fetchAll(articleData);
    }
  };


  module.articlesController = articlesController;
})(window);
