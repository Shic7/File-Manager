const path = require('path');
const fs = require('fs');
const mv = require('mv');
var rimraf = require("rimraf");

var path2, game2, sprites2, labels2, moveArr = [];

var copiedPath;

var music;

var musicCount = 0;
   
var fileCopied = '';

var objectCopied, objectCopied2;

var backspace = true;


//Gets all of the files in the current directory
function getFiles(game, path, sprites, labels, trash, createFile, scrollSprite, callback)
{
    var text = ",";
   
    moveArr.length = 0;
   
    var tempArr = path.split('\\');
               
    tempArr.pop();
   
    var temp = tempArr.join('\\');
   
    moveArr.push(temp);

    fs.readdir(path, function(err, items) {

        for (var i=0; i<items.length; i++) {
            text += items[i] + ",";

            var moveCheck = path + '\\' + items[i];

            var stats = fs.statSync(moveCheck);

            if(stats.isDirectory() == true)
            {
                moveArr.push(moveCheck);
            }
        }  
        callback(text, game, sprites, labels, path, trash, createFile, scrollSprite);
    });    
}

//Displays all of the files from the current directory
function displayFiles(text, game, sprites, labels, path, trash, createFile, scrollSprite)
{
    var was_dragged = false;
    var originalx;
    var originaly;
    var currentObject;
    var allfiles;

    allfiles = text.split(',');

    var i;

    var style = {fontSize: '12px', fill: 'white', backgroundColor: 'grey', align: "center", wordWrap:{width: 100, useAdvancedWrap: true}};
   
    var style1 = {fontSize: '12px', fill: 'white', wordWrap:{width: 145, useAdvancedWrap: true}};
   
	generateSprites(game, allfiles, path, sprites, labels, style, scrollSprite);
   
   
    //Dropped into "trash", so delete file
    game.input.on('drop', function(pointer, gameObject, target){
        if(target.name == 'trash')
        {
            currentObject = gameObject.name;

            var updatedPath = path + '\\' + currentObject;
           
            var stats = fs.statSync(updatedPath);
           
            if(stats.isFile() == true)
            {
                deleteFile(game, path, sprites, labels, updatedPath);
            }
           
            else if(stats.isDirectory() == true)
            {
                removeDir(game, path, sprites, labels, updatedPath);
            }
        }
       
        //Dropped onto "copy", so copies file
        else if(target.name == 'copy')
        {
            fileCopied = path + '\\' + gameObject.name;
           
            var copyFile2 = game.add.sprite(1330, 658, 'copy2');
            
            copyFile2.setScrollFactor(0);
            
            var pasteText = game.add.text(1317, 685, 'Paste', style1);
            
            pasteText.setScrollFactor(0);


            copyFile2.setInteractive();
           
            objectCopied = gameObject.name;
        }
       
        //Dropped onto "move", so gives option to move file
        else if(target.name == 'cresselia')
        {      
            path2 = path;
            game2 = game;
            sprites2 = sprites;
            labels2 = labels;
           
            copiedPath = path + '\\' + gameObject.name;
           
            objectCopied2 = gameObject.name;

            move();
        }

    });

    game.input.on('dragstart', function (pointer, gameObject, dragX, dragY) {
        originalx = gameObject.x;
        originaly = gameObject.y;
    });
   
    game.input.on('drag', function (pointer, gameObject, dragX, dragY) {
        was_dragged = true;
        gameObject.x = dragX;
        gameObject.y = dragY;
    });
   
    game.input.on('dragend', function (pointer, gameObject, dragX, dragY, dropped) {
        if(gameObject.name == 'scroll')
        {
            ;
        }
           
        else
        {
            gameObject.x = originalx;
            gameObject.y = originaly;
        }
    });

    game.input.on('gameobjectup', function(pointer, gameObject) {
        var checkIfDir = path + '\\' + gameObject.name;
       
        var stats = fs.statSync(checkIfDir);

        if(was_dragged == false && stats.isDirectory() == true)
        {
            if(gameObject.name != '')
            {       
                sprites.clear(true, true);
                labels.clear(true, true);

                path += "\\" + gameObject.name;

                var text2 = ",";
               
                moveArr.length = 0;
               
                var tempArr = path.split('\\');

                tempArr.pop();

                var temp = tempArr.join('\\');

                moveArr.push(temp);


                fs.readdir(path, function(err, items) {

                    for (var i=0; i<items.length; i++) {
                        text2 += items[i] + ",";

                        var moveCheck = path + '\\' + items[i];

                        var stats = fs.statSync(moveCheck);

                        if(stats.isDirectory() == true)
                        {
                            moveArr.push(moveCheck);
                        }
                    }  
                    
                    allfiles = text2.split(',');

                    width = 50;
                    height = 50;

                    generateSprites(game, allfiles, path, sprites, labels, style, scrollSprite);

                });    
            }
           
            //Creates a new file if the Pokemon Egg was clicked
            else if(gameObject.name == '' && gameObject.x == 1320 && gameObject.y == 165)
            {
                path2 = path;
                game2 = game;
                sprites2 = sprites;
                labels2 = labels;
                              
                createFile1();
            }
            
            //Creates a new directory if the PokeMart was clicked
            else if(gameObject.name == '' && gameObject.x == 1320 && gameObject.y == 270)
            {
                path2 = path;
                game2 = game;
                sprites2 = sprites;
                labels2 = labels;
               
                createDir1();
            }
           
            //Pastes file if Shiny Ditto was clicked
            else if(gameObject.name == '' && fileCopied != '' && gameObject.x == 1330 && gameObject.y == 658)
            {
                var goalPath = path + '\\' + objectCopied;
               
                copyFile(game, path, sprites, labels, fileCopied, goalPath);
            }
           
            //Gives user music options if Meloetta was clicked
            else if(gameObject.name == '' && gameObject.x == 62 && gameObject.y == 45)
            {
                changeMusic();
            }
            
            //If object clicked is a directory, it will open the directory
            else if(gameObject.name == '')
            {
                sprites.clear(true, true);
                labels.clear(true, true);

                var pathArr = path.split("\\");

                pathArr.pop();

                path = pathArr.join("\\");


                var text2 = ",";
               
                moveArr.length = 0;

                var tempArr = path.split('\\');

                tempArr.pop();

                var temp = tempArr.join('\\');

                moveArr.push(temp);


                fs.readdir(path, function(err, items) {

                    for (var i=0; i<items.length; i++) {
                        text2 += items[i] + ",";

                        var moveCheck = path + '\\' + items[i];

                        var stats = fs.statSync(moveCheck);

                        if(stats.isDirectory() == true)
                        {
                            moveArr.push(moveCheck);
                        }
                    }  
                    
                    allfiles = text2.split(',');

                    width = 50;
                    height = 50;

					generateSprites(game, allfiles, path, sprites, labels, style, scrollSprite);

                    });           
                }
            }
       
        else
            was_dragged = false;
    });
 
    var statText = game.add.text(3, 150, '', style1);
    
    statText.setScrollFactor(0);

    //When you hover over a directory or file, you will see file information about it in the left column
    game.input.on('gameobjectover', function(pointer, gameObject) {
        if(gameObject.name != '')
        {
            var pathname = path + "\\" + gameObject.name;

            var stats = fs.statSync(pathname);
            
            if(stats.isDirectory() == true)
            {
                statText.text = "--DIRECTORY INFORMATION--\n\n\nCreation Time: " + stats.birthtime + "\n\n\n\n\n\nModification Time: " + stats.mtime + "\n\n\n\n\n\nAbsolute Path: " + path;
            }
            
            else
            {
                statText.text = "--FILE INFORMATION--\n\nFile Size: " + stats.size + " bytes\n\nCreation Time: " + stats.birthtime + "\n\n\n\n\n\nModification Time: " + stats.mtime + "\n\n\n\n\n\nAbsolute Path: " + path;
            }
        }
    });

    //When you're not hovered over a directory or file, no file information will be displayed
    game.input.on('gameobjectout', function(pointer, gameObject) {
        statText.text = '';
    });
   
    //Hitting backspace will allow you to go to the previous directory without needing to click on Dialga
    game.input.keyboard.on('keydown_BACKSPACE', function (event) {
        if(backspace == true)
        {
            sprites.clear(true, true);
            labels.clear(true, true);

            var pathArr = path.split("\\");

            pathArr.pop();

            path = pathArr.join("\\");


            var text2 = ",";

            moveArr.length = 0;

            var tempArr = path.split('\\');

            tempArr.pop();

            var temp = tempArr.join('\\');

            moveArr.push(temp);

            fs.readdir(path, function(err, items) {

                for (var i=0; i<items.length; i++) {
                    text2 += items[i] + ",";

                    var moveCheck = path + '\\' + items[i];

                    var stats = fs.statSync(moveCheck);

                    if(stats.isDirectory() == true)
                    {
                        moveArr.push(moveCheck);
                    }
                }  
                allfiles = text2.split(',');

                width = 50;
                height = 50;

                generateSprites(game, allfiles, path, sprites, labels, style, scrollSprite);            

            });
        }
    });
}

