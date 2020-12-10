import {elements} from './base';

export const toggleLikesBtn = isLiked => {
    const iconString = isLiked ? 'icon-heart' : 'icon-heart-outlined';
    document.querySelector('.recipe__love use').setAttribute('href', `img/icons.svg#ico${iconString}`);

};

export const toggleLikesMenu = numLikes => {
    elements.likesMenu.getElementsByClassName.visibility = numLikes > 0 ? "visible" : 'hidden';
};

export const renderLike = like => {
    const markup = `
    <li>
    <a class="likes__link" href="#${like.id}">
        <figure class="likes__fig">
            <img src="${like.img}" alt="Test">
        </figure>
        <div class="likes__data">
            <h4 class="likes__name">${like.title} ...</h4>
            <p class="likes__author">The Pioneer Woman${like.author}</p>
        </div>
    </a>
</li>
    
    `;
    elements.likesList.insertAdjacentHTML('beforeend', markup);
};

export const deleteLike = id => {
    const el = document.querySelector(`.likes__link[href*=${id}]`.parentElement)
    if (el) el.parentElement.removeChild(el);
}