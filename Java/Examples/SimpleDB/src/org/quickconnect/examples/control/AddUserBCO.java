package org.quickconnect.examples.control;


import java.util.HashMap;
import java.util.UUID;

import org.quickconnect.ControlObject;
import org.quickconnect.QC;
import org.quickconnect.QuickConnect;
import org.quickconnect.dbaccess.DataAccessObject;
import org.quickconnect.dbaccess.DataAccessResult;

import android.app.Activity;
import android.widget.EditText;

public class AddUserBCO implements ControlObject {

	public Object handleIt(HashMap<String,Object> parameters) {
		Activity theActivity = (Activity)parameters.get("activity");
		EditText nameInput = (EditText)parameters.get("nameInput");
		String nameToAdd = nameInput.getEditableText().toString().trim();
    	String[]statementParams = {UUID.randomUUID().toString(), nameToAdd};
    	try {
    		DataAccessResult aResult = DataAccessObject.setData(theActivity, "demo.sqlite", 
    						"INSERT INTO user VALUES(?,?)", 
    						statementParams);
    		parameters.put("insertUserResult", aResult);
    		return QC.CONTINUE_STACK;
		} catch (Exception e) {
			e.printStackTrace();
			parameters.put("error",e);
			QuickConnect.handleError("dbError", parameters);
		}
		return QC.EXIT_STACK;
	}

}
