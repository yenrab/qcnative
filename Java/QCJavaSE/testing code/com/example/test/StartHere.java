/*
 * This testing code uses the ControleObjects from the Android testing code directory.
 */

package com.example.test;

import java.util.HashMap;

import org.quickconnectfamily.QuickConnect;


public class StartHere {
	
	static{
		//QuickConnect.mapCommandToValCO("hello", Tester.class);

		QuickConnect.mapCommandToValCO("hello", StuffValCO.class);
		QuickConnect.mapCommandToDCO("hello", AsyncDCO.class);
		QuickConnect.mapCommandToDCO("hello", StuffDCO.class);
		QuickConnect.mapCommandToVCO("hello", StuffVCO.class);
		
		QuickConnect.mapCommandToECO("missing", StuffECO.class);
		
	}
	public static void main(String[] args) {
		System.out.println("Main thread: "+Thread.currentThread().getId());
        
		HashMap<Object,Object> parameters = new HashMap<Object,Object>();
        Thing aThing = new Thing();
        parameters.put("stuff", aThing);
        parameters.put("num", 3.5);
        aThing = null;
        QuickConnect.handleRequest("hello", parameters);
/*
        String[] commands = {"hello","hello"};
        QuickConnect.handleRequest(commands, parameters, true, new TestCallback());
        QuickConnect.handleRequest(commands, parameters, true, new TestCallback());

        TestCallback theCallback = new TestCallback();
        CommandDescriptor[] theDescriptors = {new CommandDescriptor("hello",parameters,theCallback, false)
        									 ,new CommandDescriptor("hello",parameters,theCallback, false)};
        QuickConnect.handleBatchRequest(theDescriptors);
*/
        System.gc();
        System.out.println("leaving scope.");
	}

}
