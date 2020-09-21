// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.

    alert("hi");
        const {ipcRenderer} = require('electron');
        const fs = require('fs')
        
        ipcRenderer.on('foo', (event, data) => {
         console.log(data); // prints 'do something for me'
});
        
        $(document).ready(function(){
            var path = "C:\\Users\\xcrim\\Documents";

            var text = "";

            var hi = 'hi';

            fs.readdir(path, function(err, items) {

                for (var i=0; i<items.length; i++) {
                    console.log(items[i]);
                    text += items[i] + " "; 

                     //console.log(typeof(text));
                    document.getElementById('file').innerHTML = hi;
                //console.log("text " + text);
            });
        });