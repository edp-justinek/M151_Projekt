import mysql from 'mysql2/promise';

const connection = await mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    password: '',
    database: 'movie-db',
});

await connection.connect();

export async function getAll(userId) {
    const query = 'SELECT id, title, year, user, public FROM Movies WHERE user = ? OR public = 1';
    const [data] = await connection.query(query, [userId]);
    let rating = [];
    let ratingAVG = [];
    let movies = data.map(movie => movie.id)
    let i = 0;
    for (const movie of movies) {
        const queryRating = 'SELECT rating FROM rating WHERE movie = ? AND user = ?';
        console.log(userId);
        const [movieRating] = await connection.query(queryRating, [movie, userId]);
        const queryRatingAVG = 'SELECT AVG(rating) as rating FROM Rating WHERE movie = ?';
        const [movieRatingAVG] = await connection.query(queryRatingAVG, [movie]);
        rating.push(movieRating);
        ratingAVG.push(movieRatingAVG);
    }
    data.forEach(function(e) {
        e["rating"] = parseFloat(rating[i].map(rating => rating.rating));
        e["rating"] = parseFloat(ratingAVG[i].map(rating => rating.rating));
        i++
    });
    console.log(data)
    return data;
}

async function insert(movie) {
    const queryMovies = 'INSERT INTO Movies (title, year, user, public) VALUES (?, ?, ?, ?)';
    const [result] = await connection.query(queryMovies, [movie.title, movie.year, movie.user, movie.public]);
    const queryRating = 'INSERT INTO Rating (user,movie,rating) VALUES (?, ?, ?)';
    await connection.query(queryRating, [result.insertId, 0, movie.user]);
    return {...movie, id: result.insertId };
}

async function update(movie) {
    const query = 'UPDATE Movies SET title = ?, year = ?, user = ?, public = ? WHERE id = ?';
    await connection.query(query, [movie.title, movie.year, movie.user, movie.public, movie.id]);
    return movie;
}

export async function get(id, userId) {
    const query = 'SELECT * FROM Movies WHERE id = ? AND (user = ? OR public = 1)';
    const [data] = await connection.query(query, [id, userId]);
    return data.pop();
}

export async function remove(id) {
    const queryDelete = 'DELETE FROM Movies WHERE id = ?';
    await connection.query(queryDelete, [id]);
    const queryRating = 'DELETE FROM Rating WHERE movie = ?';
    await connection.query(queryRating, [id]);
    return;
}

export async function rating(user,movie,rating) {
    const queryDelete = 'DELETE FROM Rating WHERE movie = ? AND user = ?';
    await connection.query(queryDelete, [user,movie]);
    const queryRating = 'INSERT INTO Rating (user,movie,rating) VALUES (?, ?, ?)';
    await connection.query(queryRating, [user,movie,rating]);
    return;
}

export function save(movie) {
    if (!movie.id) {
        return insert(movie);
    } else {
        return update(movie);
    }
}