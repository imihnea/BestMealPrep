$('#meal-search').on('input', function() {
    var search = $(this).serialize();
    if(search === "search=") {
      search = "all"
    }
    $.get('/meals?' + search, function(data) {
      $('#meal-grid').html('');
      data.forEach(function(meal) {
        $('#meal-grid').append(`
          <div class="col-md-3 col-sm-6">
            <div class="thumbnail">
              <img src="${ meal.image }">
              <div class="caption">
                <h4>${ meal.name }</h4>
              </div>
              <p>
                <a href="/meals/${ meal._id }" class="btn btn-primary">More Info</a>
              </p>
            </div>
          </div>
        `);
      });
    });
  });
  
  $('#meal-search').submit(function(event) {
    event.preventDefault();
  });