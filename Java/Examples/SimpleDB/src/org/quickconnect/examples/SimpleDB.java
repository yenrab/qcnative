package org.quickconnect.examples;

import java.util.HashMap;

import org.quickconnect.QuickConnect;
import org.quickconnect.examples.R;
import org.quickconnect.examples.control.AddUserBCO;
import org.quickconnect.examples.control.BadNameECO;
import org.quickconnect.examples.control.DisplayHTTPGetResultsVCO;
import org.quickconnect.examples.control.DisplayUsersVCO;
import org.quickconnect.examples.control.GetUsersBCO;
import org.quickconnect.examples.control.HideKeyboardVCO;
import org.quickconnect.examples.control.NameValCO;
import org.quickconnect.examples.control.HttpGetRequestBCO;
import org.quickconnect.examples.control.UrlCheckValCO;

import android.app.Activity;
import android.os.Bundle;
import android.view.View;
import android.view.View.OnClickListener;
import android.widget.Button;
import android.widget.EditText;
import android.widget.TextView;

public class SimpleDB extends Activity {
	private TextView resultDisplay;
	private EditText nameInput;
	private EditText urlInput;
	
	static{
		//the stack for inserting a new name
		QuickConnect.mapCommandToValCO("insertName", NameValCO.class);
		QuickConnect.mapCommandToBCO("insertName", AddUserBCO.class);
		QuickConnect.mapCommandToBCO("insertName", GetUsersBCO.class);
		QuickConnect.mapCommandToVCO("insertName", HideKeyboardVCO.class);
		QuickConnect.mapCommandToVCO("insertName", DisplayUsersVCO.class);
		
		//the stack for listing all, some, or no users
		QuickConnect.mapCommandToValCO("listUsers", NameValCO.class);
		QuickConnect.mapCommandToBCO("listUsers", GetUsersBCO.class);
		QuickConnect.mapCommandToVCO("listUsers", HideKeyboardVCO.class);
		QuickConnect.mapCommandToVCO("listUsers", DisplayUsersVCO.class);
		
		//the stack for making and handling the results of an HTTP request
		QuickConnect.mapCommandToValCO("getRemote", UrlCheckValCO.class);
		QuickConnect.mapCommandToBCO("getRemote", HttpGetRequestBCO.class);
		QuickConnect.mapCommandToVCO("getRemote", HideKeyboardVCO.class);
		QuickConnect.mapCommandToVCO("getRemote", DisplayHTTPGetResultsVCO.class);
		
		QuickConnect.mapCommandToECO("badName", BadNameECO.class);
	}
	@Override
    public void onCreate(Bundle savedInstanceState) {
		
        super.onCreate(savedInstanceState);
        final Activity self = this;
		/*
		 * setup the view
		 */
        setContentView(R.layout.main);
        
        resultDisplay = (TextView)this.findViewById(R.id.results);
        nameInput = (EditText)this.findViewById(R.id.nameEntry);
        urlInput = (EditText)this.findViewById(R.id.urlEntry);
        
        Button httpQueryButton = (Button)this.findViewById(R.id.httpQueryButton);
        httpQueryButton.setOnClickListener(new OnClickListener() {
			    public void onClick(View v) {
			    	HashMap<String,Object> parameters = new HashMap<String,Object>();
			    	parameters.put("activity", self);
			    	parameters.put("URLinput",urlInput);
			    	parameters.put("resultDisplay",resultDisplay);
			    	QuickConnect.handleRequest("getRemote", parameters);
			    }
			});
        
        Button insertButton = (Button)this.findViewById(R.id.insertButton);
        insertButton.setOnClickListener(new OnClickListener() {
			    public void onClick(View v) {
					//System.out.println("Display Thread: "+Thread.currentThread());
			    	HashMap<String,Object> parameters = new HashMap<String,Object>();
			    	parameters.put("activity",self);
			    	parameters.put("nameInput",nameInput);
			    	parameters.put("resultDisplay",resultDisplay);
			    	QuickConnect.handleRequest("insertName", parameters);
			    }
			});
        Button showAllButton = (Button)this.findViewById(R.id.queryButton);
        showAllButton.setOnClickListener(new OnClickListener() {
		    public void onClick(View v) {
		    	try {
			    	HashMap<String,Object> parameters = new HashMap<String,Object>();
			    	parameters.put("activity",self);
			    	parameters.put("nameInput",nameInput);
			    	parameters.put("resultDisplay",resultDisplay);
			    	QuickConnect.handleRequest("listUsers", parameters);
				} catch (Exception e) {
					e.printStackTrace();
				}
		    	//display the results
		    }
		});
    }
}