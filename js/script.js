'use strict';

const templates = {
    articleLink: Handlebars.compile(document.querySelector('#template-article-link').innerHTML),
    tagLink: Handlebars.compile(document.querySelector('#template-tag-link').innerHTML),
    authorLink: Handlebars.compile(document.querySelector('#template-author-link').innerHTML),
    tagCloudLink: Handlebars.compile(document.querySelector('#template-tag-cloud-link').innerHTML),
    authorList: Handlebars.compile(document.querySelector('#template-author-list').innerHTML),
  }

const optArticleTagsSelector = '.post-tags .list',
  optArticleAuthorSelector = '.post-author',
  optTagsListSelector = '.tags.list',
  optCloudClassCount = '5',
  optCloudClassPrefix = 'tag-size-',
  optAuthorListSelector = '.authors.list';

const opts = {
  articleSelector: '.post',
  titleSelector: '.post-title',
  titleListSelector: '.titles',
};



function titleClickHandler(event){
  event.preventDefault();
  const clickedElement = this;
  console.log('Link was clicked!');
  // console.dirxml(event);

  /* [DONE] remove class 'active' from all article links  */

  const activeLinks = document.querySelectorAll('.titles a.active');

  for(let activeLink of activeLinks){
    activeLink.classList.remove('active');
  }
  /* [DONE] add class 'active' to the clicked link */

  console.log('clickedElement:', clickedElement);
  // console.log('clickedElement (with plus): ' + clickedElement);
  clickedElement.classList.add('active');

  /* [DONE] remove class 'active' from all articles */

  const activeArticles = document.querySelectorAll('.posts article.active');

  for(let activeArticle of activeArticles){
    activeArticle.classList.remove('active');
  }

  /* [DONE] get 'href' attribute from the clicked link */
  const articleSelector = clickedElement.getAttribute('href');

  /* [DONE] find the correct article using the selector (value of 'href' attribute) */
  const targetArticle = document.querySelector(articleSelector);

  /* [DONE] add class 'active' to the correct article */
  targetArticle.classList.add('active');
}


function generateTitleLinks(customSelector = ''){

  /* [DONE] remove contents of titleList */
  const titleList = document.querySelector(opts.titleListSelector);
  titleList.innerHTML = '';
  
  /* [DONE] for each article */
  const articles = document.querySelectorAll(opts.articleSelector + customSelector);
  
  let html = '';

  for(let article of articles){
  
    /* [DONE] get the article id */
    const articleId = article.getAttribute('id');
        
    /* [DONE] find the title element */
    /* [DONE] get the title from the title element */
    const articleTitle = article.querySelector(opts.titleSelector).innerHTML;

    /* [DONE] create HTML of the link */
    // const linkHTML = '<li><a href="#' + articleId + '"><span>' + articleTitle + '</span></a></li>';
      
    const linkHTMLData = {id: articleId, title: articleTitle};
    const linkHTML = templates.articleLink(linkHTMLData);

    /* insert link into titleList */
    html = html + linkHTML;    

  }

  titleList.innerHTML = html;

  const links = document.querySelectorAll('.titles a');

  for(let link of links){
    link.addEventListener('click', titleClickHandler);
  }

}

generateTitleLinks();

function calculateTagsParams(tags){
  const params = {min: '999999', max: '0'};
  for(let tag in tags){
    console.log(tag + ' is used ' + tags[tag] + ' times');
    // if(tags[tag] > params.max){
    //   params.max = tags[tag];
    // }
    // if(tags[tag] < params.min){
    //   params.min = tags[tag];
    // }

    params.max = Math.max(tags[tag], params.max);
    params.min = Math.min(tags[tag], params.min);
  }
  
  return params;
}

function calculateTagClass(count, params){
  const normalizedCount = count - params.min;
  const normalizedMax = params.max - params.min;
  const percentacge = normalizedCount / normalizedMax;
  const classNumber = Math.floor( percentacge * (optCloudClassCount - 1) + 1 );
  console.log('class number:', classNumber);
  return classNumber;

}    