//Creates a new empty file
function createEmptyFile(game, path, sprites, labels, updatedPath, scrollSprite)
{     
    fs.closeSync(fs.openSync(updatedPath, 'w'));
   
    sprites.clear(true, true);
    labels.clear(true, true);
   
    var sprite1;
    var allfiles;
    var i;
    var style = {fontSize: '12px', fill: 'white', align: "center", backgroundColor: 'grey', wordWrap:{width: 100, useAdvancedWrap: true}};
   
    var text2 = ",";
   
    moveArr.length = 0;

   
    var tempArr = path.split('\\');
               
    tempArr.pop();
   
    var temp = tempArr.join('\\');
   
    moveArr.push(temp);


    fs.readdir(path, function(err, items) {

        for (var i=0; i<items.length; i++) {
            text2 += items[i] + ",";

            var moveCheck = path + '\\' + items[i];

            var stats = fs.statSync(moveCheck);

            if(stats.isDirectory() == true)
            {
                moveArr.push(moveCheck);
            }
        }  

        allfiles = text2.split(',');

		generateSprites(game, allfiles, path, sprites, labels, style, scrollSprite);

    }); 
   
    document.getElementById('inputBox').innerHTML='';
    backspace = true;
}

//Deletes the file you dragged to Giratina
function deleteFile(game, path, sprites, labels, updatedPath, scrollSprite)
{   
    fs.unlinkSync(updatedPath, function (err) {
        if (err) alert(err);
    });
   
    sprites.clear(true);
    labels.clear(true);
   
    var sprite1;
    var allfiles;
    var i;
    var style = {fontSize: '12px', fill: 'white', align: "center", backgroundColor: 'grey', wordWrap:{width: 100, useAdvancedWrap: true}};
   
    var text2 = ",";

    fs.readdir(path, function(err, items) {

        for (var i=0; i<items.length; i++) {
            text2 += items[i] + ",";
        }  

    allfiles = text2.split(',');
        
	generateSprites(game, allfiles, path, sprites, labels, style, scrollSprite);
	       
    });
 
}

