$(document).ready(async function () {
    let interval = 0
    let displaypic = 1
    let missiles = false;
    let drone = false;
    let imageScreen = false;
    let alertSide = 'right'
    let animationTime = 1000
    let cities = []
    let SpecificAlert = false;
    let personalCity = localStorage.getItem("private_cityalert") || null;
    $('.alerts').css(alertSide, "-50vh");
    const alertSound = new Audio(`nui://${GetParentResourceName()}/html/sounds/alert.ogg`);
    window.addEventListener("message", function (event) {
        data = event.data;

        if(data.type == "alerts"){
            $('.alert').remove()
            $('.alert-flash').remove()
            if (data.alerts && Object.keys(data.alerts).length > 0) {
                Object.keys(data.alerts).forEach((value) => {
                    if(!SpecificAlert){
                        if(personalCity && personalCity === value){
                            SpecificAlert = true;
                            PlayPersonalAlert(value);
                            setTimeout(() => {
                                SpecificAlert = false;
                            }, 120000);
                        }
                    }
                   
                    let addvalue = value
                    alerttype = data.alerts[value] || 1
                    if (alerttype == 1) {
                        missiles = true
                        if (drone && missiles) {
                            textheader.innerText = "חדירת כלי טיס ורקטות"
                        } else {
                            textheader.innerText = "ירי רקטות"
                        }
                    }
                    else if (alerttype == 2) {
                        addvalue = addvalue + " ✈️"
                        drone = true
                        if (drone && missiles) {
                            textheader.innerText = "חדירת כלי טיס ורקטות"
                        } else {
                            textheader.innerText = "חדירת כלי טיס עוין"
                        }
                    }
    
    
    
                    const alertClass = personalCity === value ? "alert-flash" : "alert";
                    $('.alerts').append(`<div class=${alertClass}>${addvalue}</div>`)
                })
                if(alertSide == "right"){
                    $('.alerts').animate({ right: "1vh", opacity: 1 }, animationTime)
                }else{
                    $('.alerts').animate({ left: "1vh", opacity: 1 }, animationTime)
                }
    
                if(imageScreen){
                    if (interval == 0) {
                        interval = setInterval(() => {
                            SwapGifs()
                        }, 6500);
                    }
                }
               
            } else {
                if(imageScreen){
                    if (interval != 0) {
                        clearInterval(interval)
                        interval = 0
                    }
                }
                missiles = false;
                drone = false;
                displaypic = 0
                textheader.innerText = "ירי רקטות"
                if(alertSide == "right"){
                    $('.alerts').animate({ right: "-50vh", opacity: 0 }, animationTime)
                }else{
                    $('.alerts').animate({ left: "-50vh", opacity: 0 }, animationTime)
                }
            }
        }else if(data.type == "playSound"){
            playAlertSound()
        }else if(data.type == "openMenu"){
            openCityMenu()
        }
    });

    const Gifs = {
        gif1: "https://media0.giphy.com/media/4S3P68PpJPYZ1IQe7J/giphy.gif?cid=ecf05e4769o8mhql26jzmewhtjoiz8cewo0n7cd6odqhzndz&ep=v1_gifs_search&rid=giphy.gif&ct=g",
        gif2: `nui://${GetParentResourceName()}/html/images/shwaye.gif`,
        gif3: `https://media.giphy.com/media/RGXkpRK6oKWuCwJ6C8/giphy.gif`,
        gif4: `nui://${GetParentResourceName()}/html/images/ilalertsof.png`,
        gif5: `nui://${GetParentResourceName()}/html/images/ilalertmet.png`,
        gif6: "https://pbs.twimg.com/media/F-rBwqbWYAAucJR?format=jpg&name=900x900",
    };

    const gifKeys = Object.keys(Gifs);

    const SwapGifs = () => {
        const GifUrl = Gifs[gifKeys[displaypic]];
        const logoImg = document.getElementById('logo');
        if (logoImg) {
            logoImg.src = GifUrl;
        }
        displaypic++
        if (displaypic > gifKeys.length - 1) {
            displaypic = 0
        }
    }

    const playAlertSound = () => {
        alertSound.currentTime = 0;
        alertSound.play().catch((error) => console.error('Error playing sound:', error));
    };

    const PlayPersonalAlert = (city) => {
        const audio = new Audio(`nui://${GetParentResourceName()}/html/sounds/emergency_sound.mp3`);
        audio.volume = 0.3;
        audio.play().catch(error => console.error("Audio playback failed:", error));
        Toastify({
            text: `אזעקה בעיר שלך: ${city} - נא להיכנס למרחב מוגן`,
            duration: 40000,
            gravity: "top",
            position: "center",
            style: {
                background: "#2d2b2b",
                color: "#ff0000",
                borderRadius: "25px",
                padding: "20px 30px",
                ["border-left"]: "5px solid #ff6600",
                fontSize: "24px",
                fontWeight: "bold",
                display: "flex",
                alignItems: "center",
            },
            avatar: `nui://${GetParentResourceName()}/html/images/oref.png`,
        }).showToast();
        
    };

    const openCityMenu = () => {
        const menu = document.getElementById('cityMenu');
        const cityList = document.getElementById('cityList');
        const searchInput = document.getElementById('citySearch');
        const yourCity = document.getElementById('yourCity')
        yourCity.innerText = `היישוב שלך: ${(personalCity || "לא בחרת")}`
        menu.style.display = 'block';
        cityList.innerHTML = ''; 

        cities.forEach(city => {
            const cityItem = document.createElement('div');
            cityItem.classList.add('city-item');
            cityItem.innerText = city;
            cityItem.onclick = () => {
                personalCity = city
                yourCity.innerText = `היישוב שלך: ${(personalCity || "לא בחרת")}`
                localStorage.setItem("private_cityalert", city)
                Toastify({
                    text: `העיר שבחרת: ${city}`,
                    duration: 3500,
                    gravity: "top",
                    position: "center",
                    style: {
                        background: "#2d2b2b",
                        color: "#ff6600",
                        borderRadius: "25px",
                        padding: "10px 20px",
                        ["border-left"]: "5px solid #ff6600",
                        display: "flex",
                        alignItems: "center",
                    },
                    avatar: `nui://${GetParentResourceName()}/html/images/oref.png`,
                }).showToast();
            }
            cityList.appendChild(cityItem);
        });
    
        searchInput.addEventListener('input', function () {
            const filter = searchInput.value.toLowerCase();
            cityList.innerHTML = '';
            cities
                .filter(city => city.toLowerCase().includes(filter))
                .forEach(city => {
                    const cityItem = document.createElement('div');
                    cityItem.classList.add('city-item');
                    cityItem.innerText = city;
                    cityItem.onclick = () => {
                        personalCity = city
                        yourCity.innerText = `היישוב שלך: ${(personalCity || "לא בחרת")}`
                        localStorage.setItem("private_cityalert", city)
                        Toastify({
                            text: `העיר שבחרת: ${city}`,
                            duration: 3500,
                            gravity: "top",
                            position: "center",
                            style: {
                                background: "#2d2b2b",
                                color: "#ff6600",
                                borderRadius: "25px",
                                padding: "10px 20px",
                                ["border-left"]: "5px solid #ff6600",
                                display: "flex",
                                alignItems: "center",
                            },
                            avatar: `nui://${GetParentResourceName()}/html/images/oref.png`,
                        }).showToast();
                        
                    };
                    cityList.appendChild(cityItem);
                });
        });
    }
    
    const RemoveCity = () => {
        const yourCity = document.getElementById('yourCity')
        yourCity.innerText = `היישוב שלך: לא בחרת`
        personalCity = null;
        localStorage.removeItem("private_cityalert")
        Toastify({
            text: "הסרת את הישוב",
            duration: 3500,
            gravity: "top",
            position: "center",
            style: {
                background: "#2d2b2b",
                color: "#ff6600",
                borderRadius: "25px",
                padding: "10px 20px",
                ["border-left"]: "5px solid #ff6600",
                display: "flex",
                alignItems: "center",
            },
            avatar: `nui://${GetParentResourceName()}/html/images/oref.png`,
        }).showToast();
    }
    $('#RemoveCity').on('click', RemoveCity);

    const ToggleAlerts = async () => {
        const response = await $.post(`https://${GetParentResourceName()}/blockalerts`,{});
        if(response == null) return;
        Toastify({
            text: response == true && "חסמת את ההתרעות" || "הדלקת את ההתרעות",
            duration: 5000,
            gravity: "top",
            position: "center",
            style: {
                background: "#2d2b2b",
                color: "#ff6600",
                borderRadius: "25px",
                padding: "10px 20px",
                ["border-left"]: "5px solid #ff6600",
                display: "flex",
                alignItems: "center",
            },
            avatar: `nui://${GetParentResourceName()}/html/images/oref.png`,
        }).showToast();
    }

    
    $('#ToggleAlerts').on('click', ToggleAlerts);


    $(document).on('keydown', function(event) {
        if (event.key === "Escape") {
            const menu = document.getElementById('cityMenu');
            menu.style.display = 'none';
            const searchInput = document.getElementById('citySearch');
            searchInput.value = "";
            $.post(`https://${GetParentResourceName()}/close`,{});
        }
    });

    const CheckSettings = async () => {
        try {
            const response = await fetch(`https://${GetParentResourceName()}/getSettings`);
            if (!response.ok) {
                throw new Error('no response received by the script.');
            }
            const data = await response.json();
            const imageElement = document.getElementById("logo");
            imageScreen = data.imagescreen
            if(imageScreen){
                if(imageElement){
                    imageElement.style.display = "flex"
                }
            }else{
                if(imageElement){
                    imageElement.src = `nui://${GetParentResourceName()}/html/images/oref.png`
                }
            }
            const aSide = data.alertSide
            if(aSide){
                alertSide = aSide
                if(alertSide == "left"){
                    $('.alerts').css(alertSide, "-50vh");
                }
            }

            if(data.animationTime){
                animationTime = data.animationTime
            }

            if(data.cities) cities = data.cities;
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }

    CheckSettings();
});

