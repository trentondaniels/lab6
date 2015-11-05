var main = function() {
    $('.dropdown-toggle').click(function() {
        $('.dropdown-menu').toggle();
    });
    
    $('.arrow-next').click(function() {
        var currentSlide = $('.active-slide');
        var nextSlide = currentSlide.next();
        var currentDot = $('.active-dot');
        var nextDot = currentDot.next();
        if (nextSlide.length === 0) {
            nextSlide = $('.slide').first();
        }
        if (nextDot.length === 0) {
            nextDot = $('.dot').first();
        }
        currentSlide.fadeOut(600).removeClass('active-slide');
        nextSlide.fadeIn(600).addClass('active-slide');
        currentDot.removeClass('active-dot');
        nextDot.addClass('active-dot');
    });
    
    $('.arrow-prev').click(function() {
        var currentSlide = $('.active-slide');
        var prevSlide = currentSlide.prev();
        var currentDot = $('.active-dot');
        var prevDot = currentDot.prev();
        if (prevSlide.length === 0) {
            prevSlide = $('.slide').last();
        }
        if (prevDot.length === 0) {
            prevDot = $('.dot').last();
        }
        currentSlide.fadeOut(600).removeClass('active-slide');
        prevSlide.fadeIn(600).addClass('active-slide');
        currentDot.removeClass('active-dot');
        prevDot.addClass('active-dot');
    });
    
    
    //City Search//
    $( "#cityfield" ).keyup(function() {
        $.getJSON("getcity?q=" + $("#cityfield").val() ,function(data) {
            var everything;
            var searchCity = $('#cityfield').val();
            if (searchCity.length > 0) {
                everything = "<ul>";
                $.each(data, function(i,item) {
                    if(data[i].city.substring(0, searchCity.length).toLowerCase() === searchCity.toLowerCase()) {
                        everything += "<li> "+data[i].city;
                    }
                });
                everything += "</ul>";
                $("#txtHint").html(everything);
            }
            else {
                $("#txtHint").html("");
            }
        })
        .done(function() { 
            console.log('getJSON request succeeded!'); 
            
        })
        .fail(function(jqXHR, textStatus, errorThrown) { 
            console.log('getJSON request failed! ' + textStatus); 
            console.log("incoming "+jqXHR.responseText);
        })
        .always(function() { console.log('getJSON request ended!');
        })
        .complete(function() { 
            console.log("complete"); 
            
        });
    });
    
    $('#submit-city').click(function() {
        var searchCity = $('#cityfield').val();
        $('#dispcity').text(searchCity);
        
        //Weather Search//
        var myurl= "https://api.wunderground.com/api/34eeef2fbdd82602/geolookup/conditions/q/UT/";
        myurl += searchCity;
        myurl += ".json";
        console.log(myurl);
        $.ajax({
            url : myurl,
            dataType : "jsonp",
            success : function(parsed_json) {
                var location = parsed_json.location.city;
                var temp_string = parsed_json.current_observation.temperature_string;
                var current_weather = parsed_json.current_observation.weather;
                everything = "<ul>";
                everything += "<li>Location: "+location +"</li>";
                everything += "<li>Temperature: "+temp_string+"</li>";
                everything += "<li>Weather: "+current_weather+"</li>";
                everything += "</ul>";
                $("#weather").html(everything);
            }  
        });
        return false;
    });
};
$(document).ready(main);
