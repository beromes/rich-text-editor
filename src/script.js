
const tooltips = {
    "foreColor": "Change text color",
    "backColor": "Change background color",
    "bold": "Bold (Ctrl + B)",
    "italic": "Italic (Ctrl + I)",
    "underline": "Undeline (Ctrl + U)",
    "fontSize": "Font Size (Ctrl + F)",
    "justifyLeft": "Align left (Ctrl + F)",
    "justifyCenter": "Align center (Ctrl + F)",
    "justifyRight": "Align right (Ctrl + F)",
    "justifyFull": "Justify content (Ctrl + F)",
    "createLink": "Insert link",
    "insertImage": "Insert image",
    "insertUnorderedList": "Unordered list",
    "insertOrderedList": "Ordered list",
    "indent": "Indent",
    "outdent": "Outdent",
};

let colorFor; // background or foreground

// Default config
format('fontSize', 3)
format('fontName', 'Roboto');

// Set default colors
$("#foreColor .selected-color").css('backgroundColor', document.queryCommandValue('foreColor'));
$("#backColor .selected-color").css('backgroundColor', document.queryCommandValue('backColor'));

// Contenteditable listener
document.getElementById("content").addEventListener("input", function() {
    
    // Get all actions for richt text (bold, italic, ...)
    const actions = $("#editor .actions a");
    
    Array.prototype.forEach.call(actions, function(action) {
        
        // Check if action is active
        if (document.queryCommandState(action.id)) {
            action.classList.add('selected')
        }else {
            action.classList.remove('selected');
        }
    
    });

    // Updates name and size inputs
    $("#fontName").val(document.queryCommandValue('fontName'));
    $("#fontSize").val(document.queryCommandValue('fontSize'));

    // Updates selected colors
    $("#foreColor .selected-color").css('backgroundColor', document.queryCommandValue('foreColor'));
    $("#backColor .selected-color").css('backgroundColor', document.queryCommandValue('backColor'));

}, false);

// actions listener
$(".actions a" ).click(function() {
    
    // Exec command
    format(this.id);

    // Toggle selection
    if (this.classList.contains('selected')) {
        this.classList.remove('selected');
    }else {
        // Check if a selectable group can have more than one action selected
        if (this.parentNode.classList.contains('unique')) {    
            for (let i=0; i<this.parentNode.children.length; i++) {
                this.parentNode.children[i].classList.remove('selected');
            }
        }  
        this.classList.add('selected');                      
    }    

});


/* FOR ADDING LINKS */

// Displays dialog for add a link
$(".actions #createLink").click(function() {

    // Hides others dialogs
    $(".dialog").css({'opacity': '0', 'z-index': '-1'});

    $("#link-insert").css({
        'left': this.offsetLeft  + (this.offsetWidth / 2) - ($("#link-insert")[0].offsetWidth / 2),
        'top': this.offsetTop + this.offsetWidth + 5,
        'opacity': '1',
        'z-index': '1'
    });
});


// Insert link button listener
$("#link-insert button").click(function() {
    format('createLink', $('#link-insert input').val());
    $("#link-insert").css({'opacity': '0', 'z-index': '-1'});
});



/* FOR ADDING IMAGES */

// Displays dialog for insert a link
$(".actions #insertImage").click(function() {

    // Hides others dialogs
    $(".dialog").css({'opacity': '0', 'z-index': '-1'});

    $("#image-insert").css({
        'left': this.offsetLeft  + (this.offsetWidth / 2) - ($("#image-insert")[0].offsetWidth / 2),
        'top': this.offsetTop + this.offsetWidth + 5,
        'opacity': '1',
        'z-index': '1'
    });
});

// Insert a image from url button listener
$("#insertImageFromUrl").click(function () {
    format('insertImage', $('#image-insert input').val())
    $("#image-insert").css({'opacity': '0', 'z-index': '-1'});
});

// Insert a image from computer
$("#uploadImageFromComputer").change(function () {
    var selectedFile = this.files[0];

    var reader = new FileReader();

    reader.onload = function(event) {                
        format('insertImage', event.target.result);
    };

    reader.readAsDataURL(selectedFile);

    $("#image-insert").css('opacity', '0');
});

// Dropdows listener (fontSize and fontName)
$(".dropdown select").change(function() {
    format(this.id, this.id == 'fontSize' ? +this.value : this.value)
})


// Hover listener
$(".actions a").hover(function() {
    const tooltipElement = document.getElementById('tooltip');

    // Displays tooltip
    if (tooltipElement.classList.contains('invisible') && tooltips[this.id]) {
        tooltipElement.innerHTML = '<div class=\"arrow\"></div>' + tooltips[this.id];                

        $("#tooltip").css({
            'left': this.offsetLeft + (this.offsetWidth /2) - (tooltipElement.offsetWidth / 2),
            'top': this.offsetTop + this.offsetHeight + 5,
        });

        tooltipElement.classList.remove('invisible');
    
    }else {
        tooltipElement.classList.add('invisible');
    }
});

// For picking a text color
$("#foreColor").click(function () {
     // Hides others dialogs
     $(".dialog").css({'opacity': '0', 'z-index': '-1'});

     $("#pick-color").css({
         'left': this.offsetLeft  + (this.offsetWidth / 2) - ($("#pick-color")[0].offsetWidth / 2),
         'top': this.offsetTop + this.offsetWidth + 5,
         'opacity': '1',
         'z-index': '1'
     });

     colorFor = 'foreColor';

});

// For picking a text color
$("#backColor").click(function () {

    // Hides others dialogs
    $(".dialog").css({'opacity': '0', 'z-index': '-1'});

    $("#pick-color").css({
        'left': this.offsetLeft  + (this.offsetWidth / 2) - ($("#pick-color")[0].offsetWidth / 2),
        'top': this.offsetTop + this.offsetWidth + 5,
        'opacity': '1',
        'z-index': '1'
    });

    colorFor = 'backColor';

});

// Color selections listener
$(".color").click(function () {
    
    // Apply change at contentEditable
    format(colorFor, this.style.backgroundColor);

    // Change the selected color label
    $("#" + colorFor + " .selected-color").css('backgroundColor', this.style.backgroundColor);
    
    // Hides others dialogs
    $(".dialog").css({'opacity': '0', 'z-index': '-1'}); 
});


$("#content").click(function () {
    // Hides others dialogs
    $(".dialog").css({'opacity': '0', 'z-index': '-1'});
});



// Execute a command at the editor
function format(command, value) {            
    $("#content").focus();           
    document.execCommand(command, false, value);
}

