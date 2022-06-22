export function render(movie) {
    let checked = movie.public == 1 ? "checked" : "";
    return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <title>Movie list</title>
    <link rel="stylesheet" href=" /style.css" />
  </head>
  <body class="col-12">
    <form action="/movie/save" method="post">
      <input type="hidden" id="id" name="id" value="${movie.id}" />
      <div>
        <label for="title">Titel:</label>
        <input type="text" id="title" name="title" value="${movie.title}" required/>
      </div>
      <div>
        <label for="id">Jahr:</label>
        <input type="text" id="year" name="year" value="${movie.year}" required/>
      </div>
      <div>
        <label for="id">Public:</label>
        <input type="checkbox" id="public" name="public" ${checked}/>
      </div>
      <div>
        <button class="btn btn-primary" type="submit">speichern</button>
      </div>
    </form>
  </body>
  </html>  
  `;
}