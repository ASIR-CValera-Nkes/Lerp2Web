/**
 * Created by Alvaro on 28/11/2016.
 */

var zones = [],
    lastClass = "start",
    time,
    curProgress = 6;

$(window).on("scroll", function() { //En el evento de scroll...
    cur_scroll = $(this).scrollTop();
    if (cur_scroll > 500)
    { //Comprobar si el documento ha bajado más de la posición absoluta (en vertical) del menu para hacer que baje con el documento...
        $('#main-nav').addClass("sticky");
        $('#presentacion').css('padding-top', '70px');
    }
    else
    { //Si no, hacer que se quede quieto en su posición
        $('#main-nav').removeClass("sticky");
        $('#presentacion').css('padding-top', '0');
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
});

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
                                        var dests = document.querySelectorAll("[data-dest]:not([data-dest='start'])"); //Nuevamente para no ensuciar mucho la sintaxis y para obtener el numero total de elementos...
                                        for(var j = 0; j < dests.length; ++j)
                                        { //Por cada elemento vamos a...
                                            var id = dests[j].dataset.dest,
                                                div = document.createElement("div");
                                            div.id = id;
                                            div.className = "dyngen";
                                            document.getElementById("main-nav").parentNode.appendChild(div);
                                            $("#"+id).load("web/includes/" + id + ".html");
                                        }
                                    });
                                    $("[data-func]").each(function () {
                                        $(this).text(window[$(this).data("func")]);
                                    });
                                    $("[data-destslide]").each(function () {
                                        $(this).on('click', function () {
                                            var webpage = $(".web-page.active");
                                            webpage.hide("slide", { direction: "left" }, 1000);
                                            webpage.removeClass("active");
                                            $('[data-request="' + $(this).data("destslide") + '"]').addClass("active");
                                        })
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
    if(w <= 1200 && w > 600)
    {
        dim = "1k2";
        mn.addClass("menuXI"); //Si fuera necesario para el css
    }
    else if(w <= 600)
    {
        dim = "6";
        mn.addClass("menuVI"); //Si fuera necesario para el css
    }
    else if(w > 1200)
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
    var tiempo = 250;
    if(mostrar)
        $("#subir").fadeIn(tiempo * 2);
    else
        $("#subir").fadeOut(tiempo);
}

function setZones(fn)
{ //Establecemos las zonas en ñlas que habrá un cambio...
    $("[data-dest]").each(function (ii) {//Ignoramos el primer valor...
        var item = $(this), //Obtenemos los elementos de al revés para que se establezca como se debe
            inv = item.data("dest"); //Obtenemos el nombre
        if(inv != "")
        {
            zones[Math.round($("#"+inv).offset().top / 100) * 100] = inv; //Añadimos este destino a dicha zona
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
    $("#progbar").on('inview', function (event, visible) {
        if (visible == true)
            move();
        else
            unmove();
    });
}

function move() 
{
  var elem = document.getElementById("progbar"),
      width = 0,
      id = setInterval(frame, 50);
  function frame() 
  {
    if (width >= curProgress)
      clearInterval(id);
    else 
    {
      ++width; 
      elem.style.width = width + '%'; 
      document.getElementById("demo").innerHTML = width * 1 + '%';
    }
  }
}

function unmove() {
    var elem = document.getElementById("progbar");
    elem.style.width = "0%";
    document.getElementById("demo").innerHTML = "0%";
}

function getProg() {
    return curProgress;
}