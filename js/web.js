/**
 * Created by Alvaro on 28/11/2016.
 */

/*

Hacer que lo del document.ready se llame dos veces para que las paginas que se hayan cargado que tengan tb carga dinamica se carguen o bien meter un script con un a $(function) en la pagina?...

*/

var zones = [],
    lastClass = "start",
    time,
    curProgress = 10;

$(window).on("scroll", function() { //En el evento de scroll...
    cur_scroll = $(this).scrollTop();
    if (cur_scroll > 500)
    { //Comprobar si el documento ha bajado más de la posición absoluta (en vertical) del menu para hacer que baje con el documento...
        $('#main-nav').addClass("sticky");
        $('#presentacion').css('padding-top', '70px');
        $('.scrollprog').css('display', 'block');
    }
    else
    { //Si no, hacer que se quede quieto en su posición
        $('#main-nav').removeClass("sticky");
        $('#presentacion').css('padding-top', '0');
        $('.scrollprog').css('display', 'none');
    }
    botonDeAbajo(cur_scroll > 50);
    var _scroll = Math.round(cur_scroll / 100) * 100, //Redondeamos a las centenas el valor actual del scroll
        scroll = _scroll > 0 ? _scroll : 0; //Si es menor a 0, que se puede dar el caso, entonces devolver 0 en vez de un numero negativo
    if(window.innerWidth > 1200 && scroll in zones) //Aquí se buscará el elemento que corresponde dicho scroll
    { //Solo vamos a hacer el efecto con una resolución mayor a 1200 pixeles
        $("[data-dest='" + lastClass + "']").parent().removeClass('active');
        $("[data-dest='" + zones[scroll] + "']").parent().addClass('active');
        lastClass = zones[scroll];
    }
    if($(".scrollprog")) 
    {
        var porcentaje = (cur_scroll - 500) * 100 / ($(document).height() - window.innerHeight - 500);
        //fade(document.getElementsByClassName("scrollprog")[0], "background-color", {r: 255, g: 0, b: 0}, {r: 0, g: 255, b: 0}, porcentaje);
        $(".scrollprog").css("width", porcentaje + "%");
    }
});

var menu = ["presentacion", "proyectos_destacados", "proyectos", "miembros", "afiliados", "notificaciones", "contacto"];

$(document).ready(function () {
    time = new Date().getTime(); //Esto es mero entretenimiento, no se cuanto variará pero con un i7-6700k y un ssd tarda 27ms
    var fel = $('[data-flag="frontload"]'), j = fel.length;
    fel.each(function () {
        var eth = $(this); //Esta variable pìenso que sobra, pero por no ensuciar mucho la sintaxis he decidido declararla
        if(eth.data("request") != "") //Comprobamos que la bandera no es nula, y en ese caso...
            eth.load("web/frontpages/"+eth.data("request")+".html", function () { //Procedemos a la carga del contenido, y como callback...
                if (!--j) //Hemos definido una función por orden de carga, así evitamos errores al acceder a elementos que aún no existen... (Me suele pasar mucho ^^')
                { //Cuando cargue la ultima carga dinámica, procedemos a...
                    var els = $('[data-flag="dynload"]'), i = els.length; //... Obtener todos los elementos que tengan declarado este atributo, es como una bandera diciendo que divs tiene que cargar contenido dinámico
                    els.each(function () { //Cargar todas las paginas que tengan la bandera: "data-flag='dynload'", a traves de su atributo data-request
                        var eth = $(this); //Esta variable pìenso que sobra, pero por no ensuciar mucho la sintaxis he decidido declararla
                        if(eth.data("request") != "") //Comprobamos que la bandera no es nula, y en ese caso...
                            eth.load("web/sections/"+eth.data("request")+".html", function () { //Procedemos a la carga del contenido, y como callback...
                                if (!--i) //Hemos definido una función por orden de carga, así evitamos errores al acceder a elementos que aún no existen... (Me suele pasar mucho ^^')
                                { //Cuando cargue la ultima carga dinámica, procedemos a...
                                    menuResponsivo(function () { //Cargamos el menu de forma "responsiva", aunque bueno, aun sigue siendo para escritorio, puesto que comprobamos la resolución del monitor para cargar el menu de una forma u otra
                                        //var dests = document.querySelectorAll("[data-dest]:not([data-dest='start'])"); //Nuevamente para no ensuciar mucho la sintaxis y para obtener el numero total de elementos...
                                        for(var j = 0; j < menu.length; ++j)
                                        { //Por cada elemento vamos a...
                                            var id = menu[j],
                                                div = document.createElement("div");
                                            div.id = id;
                                            div.className = "dyngen";
                                            document.getElementById("main-nav").parentNode.appendChild(div);
                                            $("#"+id).load("web/includes/" + id + ".html");
                                        }
                                        $("[data-destslide]").each(function () {
                                            $(this).on('click', slideCont);
                                        });
                                    });
                                }
                            });
                    });
                }
            });
    });
    $("#subir").on("click", function () { //Esto hace que cuando hagamos click al boton de abajo a la derecha el scroll vaya hacia arriba
        $("html, body").animate({scrollTop: 0}, $(document).height()); //$(document).scrollTop() / $(document).height() * 1000 //Quiero hacer equivalente la subida
    });
    waitForElementToDisplay("#completed", 10, cargaDinCompleta);
});

//Only for debug purpouses
$(window).on("resize", function() {
    menuResponsivo();
});

function getYear() {
    return new Date().getFullYear();
}

