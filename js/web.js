/**
 * Created by Alvaro on 28/11/2016.
 */

$(window).on("scroll", function() { //En el evento de scroll...
    if ($(this).scrollTop() > 500)
    { //Comprobar si el documento ha bajado más de la posición absoluta (en vertical) del menu para hacer que baje con el documento...
        $('#main-nav').addClass("sticky");
        $('#presentacion').css('padding-top', '70px');
    }
    else
    { //Si no, hacer que se quede quieto en su posición
        $('#main-nav').removeClass("sticky");
        $('#presentacion').css('padding-top', '0');
    }
    botonDeAbajo($(this).scrollTop() > 50);
});

$(document).ready(function () {
    var i = 0, //Un simple contador, que luego utilizaremos para saber cuando ha cargado la última página dinámica
        time = new Date().getTime(), //Esto es mero entretenimiento, no se cuanto variará pero con un i7-6700k y un ssd tarda 27ms
        els = $('[data-flag="dynload"]'), //Obtenemos todos los elementos que tengan declarado este atributo, es como una bandera diciendo que divs tiene que cargar contenido dinámico
        l = els.length; //Cuantos elementos hay con la bandera de carga dinámica
    els.each(function () { //Cargar todas las paginas que tengan la bandera: "data-flag='dynload'", a traves de su atributo data-request
        var eth = $(this); //Esta variable pìenso que sobra, pero por no ensuciar mucho la sintaxis he decidido declararla
        if(eth.data("request") != "") //Comprobamos que la bandera no es nula, y en ese caso...
            eth.load("web/"+eth.data("request")+".html", function () { //Procedemos a la carga del contenido, y como callback...
                ++i; //"Pre"-sumar al contador
                if (l == i) //Hemos definido una función por orden de carga, así evitamos errores al acceder a elementos que aún no existen... (Me suele pasar mucho ^^')
                { //Cuando cargue la ultima carga dinámica, procedemos a...
                    //i = 0; //? Reseteamos el contador por si lo fueramos a usar, aunque yocreo que esto sobra...
                    menuResponsivo(function () { //Cargamos el menu de forma "responsiva", aunque bueno, aun sigue siendo para escritorio, puesto que comprobamos la resolución del monitor para cargar el menu de una forma u otra
                        var dests = $("[data-dest]"), //Nuevamente para no ensuciar mucho la sintaxis y para obtener el numero total de elementos...
                            ll = dests.length; //Numero total de elementos con la bandera data-dest, simplemente es para hacer que el menu al hacerle clcick a uno de sus elementos funcione
                        dests.each(function (ii) { //Por cada elemento vamos a...
                            if(ii > 0) //Primero, comprobar que el primer elemento no lo carguemos dinámicamente
                            { //Simplemente, es el correspondiente  al botón Inicio, va antes en vez de después y que ya está cargado, por eso nos lo saltamos
                                var inv = $(dests[ll - ii]).data("dest"); //Obtenemos los elementos de al revés para que cargue como se debe
                                $("#main-nav").after('<div id="' + inv + '"></div>'); //Añadimos los divs con su id correspondiente, después del menú
                                $("#" + inv).load("web/includes/" + inv + ".html"); //Finalmente, cargamos dinámicamente todos los elementos necesarios (son las secciones de la página)
                            }
                            if(ii == ll - 1)
                            { //Una vez recorremos todo el contenido por completo entonces es cuando debemos de ejecutar la ultima instrucción...
                                $("[data-dest]").each(function () { //Esta instrucción nuevamente recorre todos los elementos que tengan el atributo data-dest definido
                                    $(this).on("click", function () { //Esta vez se les asigna que en el click vayan al elemento con la id correspondiente al valor su atributo data-dest
                                        $("html, body").animate({scrollTop: $("#" + $(this).data("dest")).offset().top - 70}, 1000); //Hacer una equivalencia
                                        return false;
                                    });
                                });
                                console.log("Last template loaded in " + (new Date().getTime() - time) + " ms!"); //Por ultimo, mandamos el mensaje de cuanto ha durado
                            }
                        });
                    });
                }
            });
    });
    $("#subir").on("click", function () { //Esto hace que cuando hagamos click al boton de abajo a la derecha el scroll vaya hacia arriba
        $("html, body").animate({scrollTop: 0}, $(document).height()); //$(document).scrollTop() / $(document).height() * 1000 //Quiero hacer equivalente la subida
    });
});

//Only for debug purpouses
$(window).on("resize", function() {
    menuResponsivo();
});

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
    mn.load("web/main_menu" + dim + ".html", fn);
}

function botonDeAbajo(mostrar)
{ //Esto hace que el boton se muestre con un efecto de transición
    var tiempo = 250;
    if(mostrar)
        $("#subir").fadeIn(tiempo * 2);
    else
        $("#subir").fadeOut(tiempo);
}