//Creates a new directory
function createDir(game, path, sprites, labels, updatedPath, scrollSprite)
{
    fs.mkdirSync(updatedPath, function (err) {
        if (err) alert(err);
    }); 
      
    sprites.clear(true);
    labels.clear(true);
   
    var sprite1;
    var allfiles;
    var i;
    var style = {fontSize: '12px', fill: 'white', align: "center", backgroundColor: 'grey', wordWrap:{width: 100, useAdvancedWrap: true}};
   
    var text2 = ",";
   
    moveArr.length = 0;

    var tempArr = path.split('\\');
               
    tempArr.pop();
   
    var temp = tempArr.join('\\');
   
    moveArr.push(temp);


    fs.readdir(path, function(err, items) {

        for (var i=0; i<items.length; i++) {
            text2 += items[i] + ",";

            var moveCheck = path + '\\' + items[i];

            var stats = fs.statSync(moveCheck);

            if(stats.isDirectory() == true)
            {
                moveArr.push(moveCheck);
            }
        }  

    allfiles = text2.split(',');

	generateSprites(game, allfiles, path, sprites, labels, style, scrollSprite);
	       
    });
   
    document.getElementById('inputBox').innerHTML='';
    backspace = true;
}

//Removes the directory you dragged to Giratina
function removeDir(game, path, sprites, labels, updatedPath, scrollSprite)
{       
    rimraf.sync(updatedPath);
      
    sprites.clear(true);
    labels.clear(true);
   
    var sprite1;
    var allfiles;
    var i;
    var style = {fontSize: '12px', fill: 'white', align: "center", backgroundColor: 'grey', wordWrap:{width: 100, useAdvancedWrap: true}};
   
    var text2 = ",";
   
    moveArr.length = 0;

    var tempArr = path.split('\\');

    tempArr.pop();

    var temp = tempArr.join('\\');

    moveArr.push(temp);

    fs.readdir(path, function(err, items) {

        for (var i=0; i<items.length; i++) {
            text2 += items[i] + ",";

            var moveCheck = path + '\\' + items[i];

            var stats = fs.statSync(moveCheck);

            if(stats.isDirectory() == true)
            {
                moveArr.push(moveCheck);
            }
        }  

    allfiles = text2.split(',');

    generateSprites(game, allfiles, path, sprites, labels, style, scrollSprite);   
    
    });
}