function menuResponsivo(fn)
{ //Esta funcion hace que según la anchura en pixeles de tu monitor se cargue uno u otro menu
    var w = $(window).width(),
        dim = "",
        mn = $("#main-nav");
    if(w <= 1250 && w > 600)
    {
        dim = "1k25";
        mn.addClass("menuXI"); //Si fuera necesario para el css
    }
    else if(w <= 600)
    {
        dim = "6";
        mn.addClass("menuVI"); //Si fuera necesario para el css
    }
    else if(w > 1250)
    {
        if(mn.hasClass("menuXI"))
            mn.removeClass("menuXI");
        if(mn.hasClass("menuVI"))
            mn.removeClass("menuVI");
    }
    mn.load("web/sections/main_menu" + dim + ".html", fn);
}

function botonDeAbajo(mostrar)
{ //Esto hace que el boton se muestre con un efecto de transición
    var tiempo = 1000;
    if(mostrar)
        $("#subir").fadeIn(tiempo * 2);
    else
        $("#subir").fadeOut(tiempo);
}

function setZones(fn)
{ //Establecemos las zonas en las que habrá un cambio...
    $("[data-dest]").each(function (ii) {
        //Ignoramos el primer valor...
        var item = $(this), //Obtenemos los elementos de al revés para que se establezca como se debe
            inv = item.data("dest"); //Obtenemos el nombre
        if(inv != "")
        {
            zones[Math.round(($("#"+inv).offset() != null ? $("#"+inv).offset().top : 0) / 100) * 100] = inv; //Añadimos este destino a dicha zona
            item.on("click", function () { //Esta vez se les asigna que en el click vayan al elemento con la id correspondiente al valor su atributo data-dest
                $("html, body").animate({scrollTop: $("#"+$(this).data("dest")).offset().top}, 1000); //Hacer una equivalencia
                return false;
            });
            if(ii == $("[data-dest]").length - 1 && fn != null)
                fn();
        }
    });
}

function waitForElementToDisplay(selector, time, fn)
{
    if(document.querySelector(selector) != null)
        fn();
    else
        setTimeout(function() {
            waitForElementToDisplay(selector, time, fn);
        }, time);
}

function cargaDinCompleta() {
    setZones(function() { //Establecer las zonas...
        console.log("Last template loaded in " + (new Date().getTime() - time) + " ms!"); //Por ultimo, mandamos el mensaje de cuanto ha durado todo
    });
    $(".triangle").on('inview', function (event, visible) {
        if (visible == true)
            $(this).addClass("animated fadeInDown");
        else
            $(this).removeClass("animated fadeInDown");
    });
    $("[data-func]").each(function () {
        $(this).text(window[$(this).data("func")]);
    });
    $("[data-destslide]").each(function () {
        var hash = window.location.hash;
        hash = hash ? hash.substr(1) : hash;
        if(window.location.hash && hash == $(this).data("destslide")) {
            slideCont();
        }
    });
    $("[data-empty-placeholder]").each(function() {
        var w = $(this).data("placeholder-width"),
            h = $(this).data("placeholder-height");
        w = w.indexOf("%") > -1 ? window.innerWidth * (parseInt(w.replace("%", "")) / 100) : w.replace("px", "");
        h = h.indexOf("%") > -1 ? window.innerWidth * (parseInt(h.replace("%", "")) / 100) : h.replace("px", "");
        $(this).attr("src", "http://placehold.it/"+w+"x"+h);
    });
    $("pbar").each(function() {
        var per = $(this).data('percentage'),
            caption = $(this).data('caption');
        $(this).replaceWith(
            $("<div>").attr('id', 'progress').addClass('graph')
            .on('inview', function (event, visible) {
                if(visible)
                    $(this).children("#bar").prop('Counter', 0).animate({
                        width: per + '%'
                    }, 3000, null).children("p")
                    .animate({ Counter: parseInt(per) }, {
                        duration: 3000,
                        easing: 'swing',
                        step: function () {
                          $(this).children("span").text(Math.ceil(this.Counter));
                        },
                        complete: function() {
                            this.Counter = 0;
                        }
                    });
                else
                    $(this).children("#bar").css('width', '0');
            }).append(
                $("<div>").attr('id', 'bar').append(
                    $("<p>").text(caption == null || caption == "" ? "" : "" + caption + ": ")
                    .append($("<span>").text(per))
                    .append("%")
                )
            )
        );
    });
    // Expand Panel
	$("#open").click(function(){
		$("div#panel").slideDown("slow");
	});	
	
	// Collapse Panel
	$("#close").click(function(){
		$("div#panel").slideUp("slow");
	});		
	
	// Switch buttons from "Log In | Register" to "Close Panel" on click
	$("#toggle a").click(function () {
		$("#toggle a").toggle();
	});	
}

function getProg() {
    return curProgress;
}

function slideCont() {
    var webpage = $(".web-page.activewp");
    if(webpage) {
        webpage.hide("slide", { direction: "right" }, 1000);
        webpage.removeClass("activewp");
    }
    $('[data-request="' + $(this).data("destslide") + '"]').addClass("activewp");
}

function getPixels(per) {
    return window.innerWidth * per;
}

lerp = function(a, b, u) {
    return (1 - u) * a + u * b;
};

fade = function(el, property, start, end, duration) {
    var interval = 10;
    var steps = duration / interval;
    var step_u = 1.0 / steps;
    var u = 0.0;
    var theInterval = setInterval(function() {
        if (u >= 1.0) {
            clearInterval(theInterval);
        }
        var r = Math.round(lerp(start.r, end.r, u));
        var g = Math.round(lerp(start.g, end.g, u));
        var b = Math.round(lerp(start.b, end.b, u));
        var colorname = 'rgb(' + r + ',' + g + ',' + b + ')';
        el.style.setProperty(property, colorname);
        u += step_u;
    }, interval);
};