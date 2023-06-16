const { BrowserWindow } = require('@electron/remote')
const myModpacksButton = document.getElementById('my-modpacks-button');
const browseModpacksButton = document.getElementById('browse-modpacks-button');

myModpacksButton.classList.add('active');

myModpacksButton.addEventListener('click', function() {
    if (!myModpacksButton.classList.contains('active')) {
      myModpacksButton.classList.add('active');
      browseModpacksButton.classList.remove('active');
    }
  });
  
  browseModpacksButton.addEventListener('click', function() {
    if (!browseModpacksButton.classList.contains('active')) {
      browseModpacksButton.classList.add('active');
      myModpacksButton.classList.remove('active');
    }
  });

document.getElementById('minimize').addEventListener('click', () => {
    console.log('Minimize button clicked')
    BrowserWindow.getFocusedWindow().minimize()
})

document.getElementById('maximize').addEventListener('click', () => {
    console.log('Maximize button clicked')
    let window = BrowserWindow.getFocusedWindow()
    if (window.isMaximized()) {
        window.unmaximize()
    } else {
        window.maximize()
    }
})

document.getElementById('close').addEventListener('click', () => {
    console.log('Close button clicked')
    BrowserWindow.getFocusedWindow().close()
})

// Get the modal
var modal = document.getElementById("myModal");

// Get the button that opens the modal
var btn = document.getElementById("create-modpack-button");

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

// Get the form
var form = document.getElementById('modpackForm');

// When the user clicks the button, open the modal 
btn.onclick = function() {
  modal.style.display = "block";
}

// When the user clicks on <span> (x), close the modal
span.onclick = function() {
  modal.style.display = "none";
  form.reset(); // Reset the form
  document.getElementById('modpackLogoButton').textContent = 'Choose File'; // Reset the button text
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
    form.reset(); // Reset the form
    document.getElementById('modpackLogoButton').textContent = 'Choose File'; // Reset the button text
  }
}

// Handle form submission
document.getElementById('modpackForm').addEventListener('submit', function(event) {
  event.preventDefault();
  // Here you can handle the form submission. For now, we'll just log the input values.
  console.log('Modpack Name: ' + document.getElementById('modpackName').value);
  console.log('Modpack Logo: ' + document.getElementById('modpackLogo').value);
});

// Get the custom button and the file input
var button = document.getElementById('modpackLogoButton');
var fileInput = document.getElementById('modpackLogo');

// When the user clicks the button, trigger the file input click
button.onclick = function() {
  fileInput.click();
}

// When a file is selected, update the button text
fileInput.onchange = function() {
  if (fileInput.value) {
    button.textContent = 'File Chosen';
  } else {
    button.textContent = 'Choose File';
  }
}
