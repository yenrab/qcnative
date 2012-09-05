package com.example.test;

import java.util.HashMap;

import org.quickconnectfamily.CommandDescriptor;
import org.quickconnectfamily.QuickConnect;


import android.os.Bundle;
import android.app.Activity;
import android.view.Menu;

public class MainActivity extends Activity {
	static{
		//QuickConnect.mapCommandToValCO("hello", Tester.class);

		QuickConnect.mapCommandToValCO("hello", StuffValCO.class);
		QuickConnect.mapCommandToDCO("hello", AsyncDCO.class);
		QuickConnect.mapCommandToDCO("hello", StuffDCO.class);
		QuickConnect.mapCommandToVCO("hello", StuffVCO.class);
		
		QuickConnect.mapCommandToECO("missing", StuffECO.class);
	}
    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        System.out.println("Main thread: "+Thread.currentThread().getId());
        
		HashMap<Object,Object> parameters = new HashMap<Object,Object>();
        Thing aThing = new Thing();
        parameters.put("stuff", aThing);
        parameters.put("num", 3.5);
        aThing = null;

        String[] commands = {"hello","hello"};
 /*       QuickConnect.handleRequest(commands, parameters, true, new TestCallback());
        QuickConnect.handleRequest(commands, parameters, true, new TestCallback());

        TestCallback theCallback = new TestCallback();
        CommandDescriptor[] theDescriptors = {new CommandDescriptor("hello",parameters,theCallback, true)
        									 ,new CommandDescriptor("hello",parameters,theCallback, true)};
        QuickConnect.handleBatchRequest(theDescriptors);
*/
        //QuickConnect.handleRequest("hello", parameters);
        QuickConnect.handleRequest("hello", parameters, true, new TestCallback());
        System.gc();
        System.out.println("leaving scope.");

    }

    @Override
    public boolean onCreateOptionsMenu(Menu menu) {
        getMenuInflater().inflate(R.menu.activity_main, menu);
        return true;
    }

    
}
