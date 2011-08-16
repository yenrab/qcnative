package org.quickconnect.examples.control;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;

import org.quickconnect.ControlObject;
import org.quickconnect.QC;
import org.quickconnect.dbaccess.DataAccessResult;

import android.view.inputmethod.InputMethodManager;
import android.widget.TextView;

public class DisplayUsersVCO implements ControlObject {

	public Object handleIt(HashMap<String,Object> parameters) {

		TextView resultDisplay = (TextView)parameters.get("resultDisplay");
		DataAccessResult theQueryResult = (DataAccessResult)parameters.get("userResults");
		
		String displayString = "No results found.";
		ArrayList<ArrayList<String>>resultantTable = theQueryResult.getResults();
		if(resultantTable.size() > 0){
			//print out the result of each table row.
			StringBuilder aBuilder = new StringBuilder();
			Iterator<ArrayList<String>>rowIter = resultantTable.iterator();
			while(rowIter.hasNext()){
				ArrayList<String>row = rowIter.next();
				aBuilder.append(row.get(0)).append('\n').append(row.get(1)).append("\n\n");
			}
			displayString = aBuilder.toString();
		}
		resultDisplay.setText(displayString);
		return QC.EXIT_STACK;
	}
}
