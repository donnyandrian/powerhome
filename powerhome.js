let greetIdx = 0;

function getApps() {
    /*
    <div class="app_item_group">
        <div class="app_item">
            <a href="https://github.com/" target="_blank" rel="noopener noreferrer">
                <img src="https://logodix.com/logo/64439.png" />
            </a>
        </div>
        <div class="app_item_name">GitHub</div>
    </div>
    */
    
    fetch('./applist.json').then((response) => response.json()).then(function(json) {
        console.log(json);
        let parsed = JSON.parse(JSON.stringify(json));
        for (let i = 0; i < parsed.length; i++) {
            const element = parsed[i];
            
            const group = document.createElement("div");
            group.className = "app_item_group";

            const item = document.createElement("div");
            item.className = "app_item";

            const link = document.createElement("a");
            link.href = element.Link;
            link.target = "_blank";
            link.rel = "noopener noreferrer";

            const icon = document.createElement("img");
            icon.src = element.Icon;

            link.appendChild(icon);
            item.appendChild(link);

            const itemName = document.createElement("div");
            itemName.className = "app_item_name";
            itemName.innerText = element.Name;

            group.appendChild(item);
            group.appendChild(itemName);

            document.getElementById("apps_flex_list").appendChild(group);
        }
    });
};

function changeGrad(fromGrad, toGrad) {
    let transitionTime = 1000           // <-- 100 ms - time our animation will last
    let angle = 87;                    // <-- angle of gradient
    let element = 'greetcard'; // <-- id of our button
    let intervalFrame;                          // <-- stores the interval frame
    let currentPct = 0;                         // <-- current percentage through the animation
    let elapsed = 0;                            // <-- number of frames which have ellapsed 

    const gradientStopOne = [
        { pct: 0,  color: { r: fromGrad[0].r, g: fromGrad[0].g, b: fromGrad[0].b, a: fromGrad[0].a } }, // The first color in your gradient
        { pct: 100, color: { r: toGrad[0].r, g: toGrad[0].g, b: toGrad[0].b, a: toGrad[0].a } }   // The color you want your first color to transition to
    ];
    const gradientStopTwo = [
        { pct: 0,  color: { r: fromGrad[1].r, g: fromGrad[1].g, b: fromGrad[1].b, a: fromGrad[1].a } }, // The second color in your gradient
        { pct: 100, color: { r: toGrad[1].r, g: toGrad[1].g, b: toGrad[1].b, a: toGrad[1].a } }  // The color you want your second color to transition to
    ];

    // Apply our gradient programmatically so we can completely manipulate the gradient from JS rather than CSS
    let c1 = gradientStopOne[0].color;
    let c2 = gradientStopTwo[0].color;
    document.getElementById(element).style.background = `linear-gradient(${angle}deg, rgba(${c1.r}, ${c1.g}, ${c1.b}, ${c1.a}) 0%, rgba(${c2.r}, ${c2.g}, ${c2.b}, ${c1.a}) 93%)`;

    // This function transitions between two rgb colors
    const getColor = function(pct, colorSet) {
        for (var i = 1; i < colorSet.length - 1; i++) {
            if (pct < colorSet[i].pct) {
                break;
            }
        }
        // This conversion figures out the transition between two rgb values
        var lower = colorSet[i - 1];
        var upper = colorSet[i];
        var range = upper.pct - lower.pct;
        var rangePct = (pct - lower.pct) / range;
        var pctLower = 1 - rangePct;
        var pctUpper = rangePct;
        var color = {
            r: Math.floor(lower.color.r * pctLower + upper.color.r * pctUpper),
            g: Math.floor(lower.color.g * pctLower + upper.color.g * pctUpper),
            b: Math.floor(lower.color.b * pctLower + upper.color.b * pctUpper),
            a: (lower.color.a * pctLower + upper.color.a * pctUpper)
        };
        // And returns the rgb code
        return `rgba(${color.r}, ${color.g}, ${color.b}, ${color.a})`;
    }

    // This is our animation which we run on hover
    const animateGradient = function() {
        if(intervalFrame === undefined) {
            intervalFrame = setInterval(() => {
                let time = transitionTime / 1000; // time in seconds
                let numberOfFrames = time * 60; // 60 frames per second -> 1 second = 60 frames
                
                elapsed += 1;
                // The elapsed frames out of max frames
                currentPct = Math.min(elapsed / numberOfFrames, 1) * 100;
                
                // Calculate current color in this time for each gradient color
                let colorOne = getColor(currentPct, gradientStopOne);
                let colorTwo = getColor(currentPct, gradientStopTwo);

                // Generate CSS string
                let generateGradient = `linear-gradient(${angle}deg, ${colorOne} 0%, ${colorTwo} 93%)`;

                // Add it to our background.
                document.getElementById(element).style.backgroundImage = generateGradient;

                // End the interval when we're done
                if(currentPct === 100 || currentPct === 0) {
                    clearInterval(intervalFrame);
                    intervalFrame = undefined;
                }
            }, 16.667); // 60 frames per second
        }
    };

    animateGradient();
};

function addClassToElements(selectors, className) {
    let query = document.querySelectorAll(selectors);
    for (var i = 0; i < query.length; i++) {
        query[i].classList.add(className);
    }
}

function removeClassFromElements(selectors, className) {
    let query = document.querySelectorAll(selectors);
    for (var i = 0; i < query.length; i++) {
        query[i].classList.remove(className);
    }
}

function setGreeting() {
    const now = new Date();
    const hour = now.getHours();

    /*
    5 - 11:59 M
    12 - 16:59 AN
    17 - 4:59 E
    */
    const idx = (hour >= 17 || hour < 5) ? 2 : (hour < 12 ? 0 : 1);
    if (idx != greetIdx)
    {
        const greet = idx == 2 ? "Evening" : (idx == 0 ? "Morning" : "Afternoon");
        
        // Good Morning,
        document.getElementById("greettitle").innerText = `Good ${greet},`;
        
        const variantGrad = [
            [
                { r: 140, g: 215, b: 239, a: 1 },
                { r: 234, g: 239, b: 240, a: 1 }
            ],
            [
                { r: 239, g: 211, b: 140, a: 1 },
                { r: 240, g: 238, b: 234, a: 1 }
            ],
            [
                { r: 228, g: 242, b: 246, a: 0.75 },
                { r: 234, g: 239, b: 240, a: 0.10 }
            ]
        ];
        changeGrad(variantGrad[greetIdx], variantGrad[idx]);

        document.getElementById("greetweaico").src = `assets/${idx == 2 ? 5 : idx == 1 ? 1 : 6}.png`;

        if (idx == 2) {
            document.getElementById("appback").className = "darktheme";
        }
        else if (greetIdx == 2) {
            document.getElementById("appback").className = "lighttheme";
        }
        
        greetIdx = idx;
    }
};

getApps();

setGreeting();
setInterval(setGreeting, 2000);