//Copies and pastes the file you dragged to Ditto once you click on the Shiny Ditto
function copyFile(game, path, sprites, labels, currPath, destPath, scrollSprite)
{   
    fs.copyFileSync(currPath, destPath, (err) => {
      if (err) alert(err);
    });
   
    setTimeout(function(){
        sprites.clear(true);
        labels.clear(true);

        var sprite1;
        var allfiles;
        var i;
        var style = {fontSize: '12px', fill: 'white', align: "center", backgroundColor: 'grey', wordWrap:{width: 100, useAdvancedWrap: true}};

        var text2 = ",";
       
        moveArr.length = 0;

        var tempArr = path.split('\\');

        tempArr.pop();

        var temp = tempArr.join('\\');

        moveArr.push(temp);

        fs.readdir(path, function(err, items) {

            for (var i=0; i<items.length; i++) {
                text2 += items[i] + ",";

                var moveCheck = path + '\\' + items[i];

                var stats = fs.statSync(moveCheck);

                if(stats.isDirectory() == true)
                {
                    moveArr.push(moveCheck);
                }
            }  

            allfiles = text2.split(',');

            generateSprites(game, allfiles, path, sprites, labels, style, scrollSprite);
        });
    }, 100);
}

//Moves the file you dragged to Cresselia
function moveFile(game, path, sprites, labels, currPath, destPath, scrollSprite)
{  
    mv(currPath, destPath, function(err) {
        if(err) alert(err);
    });
       
    sprites.clear(true);
    labels.clear(true);
    
    alert("Successfully moved!");
   
    var sprite1;
    var allfiles;
    var i;
    var style = {fontSize: '12px', fill: 'white', align: "center", backgroundColor: 'grey', wordWrap:{width: 100, useAdvancedWrap: true}};
   
    var text2 = ",";
   
    moveArr.length = 0;

    var tempArr = path.split('\\');
               
    tempArr.pop();
   
    var temp = tempArr.join('\\');
   
    moveArr.push(temp);

    fs.readdir(path, function(err, items) {

        for (var i=0; i<items.length; i++) {
            text2 += items[i] + ",";

            var moveCheck = path + '\\' + items[i];

            var stats = fs.statSync(moveCheck);

            if(stats.isDirectory() == true)
            {
                moveArr.push(moveCheck);
            }
        }  

        allfiles = text2.split(',');
        
        generateSprites(game, allfiles, path, sprites, labels, style, scrollSprite);     

    });
    
    document.getElementById('dropdown1').innerHTML='';
}

