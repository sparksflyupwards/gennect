//JavaScript Document

$(document).ready(function() {
    "use strict";
    
$('.mainNav a').on('click', function(){
event.preventDefault();
    
    var sectionContent; 
    sectionContent = $(this).attr('data-section');
	$(sectionContent).show();
	$(sectionContent).siblings('.helloKitty').hide();
});    
});