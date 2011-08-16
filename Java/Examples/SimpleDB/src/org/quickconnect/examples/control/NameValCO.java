package org.quickconnect.examples.control;

import java.util.HashMap;

import org.quickconnect.ControlObject;
import org.quickconnect.QC;
import org.quickconnect.QuickConnect;

import android.widget.EditText;

public class NameValCO implements ControlObject {

	public Object handleIt(HashMap<String,Object> parameters) {
		EditText nameInput = (EditText)parameters.get("nameInput");
		String nameToAdd = nameInput.getEditableText().toString().trim();
    	if(nameToAdd.length() == 0){
    		QuickConnect.handleError("badName", parameters);
    		return QC.EXIT_STACK;
    	}
    	return QC.CONTINUE_STACK;
	}

}
