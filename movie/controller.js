import { getAll, remove, get, save, rating } from './model.js';
import { render } from './view.js';
import { render as form } from './form.js';

export async function listAction(request, response) {
    const data = await getAll(request.user.id);
    const body = render(data);
    response.send(body);
}

export async function removeAction(request, response) {
    const id = parseInt(request.params.id, 10);
    await remove(id);
    response.redirect(request.baseUrl);
}

export async function formAction(request, response) {
    let movie = { id: '', title: '', year: '', user: '', public: '' };
    if (request.params.id) {
        movie = await get(parseInt(request.params.id, 10), request.user.id);
    }
    const body = form(movie);
    response.send(body);
}

export async function ratingAction(request, response) {
    const id = parseInt(request.params.id, 10);
    const query = JSON.stringify(request.query);
    const ratingNr = query.match(/(\d+)/);
    await rating(id, ratingNr[0], request.user.id);
    response.redirect(request.baseUrl);
}

export async function saveAction(request, response) {
    const movie = {
        id: request.body.id,
        title: request.body.title,
        year: request.body.year,
        user: request.user.id,
        public: request.body.public == "on" ? 1 : 0
    };
    await save(movie);
    response.redirect(request.baseUrl);
}