package com.example.test;

import java.util.HashMap;

import org.quickconnectfamily.ControlObject;
import org.quickconnectfamily.QC;
import org.quickconnectfamily.QuickConnect;


public class StuffValCO implements ControlObject {
	@Override
	public Boolean handleIt(HashMap<Object, Object> parameters) {
		Object aThing = parameters.get("stuff");
		Object aNumber = parameters.get("num");
		if(aThing == null || aNumber == null){
			QuickConnect.handleError("missing", parameters);
			return QC.STACK_EXIT;
		}
		return QC.STACK_CONTINUE;
	}

}