//Prompts the user for what they would like to name the new file
function createFile1() {
    backspace = false;
    var userInput = document.createElement("INPUT");
    userInput.type='text';
    userInput.id="filename";
    userInput.value="";
    document.getElementById('inputBox').appendChild(userInput);

    var span = document.createElement('span');
 
    span.innerHTML = "<button id='button'" + "onclick='" + "createFile2()'" + ">Submit</button>";

    var span2 = document.createElement('span');
 
    span2.innerHTML = "<button id='button'" + "onclick='" + "cancel2()'" + ">Cancel</button>";
   
    document.getElementById('inputBox').appendChild(span);
   
    document.getElementById('inputBox').appendChild(span2);
   
    document.getElementById('filename').focus();
}

//Sends the user's input to the createEmptyFile function
function createFile2(){   
    var temp;
   
    temp = path2 + '\\' + document.getElementById('filename').value;
      
    createEmptyFile(game2, path2, sprites2, labels2, temp);
}

//Prompts the user for what they would like to name the new directory
function createDir1() {
    backspace = false;
   
    var userInput = document.createElement("INPUT");
    userInput.type='text';
    userInput.id="filename";
    userInput.value="";
    document.getElementById('inputBox').appendChild(userInput);

    var span = document.createElement('span');
 
    span.innerHTML = "<button id='button'" + "onclick='" + "createDir2()'" + ">Submit</button>";

    var span2 = document.createElement('span');
 
    span2.innerHTML = "<button id='button'" + "onclick='" + "cancel2()'" + ">Cancel</button>";
   
    document.getElementById('inputBox').appendChild(span);
   
    document.getElementById('inputBox').appendChild(span2);
   
    document.getElementById('filename').focus();
}

//Sends the user's input to the createDir function
function createDir2(){   
    var temp;
   
    temp = path2 + '\\' + document.getElementById('filename').value;
   
    createDir(game2, path2, sprites2, labels2, temp);
}

//Gives user a dropdown for which directory they would like to move their file to
function move() {
    var dropdown = document.createElement("SELECT");
    dropdown.id='dropdown';
   
    var options = '';
   
    for(var i = 0; i < moveArr.length; i++)
    {
        options += "<option value='"+moveArr[i]+"'>" + moveArr[i] + "</option>";
    }
   
    dropdown.innerHTML=options;
    document.getElementById('dropdown1').appendChild(dropdown);
   
    var span = document.createElement('span');
 
    span.innerHTML = "<button id='button'" + "onclick='" + "move2()'" + ">Submit</button>";
   
    var span2 = document.createElement('span');
 
    span2.innerHTML = "<button id='button'" + "onclick='" + "cancel()'" + ">Cancel</button>";
   
    document.getElementById('dropdown1').appendChild(span);
   
    document.getElementById('dropdown1').appendChild(span2);
   
    document.getElementById('dropdown').focus();

}

//Sends the user's selection to the moveFile function
function move2() {
    var temp = document.getElementById('dropdown').value + '\\' + objectCopied2;
      
    moveFile(game2, path2, sprites2, labels2, copiedPath, temp);
}

//Creates a cancel button for the dropdown
function cancel()
{
    document.getElementById('dropdown1').innerHTML='';
}

//Creates a cancel button for the input boxes
function cancel2()
{
    document.getElementById('inputBox').innerHTML='';
}

