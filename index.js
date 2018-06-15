/*jshint esversion: 6 */
(() => {
  'use strict';
})();
/* author: huudungmg */

$(document).ready(() => {
  listenToInputEvent();
});

/**
 * Mỗi lần gõ empty kết quả và hiển thị loader
 * searchWiki() chỉ chạy khi không gõ phím nào trong vòng 100ms
 */
const listenToInputEvent = () => {
  let timeoutID = null;
  const formElement = $('.article-search-form');
  formElement.keyup('#article-search-form__input', async event => {
    event.preventDefault();

    // empty result + append loader
    $('.article-list').empty();
    $('.article-list').append(`<div class="loader"></div>`);

    // clear then set timeout everytime keyup
    clearTimeout(timeoutID);
    timeoutID = setTimeout(searchWiki, 100);
  });
};


/**
 * Lấy data API ra
 */
const searchWiki = () => {
  const query = $('#article-search-form__input').val();
  $.ajax({
      url: 'https://en.wikipedia.org/w/api.php',
      method: 'post',
      data: { // data is a object
        action: "query",
        list: "search",
        format: "json",
        srprop: "snippet",
        origin: "*",
        srsearch: encodeURI(query) // convert white character to "%20"
      }
    })
    .done((data) => {
      if (query != $('#article-search-form__input').val()) return; // Nếu query mà khác với current query thì bỏ qua processData
      processData(data);
    })
    .fail(err => console.error(err))
    .always(() => console.log(`Anyway, I'm still running`));
};

const processData = (data) => {
  // delete loader
  $('.loader').remove();
  // get list of results and push it into html elements by $.append()
  if (data.query.search.length) {
    const result = data.query.search
      .map(article =>
        `
        <a href="https://en.wikipedia.org/?curid=${article.pageid}" target="_blank" class="article-view">
          <h3 className="article-view__title">${article.title}</h3>
          <p className="article-view__snippet">${article.snippet}</p>
        </a>
        `)
      .join('');
    $('.article-list').append(result);
  } else {
    $('.article-list').append(
      `
    <h1>There is no result.
    `
    );
  }
};