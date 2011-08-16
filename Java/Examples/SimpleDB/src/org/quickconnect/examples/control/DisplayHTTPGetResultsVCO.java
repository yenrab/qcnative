package org.quickconnect.examples.control;

import java.util.HashMap;

import org.quickconnect.ControlObject;
import org.quickconnect.QC;

import android.widget.TextView;

public class DisplayHTTPGetResultsVCO implements ControlObject {

	public Object handleIt(HashMap<String,Object> parameters) {
		TextView resultDisplay = (TextView)parameters.get("resultDisplay");
		String results = (String)parameters.get("GETResult");
		resultDisplay.setText(results);
		return QC.EXIT_STACK;
	}

}
