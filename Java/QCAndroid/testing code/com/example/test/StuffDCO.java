package com.example.test;

import java.util.HashMap;

import org.quickconnectfamily.ControlObject;
import org.quickconnectfamily.QC;

public class StuffDCO implements ControlObject {

	@Override
	public Boolean handleIt(HashMap<Object, Object> parameters) {
		System.out.println("worker thread: "+Thread.currentThread().getId());
		double aValue = (Double)parameters.get("num");
		aValue = 10 + aValue;
		parameters.put("modified", aValue);
		return QC.STACK_CONTINUE;
	}

}
