package org.quickconnect.examples.control;

import java.util.HashMap;

import org.quickconnect.ControlObject;
import org.quickconnect.QC;

import android.app.Activity;
import android.content.Context;
import android.view.inputmethod.InputMethodManager;
import android.widget.EditText;

public class HideKeyboardVCO implements ControlObject {

	public Object handleIt(HashMap<String, Object> parameters) {
		
		EditText usedEdit = (EditText) parameters.get("URLinput");
		if(usedEdit == null){
			usedEdit = (EditText)parameters.get("nameInput");
		}
    	Activity callingActivity = (Activity) parameters.get("activity");
    	((InputMethodManager) callingActivity.getSystemService(Context.INPUT_METHOD_SERVICE))  
        .hideSoftInputFromWindow(usedEdit.getWindowToken(), 0);
		return QC.CONTINUE_STACK;
	}

}