//Gives user a dropdown for which song they would like to have play
function changeMusic() {

    var dropdown = document.createElement("SELECT");
    dropdown.id='dropdown';
   
    var options = '';
      
    for(var i = 0; i < moveArr.length; i++)
    {
        options += "<option value='"+moveArr[i]+"'>" + moveArr[i] + "</option>";
    }
   
    options = "<option value='tune'>Pokemon Center OST</option>"
    options += "<option value='tune2'>Road to Viridian City OST</option>"
    options += "<option value='tune3'>PokeMart OST</option>"
    options += "<option value='tune4'>Route 104 OST</option>"
    options += "<option value='stop'>No Music</option>"

    dropdown.innerHTML=options;
    document.getElementById('dropdown1').appendChild(dropdown);
   
    var span = document.createElement('span');
 
    span.innerHTML = "<button id='button'" + "onclick='" + "changeMusic2()'" + ">Submit</button>";
   
    var span2 = document.createElement('span');
 
    span2.innerHTML = "<button id='button'" + "onclick='" + "cancel()'" + ">Cancel</button>";
   
    document.getElementById('dropdown1').appendChild(span);
   
    document.getElementById('dropdown1').appendChild(span2);
   
    document.getElementById('dropdown').focus();

}

//Takes the user's selection and plays/stops the music
function changeMusic2() {
   
    var selected = document.getElementById('dropdown').value;
           
    if(selected == 'stop' && musicCount > 0)
    {
       
        music.stop();
    }
   
    else if(musicCount > 0)
    {
        music.stop();
               
        music = game.sound.add(selected, {
            mute: false,
            volume: 1,
            rate: 1,
            detune: 0,
            seek: 0,
            loop: true,
            delay: 0
        });
       
        music.play(config);
       
    }
   
    else if(musicCount == 0 && selected != 'stop')
    {
        music = game.sound.add(selected, {
            mute: false,
            volume: 1,
            rate: 1,
            detune: 0,
            seek: 0,
            loop: true,
            delay: 0
        });
       
        music.play(config);
        musicCount++;

    }
   
    document.getElementById('dropdown1').innerHTML='';

}

//Regenerates the sprites whenever there's a change to the files/directories in the current directory
function generateSprites(game, allfiles, path, sprites, labels, style, scrollSprite){    
    var i;
    
    var width = 220;
    var height = 50;
    
    var count = 0;
    
	for(i = 1; i < allfiles.length - 1; i++)
    {
        var assignSprite = path + '\\' + allfiles[i];
       
        var stats = fs.statSync(assignSprite);

        if(stats.isDirectory() == true)
        {
            assignSprite = 'pokeball';
        }
          
        else
        {
          
            var ext = assignSprite.split('.').pop()

            if(ext == 'docx' || ext == 'doc')
                assignSprite = 'vaporeon';
           
            else if(ext == 'pdf')
                assignSprite = 'umbreon'; 
            
            else if(ext == 'csv' || ext == 'xlsx')
                assignSprite = 'leafeon';
                   
            else if(ext == 'ppt' || ext == 'pptx')
                assignSprite = 'flareon';
           
            else if(ext == 'txt')
                assignSprite = 'eevee';
           
            else if(ext == 'mp3')
                assignSprite = 'glaceon'; 
            
            else if(ext == 'mp4')
                assignSprite = 'espeon'; 
           
            else
                assignSprite = 'star';
        }
           
        var sprite1 = game.add.sprite(width, height, assignSprite).setName(allfiles[i]);
		
        sprite1.setInteractive({
            draggable: true,
        });
       
        sprites.add(sprite1);

        labels.create(width - 40, height + 30, allfiles[i], style);

        if(count == 2)
        {
            width += 320;  
        }
           
        else
        {
            width += 150;
        }
           
        count++;
           
        if(i%6 == 0)
        {
            width = 220;
            height += 100;
            count = 0;
        }
    }
    
    if(height < 800)
    {
        game.cameras.main.setBounds(0, 0,  1389, 1000);
    }

    else
    {
        game.cameras.main.setBounds(0, 0,  1389, height + 200);
    }
    
    scrollSprite.y = 50;
}