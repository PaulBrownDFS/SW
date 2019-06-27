// Preview Code v1.0

// Get Slot ID
var dataSlot = document.getElementsByClassName('js_HP_Carousel_wrap')[0],
      slot_ID = dataSlot.slotId  ||  '3aef0b44-2608-4d37-b413-e9fac1240cd2';

var contentDeliveryUrl = "//" + getQueryVar('api') +
  "/cms/content/query?fullBodyObject=true&query=" +
  encodeURIComponent(JSON.stringify({
    "sys.iri": "http://content.cms.amplience.com/" + slot_ID 
  })) +
  "&scope=tree&store=store";

console.log("This is the URL");
console.log(contentDeliveryUrl);


var deliveryRequest = $.ajax({
  url: contentDeliveryUrl
});
// render the content or display error response
deliveryRequest
  .done(renderContent)
  .fail(showErrorMessage);


function renderContent(data) {

  // use the Amplience CMS JavaScript SDK to manipulate the JSON-LD into a content tree
  var contentTree = amp.inlineContent(data)[0];

  pbr = contentTree;

  Handlebars.partials = AmpCa.templates;

  AmpCa.utils = new AmpCa.Utils();
  Handlebars.partials['acc-template-HP_Carousel_Slide'] = AmpCa.templates['acc-template-HP_Carousel_Slide'];
  Handlebars.partials['acc-template-image'] = AmpCa.templates['acc-template-image'];

  var template = Handlebars.template(AmpCa.templates['acc-template-HP_Carousel_slot']);
  document.querySelectorAll(".js_HP_Carousel_wrap")[0].innerHTML = template(contentTree);

  console.log('Init Owl Carousel: ', true);

  $('.owl-carousel-hero').owlCarousel({
    dots: true,
    loop: true,
    margin: 0,
    nav: true,
    navText: ['', ''],
    lazyLoad: true,
    items: 1,
    animateOut: 'fadeOut',
    autoplay: true,
    autoplayTimeout: 6000,
    autoplayHoverPause: true
  });
}

function showErrorMessage(err) {
  console.log('Delivery API Request Failure', err);
  $(document.body).append('<div class="error">An error occurred retrieving your content.<br/><br/>Please ensure that it is published.<br/><br/>Details of the error have been saved to the browser console.</div>');
}

function getQueryVar(variable) {
  var query = window.location.search.substring(1);
  console.log('query');
  console.log(query);

  var vars = query.split('&');
  for (var i = 0; i < vars.length; i++) {
    var pair = vars[i].split('=');
    if (decodeURIComponent(pair[0]) == variable) {
      console.log('decoded URL')
      console.log(decodeURIComponent(pair[1]));

      return decodeURIComponent(pair[1]);
    }
  }
  return false;
}