function generateTags(){
  let allTags = {}; ///* [NEW] create a new variable allTags with an empty object */

  const articles = document.querySelectorAll(opts.articleSelector); /* [DONE] find all articles */

  for(let article of articles){   /* START LOOP: for every article: */
    
    const tagsWrapper = article.querySelector(optArticleTagsSelector); /* find tags wrapper */
    tagsWrapper.innerHTML = '';

    let html = '';    /* make html variable with empty string */

    const articleTags = article.getAttribute('data-tags'); /* [DONE] get tags from data-tags attribute */

    const articleTagsArray = articleTags.split(' '); /* [DONE] split tags into array */

    for(let tag of articleTagsArray){ /* START LOOP: for each tag */
     // const tagHTML = '<li><a href="#tag-' + tag + '">' + tag + '</a></li>';  /* generate HTML of the link */
      
      const tagHTMLData = {tag: tag};
      const tagHTML = templates.tagLink(tagHTMLData);
      
      html = html + tagHTML;     /* add generated code to html variable */

      if(!allTags.hasOwnProperty(tag)){ /* [NEW] check if this link is NOT already in allTags */
        allTags[tag] = 1;         /* [DONE] add generated code to allTags array */
      } else {
        allTags[tag]++;
      }

    } /* END LOOP: for each tag */
   
    tagsWrapper.innerHTML = html; /* insert HTML of all the links into the tags wrapper */
    
  }/* END LOOP: for every article: */
  
  const tagList = document.querySelector(optTagsListSelector); /* [NEW] find list of tags in right column */

  const tagsParams = calculateTagsParams(allTags);
  console.log('tagsParams:', tagsParams);
  
  //let allTagsHtml = '';
  let allTagsData = {tags: []};

  function generateTagClass(tag, tagsParams) { 
    const tagClassNumber = calculateTagClass(tag, tagsParams);
    
    return optCloudClassPrefix + tagClassNumber;
  }

  for(let tag in allTags){

    const tagClassLink = generateTagClass(allTags[tag], tagsParams);

    //allTagsHtml += '<li><a href="#tag-' + tag + '">' + tag + '(' + allTags[tag] + ')</a></li>'; 
    const tagLinkHtml ='<li><a href="#tag-' + tag + '" ' + 'class="' + tagClassLink + '"' + '>' + tag + '</a></li>'; 
    
    //allTagsHtml += tagLinkHtml;
    allTagsData.tags.push({
        tag: tag,
        count: allTags[tag],
        className: calculateTagClass(allTags[tag], tagsParams)
      });

  }
  /* [NEW] add html from allTags to tagList */
  
  //tagList.innerHTML = allTagsHtml;
  tagList.innerHTML = templates.tagCloudLink(allTagsData);
  console.log('All Tags Data:', allTagsData);

}


generateTags();

function tagClickHandler(event){
  /* [DONE] prevent default action for this event */
  event.preventDefault();

  /* [DONE] make new constant named "clickedElement" and give it the value of "this" */
  const clickedElement = this;

  /* [DONE] make a new constant "href" and read the attribute "href" of the clicked element */
  const href = clickedElement.getAttribute('href');

  /* [DONE] make a new constant "tag" and extract tag from the "href" constant */
  const tag = href.replace('#tag-','');

  /* [DONE] find all tag links with class active */
  const activeTags = document.querySelectorAll('a.active[href^="#tag-"]');
  
  /* [DONE] START LOOP: for each active tag link */
  for(let activeTag of activeTags){ 
      
    /* [DONE] remove class active */
    activeTag.classList.remove('active');
  
    /* [DONE] END LOOP: for each active tag link */
  }

  /* [DONE] find all tag links with "href" attribute equal to the "href" constant */
  const tagLinks = document.querySelectorAll('a[href="' + href + '"]');

  /* [DONE] START LOOP: for each found tag link */
  for(let tagLink of tagLinks){

    /* [DONE] add class active */
    tagLink.classList.add('active');

  /* [DONE] END LOOP: for each found tag link */
  }

  /* [DONE] execute function "generateTitleLinks" with article selector as argument */
  generateTitleLinks('[data-tags~="' + tag + '"]');
}

