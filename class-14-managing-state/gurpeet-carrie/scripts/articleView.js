(function(module) {

  var articleView = {};

  var render = function(article) {
    var template = Handlebars.compile($('#article-template').text());

    article.daysAgo = parseInt((new Date() - new Date(article.publishedOn))/60/60/24/1000);
    article.publishStatus = article.publishedOn ? 'published ' + article.daysAgo + ' days ago' : '(draft)';
    article.body = marked(article.body);

    return template(article);
  };

  // DONE: What does this method do?  What is it's execution path?
  articleView.populateFilters = function() {
    var options, // in this option is declared variable has no value.
      template = Handlebars.compile($('#option-template').text());//handlebar.compile produces a function that stores on templatevariable.

    // Example of using model method with FP, synchronous approach:
    // NB: This method is dependant on info being in the DOM. Only authors of shown articles are loaded.
    options = Article.allAuthors().map(function(author) { return template({val: author}); }); //here we are changing the value of options. article.allAuthors produces an array of unique authors. then we map the array. it maps and returns the value of authors. for each author in the array it runs the hanlebar compile function and store on tempate and returns an array of html options.
    if ($('#author-filter option').length < 2) { // Prevent duplication
      $('#author-filter').append(options); // only append options if author filter only has one option.
    };

    // Example of using model method with async, SQL-based approach:
    // This approach is DOM-independent, since it reads from the DB directly.
    Article.allCategories(function(rows) { //this function returns and appends unique categories from the database coloun category.
      if ($('#category-filter option').length < 2) { //only append options if category filter only has one option.
        $('#category-filter').append( // it appends the articles as html options.
          rows.map(function(row) {
            return template({val: row.category});
          })
        );
      };
    });
  };

  // DONE: What does this method do?  What is it's execution path?
  articleView.handleFilters = function() {
    $('#filters').one('change', 'select', function() { // do the first change of filter select run this function and then unbined after its first invocation.
      resource = this.id.replace('-filter', ''); // this tells whether author or category filters been interacted with.
      page('/' + resource + '/' + $(this).val().replace(/\W+/g, '+')); // Replace any/all whitespace with a +
    }); //it buids the url  replacing spaces with plus (example:- /author/kenna+morar).
  };
  // articleView.handleAuthorFilter = function() {
  //   $('#author-filter').on('change', function() {
  //     if ($(this).val()) {
  //       $('article').hide();
  //       $('article[data-author="' + $(this).val() + '"]').fadeIn();
  //     } else {
  //       $('article').fadeIn();
  //       $('article.template').hide();
  //     }
  //     $('#category-filter').val('');
  //   });
  // };
  //
  // articleView.handleCategoryFilter = function() {
  //   $('#category-filter').on('change', function() {
  //     if ($(this).val()) {
  //       $('article').hide();
  //       $('article[data-category="' + $(this).val() + '"]').fadeIn();
  //     } else {
  //       $('article').fadeIn();
  //       $('article.template').hide();
  //     }
  //     $('#author-filter').val('');
  //   });
  // };

  // DONE: Remove the setTeasers method, and replace with a plain ole link in the article template.
  // articleView.setTeasers = function() {
  //   $('.article-body *:nth-of-type(n+2)').hide();
  //
  //   $('#articles').on('click', 'a.read-on', function(e) {
  //     e.preventDefault();
  //     $(this).parent().find('*').fadeIn();
  //     $(this).hide();
  //   });
  // };

  articleView.initNewArticlePage = function() {
    $('#articles').show().siblings().hide();

    $('#export-field').hide();
    $('#article-json').on('focus', function(){
      this.select();
    });

    $('#new-form').on('change', 'input, textarea', articleView.create);
  };

  articleView.create = function() {
    var article;
    $('#articles').empty();

    // Instantiate an article based on what's in the form fields:
    article = new Article({
      title: $('#article-title').val(),
      author: $('#article-author').val(),
      authorUrl: $('#article-author-url').val(),
      category: $('#article-category').val(),
      body: $('#article-body').val(),
      publishedOn: $('#article-published:checked').length ? util.today() : null
    });

    $('#articles').append(render(article));

    $('pre code').each(function(i, block) {
      hljs.highlightBlock(block);
    });

    // Export the new article as JSON, so it's ready to copy/paste into blogArticles.js:
    $('#export-field').show();
    $('#article-json').val(JSON.stringify(article) + ',');
  };

  // DONE: What does this method do?  What is it's execution path?
  articleView.index = function(articles) {//this function is designed to accept an array as the articles parameter
    $('#articles').show().siblings().hide(); // this targets element with ID of articles and shows it at the same time it hides all sibling elements.

    $('#articles article').remove(); //this removes all child article elements from element with the id articles.
    articles.forEach(function(a) {
      $('#articles').append(render(a));// for each element within the array that was passed when the ArticleView.index function was called. Append ther result of running the render function with the item as an argument. This compiles hanldebars template and returns a rendered HTML element with data gathered from the item.
    });

    articleView.populateFilters(); // this invokes the populateFilters function which you can see the comments on that function for more detail. It will fill in the author and category filters with options.
    // DONE: What does this method do?  What is it's execution path?
    articleView.handleFilters(); // this invokes the handleFilters function which you can see the comments on that function for more detail. It handles interaction with the filters. Changing the visible content on the page as different options are selected from the author and category filters.

    // DONE: Replace setTeasers with just the truncation logic, if needed:
    if ($('#articles article').length > 1) {
      $('.article-body *:nth-of-type(n+2)').hide();
    }
  };

  articleView.initAdminPage = function() {
    var template = Handlebars.compile($('#author-template').text());

    Article.numWordsByAuthor().forEach(function(stat) {
      $('.author-stats').append(template(stat));
    });

    $('#blog-stats .articles').text(Article.all.length);
    $('#blog-stats .words').text(Article.numWordsAll());
  };

  module.articleView = articleView;
})(window);
