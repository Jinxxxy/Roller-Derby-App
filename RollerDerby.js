(function () {
    //'Global' variable declaration   
    var diagnosticsArray = [],
        diagnosticsArea = document.getElementById("diagnosticsArea"),
        statTable = document.getElementById("statTable"),
        status = document.getElementById("statusTable"),
		statusOn = false;
		//timerRunning = false;			
	
    function tableMethods(rowId) {
		//Declarations
        var inputValue = document.getElementById("name" + rowId).value;
        var addButton = document.getElementById("addPlayer" + rowId);
        var inputTable = document.getElementById("inputTable" + rowId);
        var outputTable = document.getElementById("switchingTable" + rowId);
        var dataArray = [];
        var playerObject = function () {
            this.id = dataArray.length + 1,
            this.name = document.getElementById("name" + rowId).value,
            this.subNumber = 0;
            this.binned = 0;
        };
        var tableParent = document.getElementById("tableParent" + rowId);
        
        var diagnosticButton = document.getElementById("diagnostics");
        var diagnosticsOutput = document.getElementById("diagOutput")
        var holdingTable = document.getElementById("holdingParent" + rowId);
       
        function inputData() {
            var player = new playerObject;
            dataArray.push(player);
            diagnosticsArray.push(player);
           
            var table = outputTable;
            var row = table.insertRow(table.rows.length);
            var cellID = row.insertCell(0);
            var cellName = row.insertCell(1);
            var switchButton = row.insertCell(2);
            var deleteButton = row.insertCell(3);

            cellID.innerHTML = player.id;
            cellName.innerHTML = player.name;
            switchButton.innerHTML = "<input type=\"button\" class=\"inputStyle\" value=\"SwitchPlayer\">";
            deleteButton.innerHTML = "<input type=\"button\" class=\"inputStyle\" id=\"deleteRow" + player.id + "\" value=\"Remove?\">";
            deleteButton.onclick = function () {
                var removeRow = this.parentNode;
                var rowNumber = this.parentNode.firstChild.innerHTML;                
                if (removeRow.parentNode.id === "tableParent" + rowId) {
                    mainTableRemove(removeRow, rowNumber, tableParent, holdingTable)
                    player.binned = player.binned + 1;                    
                } else if (removeRow.parentNode.id === "holdingParent" + rowId) {
                    
                    mainTableRemove(removeRow, rowNumber, holdingTable, tableParent);

                };
                return;
            }
            switchButton.onclick = function () {
                var rowNumber = this.parentNode.firstChild.innerHTML;
                var currentRow = this.parentNode;
                try{
                    tableParent.removeChild(currentRow);
                    tableParent.appendChild(currentRow);
                    player.subNumber = player.subNumber + 1;
                } catch (err) {
					//Set up status bar in view of user.
                    statusFade("Can't switch players in the bin! \n\n Bring them back into play before switching")
                }                
            }
        };
        function mainTableRemove(removeRow, rowNumber, sourceTable, targetTable) {
            sourceTable.removeChild(removeRow);
            targetTable.appendChild(removeRow)
        }
        addButton.onclick = function () {
            inputData();
        }
    } 
	function statusFade(stringVar){
		status.innerHTML = stringVar;
		status.style.margin = "0 auto";
		if(statusOn === true){
			return
		} else {
			var incVar = 1;
			status.style.display = "block";
			var fadeOut = setInterval(function(){
				statusOn = true;
				status.style.opacity = incVar;				
				incVar = incVar - 0.01;
				if(incVar <= 0){
					statusOn = false;
					status.innerHTML = "";
					status.style.display = "none";
					clearInterval(fadeOut);
				}
			}, 12.5)
		}
	}
    //Blockers - A
    tableMethods("A");
    //Blockers - B
    tableMethods("B");
    //Jammers - C
    tableMethods("C");
    function timerMain() {
        var startButton = document.getElementById("startTimer"),
            resetTimer = document.getElementById("resetTimer"),
            pauseTimer = document.getElementById("pauseTimer"),
            timeOutput = document.getElementById("timeOutput"),
            that,
            pauseMinutes,
            pauseSeconds;        
        startButton.onclick = function () {
			
            if (statTable.rows.length >= 1) {
                removeRows(statTable);
                statTable.style.display = "none";
            }
            if (timeOutput.innerHTML === "--:--:--" || timeOutput.innerHTML === "Time Over") {
                inputMinutes = document.getElementById("timerMinutes").value;
                inputSeconds = document.getElementById("timerSeconds").value
                if (inputSeconds > 59) {
                    statusFade("Seconds must be between 0 - 59");
                    return;
                } else if (inputMinutes === "" && inputSeconds !== "") {
                    inputMinutes = 0;   
                } else if (inputMinutes !== "" && inputSeconds === ""){
					inputSeconds = 0;
				}
				
                var timer = new timerFunction(inputMinutes, inputSeconds);
                that = timer;				
                
				
                if (inputMinutes === "" && inputSeconds === "") {
                    statusFade("Please complete both time boxes. ")
                } else {
                    timer.timerFunc();
					return;
                }
            } else {
                return;
            }
        }
        pauseTimer.onclick = function () {
				if (timeOutput.innerHTML === "Time Over") {
					
				} else if(timeOutput.innerHTML === "--:--:--"){
					statusFade("Start Timer First")
					return;
				} else {
					if (that.timerRunning === true) {
                    pauseMinutes = timer.minutes;
                    pauseSeconds = timer.seconds;
                    clearInterval(that.access)
                    that.timerRunning = false;
                    return;				
                }
                if (that.timerRunning === false) {
                    that.timerFunc(pauseMinutes, pauseSeconds)
                    that.timerRunning = true;
                    return;
                }
            }           
        }
        resetTimer.onclick = function () {			
            if (that.timerRunning === true) {
                statusFade("Please Pause The Timer First")
            } else if (that.timerRunning === false) {
                clearInterval(that.access);
                timeOutput.innerHTML = "--:--:--";
                that.minutes = undefined;
                that.seconds = undefined;
            }
        }
    }
	// X: Minutes, Y: Seconds, Z: Milliseconds    
    var timerFunction = function (x, y, z) {
		this.timerRunning = true
        if (y === undefined || x === undefined) {
            var time = x - 1;
            var secondsRem = y;
            this.minutes = time;
            this.seconds = secondsRem;
        } else {            
            var time = parseInt(x);
            var secondsRem = y;
            this.minutes = time;
            this.seconds = secondsRem;
        }
        this.access = "";
        that = this;
        this.timerFunc = function () {			
            that.access = setInterval(function () {				
                if (z === undefined) {
                    z = 0;
                }
                    if (z <= 0) {
                        if (parseFloat(y) === 0) {                            
                            if (parseFloat(x) === 0) {
								that.timerRunning = false;
                                document.getElementById("timeOutput").innerHTML = "Time Over";					
                                playerLoop();	
																
                                clearInterval(that.access);  
																
                                return;
                            } else {
                                x = x - 1;
                                y = 59;
                            }
                        } else {
                            y = y - 1;
                        }
                        z = 100;
                    }
                    z = z - 1;
                    builtString = x + ":" + y + ":" + z;
                    timeOutput.innerHTML = builtString
            }, 10);
        }       
    }
	
    
    timerMain();
    var jammerButton = document.getElementById("jammerButton"),
        blockerAbutton = document.getElementById("blockerAbutton"),
        blockerBbutton = document.getElementById("blockerBbutton"),
        jammerDiv = document.getElementById("jammersstyle"),
        blockerAdiv = document.getElementById("blockersAstyle"),
        blockerBdiv = document.getElementById("blockersBstyle");
    function buttonMethod(target, x) {
        var divArray = [jammerDiv, blockerAdiv, blockerBdiv];
        var buttonArray = [jammerButton, blockerAbutton, blockerBbutton];        
        x.style.backgroundColor = "deeppink";
        x.style.borderColor = "white";
        for (var elem in divArray) {            
            if (target === divArray[elem]){                
                divArray[elem].style.display = "block";                               
            } else {
                divArray[elem].style.display = "none";
                buttonArray[elem].style.backgroundColor = "white";
                buttonArray[elem].style.borderColor = "deeppink";
            }            
        }
    }
    jammerButton.onclick = function () {        
        buttonMethod(jammerDiv, jammerButton);
    }
    blockerAbutton.onclick = function () {        
        buttonMethod(blockerAdiv, blockerAbutton);
    }
    blockerBbutton.onclick = function () {        
        buttonMethod(blockerBdiv, blockerBbutton);
    }   
    function nameChange(source, targetOne, targetTwo) {
        var buttonString = source.value;
        targetOne.innerHTML = buttonString;
        targetTwo.innerHTML = buttonString;
    }
    //Input element declaration:
    var jammerChange = document.getElementById("jammernamechange"),
        blockerAchange = document.getElementById("blockerAnamechange"),
        blockerBchange = document.getElementById("blockerBnamechange"),
        innerJammerButton = document.getElementById("innerJammerButton"),
        innerBlockerAButton = document.getElementById("innerBlockerAButton"),
        innerBlockerBButton = document.getElementById("innerBlockerBButton");
    jammerChange.addEventListener("change", function () {
        nameChange(jammerChange, innerJammerButton, jammerButton);
    })
    blockerAchange.addEventListener("change", function () {
        nameChange(blockerAchange, innerBlockerAButton, blockerAbutton)
    })
    blockerBchange.addEventListener("change", function () {
        nameChange(blockerBchange, innerBlockerBButton, blockerBbutton);
    })
    //Diagnostics Output
    function outputEachPlayer(x,y) {        
        var nameCell = y.insertCell(0),
            subbedCell = y.insertCell(1),
            binnedCell = y.insertCell(2);
        nameCell.innerHTML = x["name"];
        subbedCell.innerHTML = x["subNumber"];
        binnedCell.innerHTML = x["binned"];
    }
    function playerLoop() {        
        for (var player in diagnosticsArray) {
            var rowToPass = statTable.insertRow(1);
            outputEachPlayer(diagnosticsArray[player], rowToPass);            
        }
        statTable.style.display = "block";
		return;
    }
    function removeRows(table) {
        while (table.rows.length > 1)
            table.deleteRow(table.rows.length);
    }
}())

// JavaScript source code
