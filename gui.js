let recoveryTimeSlider;
let immunityTimeSlider;
let fadeCheckbox;
let probeCheckbox;
let framerateSlider;
let probeRSlider;


function setupGui() {
    recoveryTimeSlider = select('#recovery');
    immunityTimeSlider = select('#immunity');

    fadeCheckbox = select('#fade');
    fadeCheckbox.changed(() => {
        shades = fadeCheckbox.checked();
    });

    fadeCheckbox.checked(true); // Set default to checked

    probeCheckbox = select('#probe');
    probeCheckbox.changed(() => {
        probe = probeCheckbox.checked();
    });
    probeCheckbox.checked(true); // Set default to checked
    

    recoveryTimeSlider.value(recoveryTime);
    immunityTimeSlider.value(immunityTime);
    select('#recoveryValue').html(recoveryTime);
    select('#immunityValue').html(immunityTime);

    recoveryTimeSlider.input(() => {
        recoveryTime = recoveryTimeSlider.value();
        select('#recoveryValue').html(recoveryTimeSlider.value());
    });

    immunityTimeSlider.input(() => {
        immunityTime = immunityTimeSlider.value();
        select('#immunityValue').html(immunityTimeSlider.value());
    });

    framerateSlider = select('#framerate');
    framerateSlider.input(() => {
        frameRate(framerateSlider.value());
        select('#framerateValue').html(framerateSlider.value());
    });
    framerateSlider.value(10); // Set default framerate
    frameRate(framerateSlider.value());
    select('#framerateValue').html(framerateSlider.value());


    probeRSlider = select('#probeR');
    probeRSlider.input(() => {
        probe_r = probeRSlider.value();
        select('#probeRValue').html(probeRSlider.value());
    });
    probeRSlider.value(20); // Set default probe radius
    select('#probeRValue').html(probeRSlider.value());

}
