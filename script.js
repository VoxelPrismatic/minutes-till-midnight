function $(a, e = document) {
    return e.querySelector(a);
} function $$(a, e = document) {
    return e.querySelectorAll(a);
}
$("#time").textContent = "-~-"
light_theme = false        

function get() {
    var d = new Date();
    var midnight = new Date();
    midnight.setHours(23);
    midnight.setMinutes(59);
    midnight.setSeconds(59);

    var diff = Math.floor((midnight - d) / 1000);
    var minutes_left = Math.floor(diff / 60);
    var seconds_left = diff % 60;
    
    $("#time").textContent = zf(minutes_left) + ":" + zf(seconds_left);
}

get_timeout = 0;

function toTheSecond() {
    if(Date() == date)
        return window.setTimeout(toTheSecond, 10);
    get_timeout = window.setInterval(get, 1000);
    console.log(get_timeout);
    get();
}

var date = Date();
toTheSecond();

function color(s) {
    $("#colorswap").value = s;
    document.body.style.color = s;
    var colors = [
        Math.floor(Number.parseInt(s.slice(1, 3), 16) / 7),
        Math.floor(Number.parseInt(s.slice(3, 5), 16) / 7),
        Math.floor(Number.parseInt(s.slice(5, 7), 16) / 7)
    ];
    var c = [
        colors[0] || Math.floor((colors[1] + colors[2]) / 4),
        colors[1] || Math.floor((colors[0] + colors[2]) / 4),
        colors[2] || Math.floor((colors[1] + colors[0]) / 4)
    ]
    var bg_dark = `rgb(${c[0]}, ${c[1]}, ${c[2]}`;
    var bg_light = `rgb(${200 + c[0]}, ${200 + c[1]}, ${200 + c[2]}`;
    var bg = bg_dark;
    var bg_inv = bg_light;
    var bg_des = `rgb(${c[0] + 10}, ${c[1] + 10}, ${c[2] + 10}`;
    if(light_theme) {
        bg = bg_light;
        bg_inv = bg_dark;
        bg_des = `rgb(${190 + c[0]}, ${190 + c[1]}, ${190 + c[2]}`;
        $("#change").innerHTML = "Dark";
    } else {
        $("#change").innerHTML = "Light";
    }
    document.body.style.backgroundColor = bg;
    $("#change").style.color = bg;
    $("#change").style.backgroundColor = bg_inv;
    
    $("#colorswap").style.backgroundColor = bg_des;
    $("#colorswap").Color = bg_des;
    
    $("hr").style.borderColor = s;
    localStorage.setItem("current_color", s);
}

function toggleTheme() {
    light_theme = !light_theme
    localStorage.setItem("light_theme", Number(light_theme))
    color(localStorage.getItem("current_color"));
}

color(localStorage.getItem("current_color") || "#00ffff");
if(localStorage.getItem("light_theme") == "1")
    toggleTheme();

function customSchedule(text) {
    var dic = {}
    var st = "{"
    var lines = [];
    for(var line of text.split("\n"))
        lines.push(...line.split(";;;"));
    for(var line of lines) {
        if(line.search(/.+(\||\\\\) *\d{1,2}:\d{2}(:\d{2})?( *(am|pm))?/) > -1) {
            var sp = line.includes("|") ? "|" : "\\\\";
            alt_format = sp == "\\\\";
            localStorage.setItem("alt_format", Number(alt_format));
            
            var per = line.split(sp)[0].trim()
            console.log(line.split(sp))
            var tm = line.split(sp)[1].trim()
            var hr = Number(tm.split(":")[0])
            var min = Number(tm.split(":")[1].slice(0, 2))
            try {
                if(Number(tm.split(":")[2].slice(0, 2)))
                    var sec = Number(tm.split(":")[2].slice(0, 2));
                else
                    var sec = 0
            } catch(err) {
                var sec = 0
            }
            if(line.trim().toLowerCase().endsWith("pm") && hr < 12)
                hr += 12
            st += `"${per}": time(${hr}, ${min}, ${sec}),`
            dic[per] = time(hr, min, sec)
        }
    }
    st += "}"
    if(st != "{}") {
        console.log(st)
        localStorage.setItem("custom_" + current_schedule_name.split(" ").slice(-1)[0], st)
        current_schedule = dic;
        last_time = 0;
        get();
    }
}
            
function scrollMaxY_() {
    if(window.scrollMaxY != undefined)
        return window.scrollMaxY;
    return document.documentElement.scrollHeight - document.documentElement.clientHeight;
}

function drawerThing(evt, elem) {
    if(evt.target != $("#drawer summary"))
        return;
    elem.classList.remove("drawer_bottom")
    localStorage.setItem('drawer_open', Number(!elem.open))
    window.setTimeout(() => {
        if(!scrollMaxY_())
            elem.classList.add("drawer_bottom");
    }, 50 * /safari/i.test(navigator.userAgent) || 1);
}

function diffTime(a, b = new Date(0)) {
    return Math.round((Math.abs(a - b) / 1000), 0);
}

function zf(itm) {
    return String(itm).padStart(2, "0");
}

$("#drawer").classList.toggle("drawer_bottom", !scrollMaxY_())

window.onresize = () => {
    $("#drawer").classList.remove("drawer_bottom")
    if(!scrollMaxY_())
        $("#drawer").classList.add("drawer_bottom")
}

function refocus() {
    last_time = 0;
    get();
    window.clearInterval(get_timeout);
    date = Date();
    toTheSecond();
}

window.onfocus = refocus;
window.onclick = refocus; 

window.onkeydown = (evt) => {
    switch(evt.key.toLowerCase()) {
        case "c":
            $("#colorswap").click();
            break;
    }
}
