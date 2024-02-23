'use strict'

if (Java.available) {
    Java.perform(function () {
        try {
            var c_class = Java.use("sg.vantagepoint.a.c");
            c_class.a.implementation = function () {
                console.log('root detection method a() is called');
                return false;
            }

            c_class.b.implementation = function () {
                console.log('root detection method b() is called');
                return false;
            };

            c_class.c.implementation = function () {
                console.log('root detection method c() is called');
                return false;
            };

            var b_class = Java.use("sg.vantagepoint.a.b");
            b_class.a.implementation = function (context) {
                console.log('debug detection method a() is called');
                return false;
            };
        }
        catch (error) {
            console.log("[-] An exception occured.");
            console.log(string(error.stack));
        }
    });

    Java.perform(function() {
		console.log("[+] Hooking sg.vantagepoint.a.a");
		var aClass = Java.use("sg.vantagepoint.a.a");
		aClass.a.implementation = function(arg1, arg2) {
			var retval = this.a(arg1, arg2);
			var flag = "";

			for(var i = 0; i < retval.length; i ++) {
				flag += String.fromCharCode(retval[i]);
			}

			console.log(flag);
			return retval;
		}
    });
}

else {
    console.log("[-] Java is not available");
}