function addClickListenersToTags(){
  /* find all links to tags */
  const linksTags = document.querySelectorAll('a[href^="#tag-"]');
  
  /* START LOOP: for each link */
  for(let linkTag of linksTags){ 
  
    /* add tagClickHandler as event listener for that link */
    linkTag.addEventListener('click', tagClickHandler);

  /* END LOOP: for each link */
  }
}
  
addClickListenersToTags();

function generateAuthors(){

  let allAuthors = {};
  const articles = document.querySelectorAll(opts.articleSelector); /* find all articles */
  
  /* START LOOP: for every article: */
  for(let article of articles){
      
    /* find author wrapper */
    const authorWrapper = article.querySelector(optArticleAuthorSelector);
    authorWrapper.innerHTML = '';
  
    /* make html variable with empty string */
    let html = '';
  
    /* [DONE] get author from data-author attribute */
    const tempArticleAuthor = article.getAttribute('data-author');
    const articleAuthor = tempArticleAuthor.replace(' ','-');
    
    //const authorHtml = '<a href="#author-' + articleAuthor + '">' + tempArticleAuthor + '</a>'; /* generate HTML of the link */
    
    const authorHtmlData = {author: articleAuthor, name: tempArticleAuthor};
    const authorHtml = templates.authorLink(authorHtmlData);
    
    html = html + authorHtml; /* add generated code to html variable */
    
    if(!allAuthors.hasOwnProperty(tempArticleAuthor)){
      allAuthors[tempArticleAuthor] = 1;
    } else {
      allAuthors[tempArticleAuthor]++;
    }
  
    console.log('all authors:', allAuthors);

    authorWrapper.innerHTML = html; /* insert HTML of all the links into the author wrapper */
  }
      
  /* END LOOP: for every article: */
  const authorsList = document.querySelector(optAuthorListSelector);

  //let allAuthorsHtml = '';
  const allAuthorsData = {authors: []};

  for (let articleAuthor in allAuthors){
    
    //allAuthorsHtml += '<li><a href="#author-' + articleAuthor + '">' + articleAuthor + '</a> (' + allAuthors[articleAuthor] + ')</li>'; 
        allAuthorsData.authors.push({
            author: articleAuthor,
            count: allAuthors[articleAuthor],
        });
}
 //authorsList.innerHTML = allAuthorsHtml;
  authorsList.innerHTML = templates.authorList(allAuthorsData);
    console.log(allAuthorsData);
}

generateAuthors();

function authorClickHandler(event){
 
  event.preventDefault();
  const clickedElement = this;
  
  const href = clickedElement.getAttribute('href');
  console.log(href);
  
  const tempAuthor = href.replace('#author-','');
  const author = tempAuthor.replace('-',' ');
  console.log(author);
  
  const activeAuthors = document.querySelectorAll('a.active[href^="#author-"]');
  console.log(activeAuthors);
  
  for(let activeAuthor of activeAuthors){ 

    activeAuthor.classList.remove('active');
    
  }
 
  const authorLinks = document.querySelectorAll('a[href="' + href + '"]');
  
  for(let authorLink of authorLinks){
  
    authorLink.classList.add('active');
  
  }
  
  generateTitleLinks('[data-author="' + author + '"]');
}
  
function addClickListenersToAuthors(){

  const linksAuthors = document.querySelectorAll('a[href^="#author-"]');
 
  for(let linkAuthor of linksAuthors){ 
    
    linkAuthor.addEventListener('click', authorClickHandler);
  
  }
}
    
addClickListenersToAuthors();