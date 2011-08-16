package org.quickconnect.examples.control;

import java.net.MalformedURLException;
import java.net.URL;
import java.util.ArrayList;
import java.util.HashMap;

import org.quickconnect.ControlObject;
import org.quickconnect.QC;

import android.widget.EditText;

public class UrlCheckValCO implements ControlObject {

	public Object handleIt(HashMap<String,Object> parameters) {
		EditText urlInput = (EditText)parameters.get("URLinput");
		String urlString = urlInput.getEditableText().toString().trim();
		if(urlString.length() == 0){
			return QC.EXIT_STACK;
		}
		try {
			if(!urlString.startsWith("http")){
				urlString = "http://"+urlString;
			}
			URL checkedURL = new URL(urlString);
			parameters.put("validURL",checkedURL);
		} catch (MalformedURLException e) {
			return QC.EXIT_STACK;
		}
		return QC.CONTINUE_STACK;
	}
}
