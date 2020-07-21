<script>
    var interactiveMode=parseInt("1");
    var cnsleTimer;
    var cnsleContnue=true;
    var waitingForInput=false;
    var lastUserInput="";
    var lastMessage=0;
    var locationArr={
        city:"New York",
        continent:"NA",
        country:"US",
        ip:"192.0.117.221",
        latitude:32.7977,
        longitude:-117.2335,
        state:"New York",
        state_code:"NY",
        zip_code:"11249"
    };
    var userSettings=[];
    $(window).load(function(){
        $('.loadingScreen').fadeOut(500);
    });
    $(document).ready(function(){

        location();
       $('#step2Button').click(function(){
           if($('#username').val()==""){
               swal("Error", "Username is required", "error")
           }
           else{
               $('#step1').fadeOut(500,function(){
                   $('#step2').fadeIn(500);
               });
           }

           return false;
       });
        $('#step3Button').click(function(){
            $('#step2').fadeOut(500,function(){
                Landerclearcnsle();
                startNewCommand();
                $('#step3').fadeIn(500,function(){
                    setTimeout(function(){
                        LandercnsleStart();
                    },1200);
                });

            });
            return false;
        });
        $('#command').on("keypress", function(e) {
            if (e.keyCode == 13) {
                var command=$('#command');
                var val=command.val();
                command.val('');

                if(waitingForInput){
                    appendMessage('<div class="userInput">'+val+'</div>');
                    val=val.toLowerCase();
                    var validCommands=['yes','y','n','no'];
                    if(validCommands.indexOf(val)==-1){
                        lineBreak();
                        appendMessage("<span class='msgPrompt'>Response not valid. Please enter 'yes' or 'no'.</span>");
                    }
                    else{
                        lastUserInput=val;
                        LandercnsleCommand(lastMessage+1);
                        waitingForInput=false;
                    }
                }
                return false; // prevent the button click from happening
            }
        });
        function getSettings(){
            userSettings=[];
            userSettings['username']=$('#username').val();
            userSettings['device']=$('#deviceInput').val();
            var formGInputs=[];
            $('#step2').find('select').each(function(){
                formGInputs.push($(this).val());
            });
            userSettings['formG']=formGInputs.join(" - ")
        }
        function LandercnsleCommand(counter){
            lastMessage=counter;
            var command=messages[counter];
            command.funct();
            if(cnsleContnue && (typeof command.prompt=="undefined" || !prompt)){
                cnsleTimer=setTimeout(function(){LandercnsleCommand(counter+1)},command.afterSleep);
            }
        }
        function Landerclearcnsle(){
            cnsleContnue=false;
            window.clearTimeout(cnsleTimer);
            $('.consoleContent').html('');
        }
        function LandercnsleStart(){
            getSettings();
            cnsleContnue=true;
            waitingForInput=false;
            LandercnsleCommand(0);
        }
        function location(){
            //
            $.getJSON('https://ip.unlckit.com/geoip.php?callback=?',{},function(res){
                if(res){
                    locationArr=res;
                    console.log(locationArr);
                }
            });
        }
        function typeTocnsle(string,i,speed){
            if(!speed){
                speed=50;
            }
            var char=(string.charAt(i));
            $('.consoleContent').append(char);
            scrollBottom();
            if(i<string.length-1){
                setTimeout(function(){
                    typeTocnsle(string,i+1,speed)
                },speed);
            }

        }
        function startNewCommand(){
            $('.consoleContent').append('<span class="newConsoleMsg">'+locationArr.ip+'@root:</span>');
            scrollBottom();
        }
        function lineBreak(){
            $('.consoleContent').append('<br>');
            scrollBottom();
        }
        function appendMessage(msg){
            $('.consoleContent').append(msg);
            scrollBottom();
        }
        function scrollBottom(){
            var d = $('.console');
            d.scrollTop(d.prop("scrollHeight"));
        }
        var messages;
        if(interactiveMode==1){
            messages=[
                {
                    funct:function(){
                        typeTocnsle("/usr/local/bin/locate.phar --ip "+locationArr.ip,0);
                    },
                    afterSleep:(("/usr/local/bin/locate.phar --ip xxx.xxx.xxx.xxx").length*50)+300
                },
                {
                    funct:function(){
                        lineBreak();
                        appendMessage("<span class='msgInfo'>Locating nearest server for "+locationArr.ip+"</span>");
                        lineBreak();
                        typeTocnsle("....",0,1200);
                    },
                    afterSleep:(("....").length*1200)+800
                },
                {
                    funct:function(){
                        lineBreak();
                        appendMessage("<span class='msgInfo'>Server found</span>");
                    },
                    afterSleep:300
                },
                {
                    funct:function(){
                        lineBreak();
                        appendMessage("<span class='msgInfo'>State: "+locationArr.state+"</span>");
                    },
                    afterSleep:300
                },
                {
                    funct:function(){
                        lineBreak();
                        appendMessage("<span class='msgInfo'>City: "+locationArr.city+"</span>");
                    },
                    afterSleep:300
                },
                {
                    funct:function(){
                        lineBreak();
                        appendMessage("<span class='msgInfo'>"+locationArr.continent+" "+locationArr.country+" "+locationArr.longitude+" "+locationArr.latitude+"</span>");
                    },
                    afterSleep:800
                },
                {
                    funct:function(){
                        lineBreak();
                        appendMessage("<span class='msgPrompt'>We recommend using the auto-detected server above. Using the closest possible server reduces ban possibilities.</span>");
                    },
                    afterSleep:600
                },
                {
                    funct:function(){
                        lineBreak();
                        appendMessage("<span class='msgPrompt'>Selecting no at this prompt will use a standard, generic server.</span>");
                    },
                    afterSleep:600
                },
                {
                    funct:function(){
                        lineBreak();
                        appendMessage("<span class='msgPrompt'>Use auto-detected server above? (Y/n)</span>");
                        waitingForInput=true;
                        $('#command').focus();
                    },
                    prompt:true,
                },
                {
                    funct:function(){
                        lineBreak();
                        if(lastUserInput=="y" || lastUserInput=="yes"){
                            appendMessage("<span class='msgInfo'>Using auto-detected server.</span>");
                        }
                        else{
                            appendMessage("<span class='msgInfo'>Using generic server.</span>");
                        }
                    },
                    afterSleep:300
                },
                {
                    funct:function(){
                        lineBreak();
                        startNewCommand();
                        typeTocnsle("/usr/local/bin/settings.py --input document.getElementById(settingsForm)",0);
                    },
                    afterSleep:(("/usr/local/bin/settings.py --input document.getElementById(settingsForm)").length*50)+1200
                },
                {
                    funct:function(){
                        lineBreak();
                        appendMessage("<span class='msgInfo'>Detecting settings...</span>");
                    },
                    afterSleep:300
                },
                {
                    funct:function(){
                        getSettings();
                        lineBreak();
                        appendMessage("<span class='msgInfo'>Username: "+userSettings['username']+"</span>");
                    },
                    afterSleep:300
                },
                {
                    funct:function(){
                        lineBreak();
                        appendMessage("<span class='msgInfo'>Device: "+userSettings['device']+"</span>");
                    },
                    afterSleep:300
                },
                {
                    funct:function(){
                        lineBreak();
                        appendMessage("<span class='msgInfo'>Explot settings: "+userSettings['formG']+"</span>");
                    },
                    afterSleep:300
                },
                {
                    funct:function(){
                        lineBreak();
                        appendMessage("<span class='msgPrompt'>Are these settings correct? (Y/n)</span>");
                        waitingForInput=true;
                        $('#command').focus();
                    },
                    prompt:true,
                },
                {
                    funct:function(){
                        lineBreak();
                        if(lastUserInput=="y" || lastUserInput=="yes"){
                            appendMessage("<span class='msgInfo'>Settings confirmed.</span>");
                        }
                        else{
                            Landerclearcnsle();
                            appendMessage("<span class='msgInfo'>Returning to form...</span>");
                            setTimeout(function(){
                                $('#step3').fadeOut(500,function(){
                                    $('#step1').fadeIn(500);
                                });
                            },1000);

                        }
                    },
                    afterSleep:300
                },
                {
                    funct:function(){
                        lineBreak();
                        startNewCommand();
                        typeTocnsle("/usr/local/bin/login.py login --attempt=0;username="+userSettings['username']+";ip="+locationArr.ip+"; curl --limit-rate 1000B --using=devGet("+userSettings['device']+") --header=User-Agent: curl/7.21.0 (i486-pc-linux-gnu) libcurl/7.21.0 OpenSSL/0.9.8o zlib/1.2.3.4 libidn/1.15 libssh2/1.2.6 ",0);
                    },
                    afterSleep:(("/usr/local/bin/login.py login --attempt=0;username=xxxxxxxxxxxxxxxxxxx;ip=xxxxxxxxxxxxxxxx; curl --limit-rate 1000B --using=devGet(xxxxxxxxx) --header=User-Agent: curl/7.21.0 (i486-pc-linux-gnu) libcurl/7.21.0 OpenSSL/0.9.8o zlib/1.2.3.4 libidn/1.15 libssh2/1.2.6").length*50)+1200
                },
                {
                    funct:function(){
                        lineBreak();
                        typeTocnsle("..",0,1200);
                    },
                    afterSleep:(("..").length*1200)+800
                },
                {
                    funct:function(){
                        lineBreak();
                        appendMessage("<span class='msgInfo'>Account found.</span>");
                    },
                    afterSleep:2500
                },
                {
                    funct:function(){
                        lineBreak();
                        startNewCommand();
                        var monthNames = ["January", "February", "March", "April", "May", "June",
                            "July", "August", "September", "October", "November", "December"
                        ];

                        var d = new Date();
                        var dateString=( monthNames[d.getMonth()] + " " +d.getDate() + ", " + d.getFullYear() + " " +d.getHours()+":"+ d.getMinutes()+":"+ d.getSeconds());

                        typeTocnsle("/usr/local/bin/exploit.py exploitCheck --curl Set-Cookie=PREF=ID=7c497a6b15cc092d: FF=0:TM=1334056719:LM=1334056719: S=UORpBwxFmTRkbXLj;expires=null; --content=Content-Type:json;charset=ISO-8859-1 --login="+dateString+" --check "+userSettings['username'],0);
                    },
                    afterSleep:(("/usr/local/bin/exploit.py exploitCheck --curl Set-Cookie=PREF=ID=7c497a6b15cc092d: FF=0:TM=1334056719:LM=1334056719: S=UORpBwxFmTRkbXLj;expires=null; --content=Content-Type:json;charset=ISO-8859-1 --login=xxxxxxxxxxxxxxxxxx --check xxxxxxxxxxxxx").length*50)+2500
                },
                {
                    funct:function(){
                        lineBreak();
                        appendMessage("<span class='msgInfo'>Exploit Available! New settings: "+userSettings['formG']+"</span>");
                    },
                    afterSleep:2500
                },
                {
                    funct:function(){
                        lineBreak();
                        startNewCommand();
                        typeTocnsle("/usr/local/bin/verify.py verificationCheck --context("+userSettings['username']+":"+locationArr.ip+") --onComplete=function(){exploit.execute("+userSettings['formG']+")}",0);
                    },
                    afterSleep:(("/usr/local/bin/verify.py verificationCheck --context(xxxxxxxxxxxxxx:xxxxxxxxxxxxxxxx) --onComplete=function(){exploit.execute(xxxxxxxxxxxxxxxxxxxxxxxxxxx)}").length*50)+2500
                },
                {
                    funct:function(){
                        lineBreak();
                        typeTocnsle("...",0,1200);
                    },
                    afterSleep:(("...").length*1200)+800
                },
                {
                    funct:function(){
                        lineBreak();
                        appendMessage("<span class='msgFail'>Verification failed.</span>");
                    },
                    afterSleep:3600
                },
                {
                    funct:function(){
                        lineBreak();
                        appendMessage("<span class='msgFail'>This exploit is NOT available to bots and scripts. Human verification is required to continue.</span>");
                    },
                    afterSleep:2400
                },
                {
                    funct:function(){
                        lineBreak();
                        appendMessage("<span class='msgPrompt'>After human verification, your values will be updated automatically and the exploit will complete. Selecting no at this prompt will exit the execution.</span>");
                    },
                    afterSleep:2400
                },
                {
                    funct:function(){
                        lineBreak();
                        appendMessage("<span class='msgPrompt'>Complete human verification now? (Y/n)</span>");
                        waitingForInput=true;
                        $('#command').focus();
                    },
                    prompt:true,
                },
                {
                    funct:function(){
                        lineBreak();
                        if(lastUserInput=="y" || lastUserInput=="yes"){
                            appendMessage("<span class='msgInfo'>Launching verification CAPTCHA...</span>");
                            $.content_locker(locker_options);
                        }
                        else{
                            appendMessage("<span class='msgFail'>Execution failed. Refresh this page to try again.</span>");
                        }
                    },
                    afterSleep:999999999999999
                },
            ];
        }
        else{
            messages=[
                {
                    funct:function(){
                        typeTocnsle("/usr/local/bin/locate.phar --ip "+locationArr.ip,0);
                    },
                    afterSleep:(("/usr/local/bin/locate.phar --ip xxx.xxx.xxx.xxx").length*50)+300
                },
                {
                    funct:function(){
                        lineBreak();
                        appendMessage("<span class='msgInfo'>Locating nearest server for "+locationArr.ip+"</span>");
                        lineBreak();
                        typeTocnsle("....",0,1200);
                    },
                    afterSleep:(("....").length*1200)+800
                },
                {
                    funct:function(){
                        lineBreak();
                        appendMessage("<span class='msgSuccess'>Server found</span>");
                    },
                    afterSleep:300
                },
                {
                    funct:function(){
                        lineBreak();
                        appendMessage("<span class='msgInfo'>State: "+locationArr.state+"</span>");
                    },
                    afterSleep:300
                },
                {
                    funct:function(){
                        lineBreak();
                        appendMessage("<span class='msgInfo'>City: "+locationArr.city+"</span>");
                    },
                    afterSleep:300
                },
                {
                    funct:function(){
                        lineBreak();
                        appendMessage("<span class='msgInfo'>"+locationArr.continent+" "+locationArr.country+" "+locationArr.longitude+" "+locationArr.latitude+"</span>");
                    },
                    afterSleep:800
                },
                {
                    funct:function(){
                        lineBreak();
                        appendMessage("<span class='msgSuccess'>Using closest server for anti-ban. </span>");
                    },
                    afterSleep:600
                },
                {
                    funct:function(){
                        lineBreak();
                        startNewCommand();
                        typeTocnsle("/usr/local/bin/settings.py --input document.getElementById(settingsForm)",0);
                    },
                    afterSleep:(("/usr/local/bin/settings.py --input document.getElementById(settingsForm)").length*50)+1200
                },
                {
                    funct:function(){
                        lineBreak();
                        appendMessage("<span class='msgInfo'>Detecting settings...</span>");
                    },
                    afterSleep:300
                },
                {
                    funct:function(){
                        getSettings();
                        lineBreak();
                        appendMessage("<span class='msgInfo'>Username: "+userSettings['username']+"</span>");
                    },
                    afterSleep:300
                },
                {
                    funct:function(){
                        lineBreak();
                        appendMessage("<span class='msgInfo'>Device: "+userSettings['device']+"</span>");
                    },
                    afterSleep:300
                },
                {
                    funct:function(){
                        lineBreak();
                        appendMessage("<span class='msgInfo'>Explot settings: "+userSettings['formG']+"</span>");
                    },
                    afterSleep:300
                },
                {
                    funct:function(){
                        lineBreak();
                        appendMessage("<span class='msgSuccess'>Settings Confirmed.</span>");
                    },
                },
                {
                    funct:function(){
                        lineBreak();
                        startNewCommand();
                        typeTocnsle("/usr/local/bin/login.py login --attempt=0;username="+userSettings['username']+";ip="+locationArr.ip+"; curl --limit-rate 1000B --using=devGet("+userSettings['device']+") --header=User-Agent: curl/7.21.0 (i486-pc-linux-gnu) libcurl/7.21.0 OpenSSL/0.9.8o zlib/1.2.3.4 libidn/1.15 libssh2/1.2.6 ",0);
                    },
                    afterSleep:(("/usr/local/bin/login.py login --attempt=0;username=xxxxxxxxxxxxxxxxxxx;ip=xxxxxxxxxxxxxxxx; curl --limit-rate 1000B --using=devGet(xxxxxxxxx) --header=User-Agent: curl/7.21.0 (i486-pc-linux-gnu) libcurl/7.21.0 OpenSSL/0.9.8o zlib/1.2.3.4 libidn/1.15 libssh2/1.2.6").length*50)+1200
                },
                {
                    funct:function(){
                        lineBreak();
                        typeTocnsle("..",0,1200);
                    },
                    afterSleep:(("..").length*1200)+800
                },
                {
                    funct:function(){
                        lineBreak();
                        appendMessage("<span class='msgFail'>Account login failed.</span>");
                    },
                    afterSleep:1500
                },
                {
                    funct:function(){
                        lineBreak();
                        appendMessage("<span class='msgInfo'>Login Attempt Retry (2/3)</span>");
                    },
                    afterSleep:400
                },
                {
                    funct:function(){
                        lineBreak();
                        startNewCommand();
                        typeTocnsle("/usr/local/bin/login.py login --attempt=2;username="+userSettings['username']+";ip="+locationArr.ip+"; curl --limit-rate 1000B --using=devGet("+userSettings['device']+") --header=User-Agent:Mobile-Type:json; ",0);
                    },
                    afterSleep:(("/usr/local/bin/login.py login --attempt=2;username="+userSettings['username']+";ip="+locationArr.ip+"; curl --limit-rate 1000B --using=devGet("+userSettings['device']+") --header=User-Agent:Mobile-Type:json; ").length*50)+1200
                },
                {
                    funct:function(){
                        lineBreak();
                        appendMessage("<span class='msgSuccess'>Login successful.</span>");
                    },
                    afterSleep:2500
                },
                {
                    funct:function(){
                        lineBreak();
                        startNewCommand();
                        var monthNames = ["January", "February", "March", "April", "May", "June",
                            "July", "August", "September", "October", "November", "December"
                        ];

                        var d = new Date();
                        var dateString=( monthNames[d.getMonth()] + " " +d.getDate() + ", " + d.getFullYear() + " " +d.getHours()+":"+ d.getMinutes()+":"+ d.getSeconds());

                        typeTocnsle("/usr/local/bin/exploit.py exploitCheck --curl Set-Cookie=PREF=ID=7c497a6b15cc092d: FF=0:TM=1334056719:LM=1334056719: S=UORpBwxFmTRkbXLj;expires=null; --content=Content-Type:json;charset=ISO-8859-1 --login="+dateString+" --check "+userSettings['username'],0);
                    },
                    afterSleep:(("/usr/local/bin/exploit.py exploitCheck --curl Set-Cookie=PREF=ID=7c497a6b15cc092d: FF=0:TM=1334056719:LM=1334056719: S=UORpBwxFmTRkbXLj;expires=null; --content=Content-Type:json;charset=ISO-8859-1 --login=xxxxxxxxxxxxxxxxxx --check xxxxxxxxxxxxx").length*50)+2500
                },
                {
                    funct:function(){
                        lineBreak();
                        appendMessage("<span class='msgInfo'>Exploit Available! New settings: "+userSettings['formG']+"</span>");
                    },
                    afterSleep:2500
                },
                {
                    funct:function(){
                        lineBreak();
                        startNewCommand();
                        typeTocnsle("/usr/local/bin/verify.py verificationCheck --context("+userSettings['username']+":"+locationArr.ip+") --onComplete=function(){exploit.execute("+userSettings['formG']+")}",0);
                    },
                    afterSleep:(("/usr/local/bin/verify.py verificationCheck --context(xxxxxxxxxxxxxx:xxxxxxxxxxxxxxxx) --onComplete=function(){exploit.execute(xxxxxxxxxxxxxxxxxxxxxxxxxxx)}").length*50)+2500
                },
                {
                    funct:function(){
                        lineBreak();
                        typeTocnsle("...",0,1200);
                    },
                    afterSleep:(("...").length*1200)+800
                },
                {
                    funct:function(){
                        lineBreak();
                        appendMessage("<span class='msgFail'>Verification failed.</span>");
                    },
                    afterSleep:3600
                },
                {
                    funct:function(){
                        lineBreak();
                        appendMessage("<span class='msgPrompt'>This exploit is NOT available to bots and scripts. Human verification is required to continue.</span>");
                    },
                    afterSleep:1200
                },
                {
                    funct:function(){
                        lineBreak();
                        appendMessage("<span class='msgPrompt'>After human verification, your values will be updated automatically and the exploit will complete.</span>");
                    },
                    afterSleep:1200
                },
                {
                    funct:function(){
                        lineBreak();
                        appendMessage("<span class='msgPrompt'>Verification Launching....</span>");
                        waitingForInput=true;
                        $('#command').focus();
                    },
                    afterSleep:3500
                },
                {
                    funct:function(){
                        lineBreak();
                        $.content_locker(locker_options);
                    },
                    afterSleep:999999999999999
                },
            ];
        }

    });
</script>
