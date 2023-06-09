function showLetra(data, art, mus, arrayid) {
  if (!arrayid) arrayid = 0;

  if (data.type == "exact" || data.type == "aprox") {
    // Print lyrics text
    $("#letra .text").text(data.mus[arrayid].text);
    $("#letra .music").text(data.mus[arrayid].name);
    $("#art .arti").text(data.art.name);
    if(data.mus[arrayid].alb){
      $("#letra .alb").text(data.mus[arrayid].alb.name + " - " + data.mus[arrayid].alb.year);
    }else{
      $("#art .imgArt").attr("src", data.art.pic_medium);
    }

    // Show buttons to open original and portuguese translation
    if (data.mus[arrayid].translate) {
      $("#letra .text").prepend(
        '<button type=button class="btn btn-outline-info" style="margin: 10px; background-color: #765257; color: #caa0a9; border-color: #caa0a9;" onClick="$(document).trigger(\'translate\')">Portuguese</button><br/>'
      );
      $(document).one("translate", function () {
        $("#letra .text").text(data.mus[arrayid].translate[0].text);
        $("#letra .text").prepend(
          '<button type=button class="btn btn-outline-info" style="margin: 10px; background-color: #765257; color: #caa0a9; border-color: #caa0a9;" onClick="$(document).trigger(\'original\')">Original</button><br/>'
        );
        $(document).one("original", function () {
          showLetra(data, art, mus, arrayid);
        });
      });
    }

    if (data.type == "aprox" && !$("#aprox").is("div")) {
      $("#letra").prepend(
        '<div id=aprox>We found something similar<br/><span class=songname>"' +
        data.mus[arrayid].name +
        '"</span></div>'
      );

      if (data.mus.length > 0) {
        var html = "<select class=songselect>";
        for (var i = 0; i < data.mus.length; i++) {
          html +=
            '<option value="' +
            i +
            '"' +
            (i == arrayid ? " selected" : "") +
            ">" +
            data.mus[i].name +
            "</option>";
        }
        html += "</select>";
        $("#aprox span.songname").html(html);
        $("#aprox select.songselect").change(function () {
          var aID = $("option:selected", this).val();
          showLetra(data, art, mus, aID);
        });
      }
    }
  } else if (data.type == "song_notfound") {
    // Song not found, but artist was found
    $("#letra .text").html(
      'Song "' + mus + '" from "' + art + '" was not found.<br/>'
    );
  } else {
    // Artist not found
    $("#letra .text").html(
      'Song "' +
      mus +
      '" from "' +
      art +
      '" was not found<br/>' +
      "(artist not found)<br/>"
    );
  }
}
function fetchLetra(art, mus, img) {
  var data = jQuery.data(document, art + mus);
  if (data) {
    showLetra(data, art, mus);
    return true;
  }

  var url =
    "https://api.vagalume.com.br/search.php" +
    "?art=" +
    encodeURIComponent(art) +
    "&mus=" +
    encodeURIComponent(mus)

  if (img) {
    url = url + "&extra=artpic";
    } else {
      url = url + "&extra=alb";
    }

    if (!jQuery.support.cors) {
      url += "&callback=?";

    }

    jQuery.getJSON(url, function (data) {
      jQuery.data(document, art + mus, data);
      showLetra(data, art, mus);
    });
  }

  var sendButton = document.getElementById("send");

  sendButton.addEventListener("click", function () {
    var artista = document.getElementById("artista").value;
    var music = document.getElementById("music").value;

    fetchLetra(artista, music, false);
    fetchLetra(artista, music, true);

    var img = document.getElementById("myImage");
    img.style.display = "block";
  });
