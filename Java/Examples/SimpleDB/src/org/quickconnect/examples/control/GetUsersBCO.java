package org.quickconnect.examples.control;

import java.util.ArrayList;
import java.util.HashMap;

import org.quickconnect.ControlObject;
import org.quickconnect.QC;
import org.quickconnect.QuickConnect;
import org.quickconnect.dbaccess.DataAccessException;
import org.quickconnect.dbaccess.DataAccessObject;

import android.app.Activity;
import android.widget.EditText;

public class GetUsersBCO implements ControlObject {

	public Object handleIt(HashMap<String,Object> parameters) {
		//System.out.println("getting users");
		Activity theActivity = (Activity)parameters.get("activity");
		String sql = "SELECT * FROM user";
		String[] statementParams = null;
		EditText nameInput = (EditText)parameters.get("nameInput");
		String name = nameInput.getEditableText().toString().trim();
		if(name.length() > 0){
			sql += " WHERE name = ?";
			statementParams = new String[1];
			statementParams[0] = name;
		}
		try {
			Object queryResults = DataAccessObject.getData(theActivity, "demo.sqlite", sql, statementParams);
			//System.out.println("results: "+queryResults);
			parameters.put("userResults", queryResults);
		} catch (DataAccessException e) {
			e.printStackTrace();
			parameters.put("error",e);
			QuickConnect.handleError("dberror", parameters);
			return QC.EXIT_STACK;
		}
		return QC.CONTINUE_STACK;
	}
}
