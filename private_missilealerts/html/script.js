$(document).ready(async function () {
    let interval = 0
    let displaypic = 1
    let missiles = false;
    let drone = false;
    let imageScreen = false;
    let alertSide = 'right'
    let animationTime = 1000
    $('.alerts').css(alertSide, "-50vh");
    const alertSound = new Audio(`nui://${GetParentResourceName()}/html/sounds/alert.ogg`);
    window.addEventListener("message", function (event) {
        data = event.data;

        if(data.type == "alerts"){
            $('.alert').remove()
            if (data.alerts && Object.keys(data.alerts).length > 0) {
                Object.keys(data.alerts).forEach((value) => {
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
    
    
    
                    $('.alerts').append(`<div class="alert">${addvalue}</div>`)
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
                    // imageElement.style.display = "none"
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
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }

    CheckSettings();
});

