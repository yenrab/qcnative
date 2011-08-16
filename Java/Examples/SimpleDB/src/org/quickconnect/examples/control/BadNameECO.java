package org.quickconnect.examples.control;

import java.util.HashMap;

import org.quickconnect.ControlObject;
import org.quickconnect.QC;

import android.widget.TextView;

public class BadNameECO implements ControlObject {

	public Object handleIt(HashMap<String,Object> parameters) {
		TextView resultDisplay = (TextView)parameters.get("resultDisplay");
		resultDisplay.setText("The name entered must have at least one character");
		return QC.EXIT_STACK;
	}
}
